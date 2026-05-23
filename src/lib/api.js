const API_URL = 'http://localhost:5000/api';

export const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('cityroom_token');
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  post: async (endpoint, data) => {
    const token = localStorage.getItem('cityroom_token');
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  put: async (endpoint, data) => {
    const token = localStorage.getItem('cityroom_token');
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
