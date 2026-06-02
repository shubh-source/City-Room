const admin = require('firebase-admin');

// Initialize Firebase Admin (Since we are on Google Cloud Run, it can use the default service account automatically)
admin.initializeApp();

module.exports = admin;
