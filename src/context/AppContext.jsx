import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState('Fetching Location...');
  const [userCoords, setUserCoords] = useState(null);
  
  // 1. Check for persistent login
  useEffect(() => {
    const savedUser = localStorage.getItem('homedo_user');
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
    const savedLocation = localStorage.getItem('homedo_location');
    const savedCoords = localStorage.getItem('homedo_coords');
    if (savedCoords) {
      try { setUserCoords(JSON.parse(savedCoords)); } catch(e){}
    }
    
    if (savedLocation) {
      setUserLocation(savedLocation);
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              setUserCoords([latitude, longitude]);
              localStorage.setItem('homedo_coords', JSON.stringify([latitude, longitude]));
              // Reverse Geocoding using Nominatim API (Free, no key needed)
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              
              let city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown Location';
              setUserLocation(city);
              localStorage.setItem('homedo_location', city);
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

  const updateLocation = (newLocation, coords = null) => {
    setUserLocation(newLocation);
    localStorage.setItem('homedo_location', newLocation);
    if (coords) {
      setUserCoords(coords);
      localStorage.setItem('homedo_coords', JSON.stringify(coords));
    } else {
      setUserCoords(null);
      localStorage.removeItem('homedo_coords');
    }
  };

  return (
    <AppContext.Provider value={{ user, setUser, userLocation, setUserLocation: updateLocation, userCoords, setUserCoords }}>
      {children}
    </AppContext.Provider>
  );
};
