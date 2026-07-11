const admin = require('firebase-admin');

let serviceAccount;
if (process.env.FIREBASE_B64) {
  serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_B64, 'base64').toString('utf8'));
} else {
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
