const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Razorpay Setup ---
const razorpay = new Razorpay({
  key_id: 'rzp_test_SZlNsaYYbenJQA',
  key_secret: 'r8l9u3RlbXAvciop0eexonVi',
});

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
const admin = require('./firebaseAdmin');

// 1. Signup: Verify Firebase Token & Create User
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, phone, role, idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'ID Token required' });
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const verifiedPhone = decodedToken.phone_number; // e.g. +919999999999
    
    // Check if user already exists
    let user = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    });
    
    if (user) {
      return res.status(400).json({ error: 'User with this email or phone already exists' });
    }
    
    // Create new user
    user = await prisma.user.create({
      data: { name, email, phone, role: role || 'renter', isVerified: true }
    });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token or signup failed' });
  }
});

// 2. Login: Verify Firebase Token & Return JWT
app.post('/api/auth/login', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'ID Token required' });
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phoneWithCountry = decodedToken.phone_number; // e.g. +919999999999
    
    // The database might store phone as 10 digits without +91. Let's handle both.
    const phoneLocal = phoneWithCountry.replace('+91', '');
    
    const user = await prisma.user.findFirst({
      where: { OR: [{ phone: phoneWithCountry }, { phone: phoneLocal }] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 3. User Profile: Update
app.put('/api/profile', authenticateToken, async (req, res) => {
  const { name, email, location, upiId } = req.body;
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email, location, upiId }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// 3.5 User Profile: KYC Verify (Dummy DigiLocker)
app.put('/api/profile/kyc', authenticateToken, async (req, res) => {
  const { otp, legalName } = req.body;
  if (otp !== '1234') return res.status(400).json({ error: 'Invalid OTP' });
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        isVerified: true,
        legalName: legalName || req.user.name 
      }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify KYC' });
  }
});

// --- Payment & Subscription Routes ---

// 1. Create Order
app.post('/api/payment/create-order', authenticateToken, async (req, res) => {
  const options = {
    amount: 499 * 100, // amount in smallest currency unit (paise)
    currency: "INR",
    receipt: `receipt_order_${req.user.id}_${Date.now()}`
  };
  
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 2. Verify Payment
app.post('/api/payment/verify', authenticateToken, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", "r8l9u3RlbXAvciop0eexonVi")
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Payment verified, update subscriptionEnd date
    try {
      const now = new Date();
      // Add 30 days
      const newExpiry = new Date(now.setDate(now.getDate() + 30));
      
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { subscriptionEnd: newExpiry }
      });
      res.json({ message: "Payment verified successfully", user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: 'Database update failed after payment' });
    }
  } else {
    res.status(400).json({ error: "Invalid payment signature!" });
  }
});

// --- Room Routes ---

// 4. Rooms: Get all available rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { status: 'vacant' },
      include: { owner: { select: { name: true, phone: true, subscriptionEnd: true } } }
    });
    
    // Filter out rooms where owner's subscription is expired
    const activeRooms = rooms.filter(r => {
      if (!r.owner.subscriptionEnd) return false;
      const expiry = new Date(r.owner.subscriptionEnd);
      return expiry > new Date();
    });
    
    res.json(activeRooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// 6. Get Room Details (For Renter)
app.get('/api/rooms/:id', async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { name: true, isVerified: true, legalName: true } },
        reviews: {
          include: { reviewer: { select: { name: true, legalName: true } } }
        }
      }
    });if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room details' });
  }
});

// 5. Rooms: Create a new room (Owner only)
app.post('/api/rooms', authenticateToken, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Only owners can create rooms' });
  
  const { title, address, city, rent, advance, type, amenities, photos } = req.body;
  
  try {
    const newRoom = await prisma.room.create({
      data: {
        title, address, city, rent: Number(rent), advance: Number(advance), type, amenities, photos,
        ownerId: req.user.id
      }
    });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// 6. Rooms: Get owner's rooms
app.get('/api/owner/rooms', authenticateToken, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Forbidden' });
  
  try {
    const rooms = await prisma.room.findMany({ where: { ownerId: req.user.id } });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// --- Bookings & Enquiries ---

// 7. Create a Booking (Renter)
app.post('/api/bookings', authenticateToken, async (req, res) => {
  const { roomId, amountPaid, platformFee, status, durationMonths } = req.body;
  
  try {
    const booking = await prisma.booking.create({
      data: {
        roomId,
        renterId: req.user.id,
        amountPaid: Number(amountPaid),
        platformFee: Number(platformFee),
        status: status || 'escrow',
        durationMonths: durationMonths ? Number(durationMonths) : 1
      }
    });

    // Notify the owner
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    const renter = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (room && renter) {
      await prisma.notification.create({
        data: {
          userId: room.ownerId,
          message: `💰 ${renter.name} has paid ₹${amountPaid} to secure your ${room.type}!`
        }
      });
      // Optionally update room status to occupied if it's an online payment
      if (status === 'escrow' || status === 'completed') {
        await prisma.room.update({
          where: { id: roomId },
          data: { status: 'occupied' }
        });
      }
    }
    
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// 8. Get Renter's Bookings
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { renterId: req.user.id },
      include: { room: { include: { owner: { select: { name: true, legalName: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// 9. Get Owner's Enquiries and Bookings
app.get('/api/owner/bookings', authenticateToken, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Forbidden' });
  try {
    const bookings = await prisma.booking.findMany({
      where: { room: { ownerId: req.user.id } },
      include: { 
        renter: { select: { name: true, phone: true, legalName: true } },
        room: { select: { type: true, city: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch owner bookings' });
  }
});

// --- Shortlists & Notifications ---

// 5. Shortlist a Room (Toggle)
app.post('/api/shortlist/:roomId', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    
    // Check if room exists
    const room = await prisma.room.findUnique({ where: { id: roomId }, include: { owner: true } });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // Check if already shortlisted
    const existing = await prisma.shortlist.findUnique({
      where: { renterId_roomId: { renterId: userId, roomId: roomId } }
    });

    if (existing) {
      // Remove from shortlist
      await prisma.shortlist.delete({ where: { id: existing.id } });
      res.json({ message: 'Removed from shortlists', isShortlisted: false });
    } else {
      // Add to shortlist
      await prisma.shortlist.create({ data: { renterId: userId, roomId: roomId } });
      
      // Notify Owner
      const renter = await prisma.user.findUnique({ where: { id: userId } });
      await prisma.notification.create({
        data: {
          userId: room.ownerId,
          message: `❤️ ${renter.name || 'A user'} has shortlisted your ${room.type} in ${room.city}!`
        }
      });
      res.json({ message: 'Added to shortlists', isShortlisted: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle shortlist' });
  }
});

// 6. Get Renter's Shortlists
app.get('/api/shortlists', authenticateToken, async (req, res) => {
  try {
    const shortlists = await prisma.shortlist.findMany({
      where: { renterId: req.user.id },
      include: { room: { include: { owner: { select: { name: true, phone: true } } } } }
    });
    res.json(shortlists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shortlists' });
  }
});

// 7. Get User Notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// --- Reviews ---
app.post('/api/reviews', authenticateToken, async (req, res) => {
  const { roomId, targetUserId, rating, comment } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        reviewerId: req.user.id,
        targetUserId,
        roomId,
        rating: Number(rating),
        comment
      }
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

app.get('/api/rooms/:id/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { roomId: req.params.id },
      include: { reviewer: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 CityRoom Backend running on port ${PORT}`);
});
