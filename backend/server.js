const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// 4. Rooms: Get all available rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { status: 'vacant' },
      include: { owner: { select: { name: true, phone: true } } }
    });
    res.json(rooms);
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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 CityRoom Backend running on http://localhost:${PORT}`);
});


