import * as express from 'express';
import { db } from '../firestore';

export const router = express.Router();

router.get('/', async (req, res, next) => {
  const snapshot = await db.collection('trainings').get();
  const trainings = snapshot.docs.map(doc => doc.data());
  res.json(trainings);
});

router.post('/', async (req, res, next) => {
  console.log(req.body.name);
  console.log(req.body);
});
