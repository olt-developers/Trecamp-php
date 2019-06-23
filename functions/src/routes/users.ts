import * as express from 'express';
import { db } from '../firestore';

export const router = express.Router();

router.get('/', async (req, res, next) => {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map(doc => doc.data());
  res.json(users);
});
