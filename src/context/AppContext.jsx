import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState('Fetching Location...');
  
  // 1. Check for persistent login
  useEffect(() => {
    const savedUser = localStorage.getItem('cityroom_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user");
      }
    }
  }, []);

  // 2. Fetch Geolocation
  useEffect(() => {
    // If we already have a saved location in localStorage, use it first
    const savedLocation = localStorage.getItem('cityroom_location');
    if (savedLocation) {
      setUserLocation(savedLocation);
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Reverse Geocoding using Nominatim API (Free, no key needed)
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              
              let city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown Location';
              setUserLocation(city);
              localStorage.setItem('cityroom_location', city);
            } catch (err) {
              console.error("Geocoding failed", err);
              setUserLocation('Location Unknown');
            }
          },
          (error) => {
            console.error("Geolocation error:", error.message);
            setUserLocation('Select Location');
          }
        );
      } else {
        setUserLocation('Select Location');
      }
    }
  }, []);

  const updateLocation = (newLocation) => {
    setUserLocation(newLocation);
    localStorage.setItem('cityroom_location', newLocation);
  };

  return (
    <AppContext.Provider value={{ user, setUser, userLocation, setUserLocation: updateLocation }}>
      {children}
    </AppContext.Provider>
  );
};
