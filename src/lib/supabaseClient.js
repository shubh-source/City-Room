import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock data layer to use before DB is fully ready
export const MockDB = {
  users: [
    { id: '1', role: 'owner', name: 'Ramesh Singh', phone: '+919876543210' },
    { id: '2', role: 'renter', name: 'Amit Kumar', phone: '+919876543211' }
  ],
  rooms: [
    {
      id: '101',
      owner_id: '1',
      city: 'Jaipur',
      address: 'Malviya Nagar, Sector 4',
      rent: 5000,
      advance: 2000,
      status: 'vacant',
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop'],
      amenities: ['WiFi', 'AC', 'Attached Bath']
    },
    {
      id: '102',
      owner_id: '1',
      city: 'Jaipur',
      address: 'Raja Park',
      rent: 8000,
      advance: 3000,
      status: 'occupied',
      photos: ['https://images.unsplash.com/photo-1502672260266-1c1de2d93688?q=80&w=2000&auto=format&fit=crop'],
      amenities: ['Furnished', 'Balcony']
    }
  ]
};
