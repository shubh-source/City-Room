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

// 1. Signup: Send OTP
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, phone, role } = req.body;
  if (!name || !email || !phone) return res.status(400).json({ error: 'Name, email, and phone are required' });
  
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] }
  });
  
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email or phone already exists' });
  }
  
  console.log(`Sending OTP 1234 to ${phone}`);
  res.json({ message: 'OTP sent successfully', mockOtp: '1234' });
});

// 2. Signup: Verify OTP
app.post('/api/auth/verify-signup', async (req, res) => {
  const { name, email, phone, role, otp } = req.body;
  
  if (otp !== '1234') return res.status(400).json({ error: 'Invalid OTP' });
  
  try {
    const user = await prisma.user.create({
      data: { name, email, phone, role: role || 'renter', isVerified: true }
    });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. Login: Send OTP
app.post('/api/auth/login', async (req, res) => {
  const { identifier } = req.body; // can be email or phone
  if (!identifier) return res.status(400).json({ error: 'Email or phone required' });
  
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] }
  });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found. Please sign up first.' });
  }
  
  console.log(`Sending OTP 1234 to ${identifier}`);
  res.json({ message: 'OTP sent successfully', mockOtp: '1234' });
});

// 4. Login: Verify OTP
app.post('/api/auth/verify-login', async (req, res) => {
  const { identifier, otp } = req.body;
  
  if (otp !== '1234') return res.status(400).json({ error: 'Invalid OTP' });
  
  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] }
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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
  const { otp } = req.body;
  if (otp !== '1234') return res.status(400).json({ error: 'Invalid OTP' });
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { isVerified: true }
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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 CityRoom Backend running on port ${PORT}`);
});
