import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(require('../../config/serviceAccountKey.json')),
  databaseURL: 'https://trecamp-server.firebaseio.com',
});

export const db = admin.firestore();
db.settings({
  timestampsInSnapshots: true,
});

export const usersRef = db.collection('users');
export const noncesRef = db.collection('nonces');
export const trainingsRef = db.collection('trainings');
export const typesRef = db.collection('types');
