import * as express from 'express';
import { trainingsRef, typesRef } from '../firestore';
import { FieldValue } from '@google-cloud/firestore';

export const router = express.Router();

router.get('/', async (req, res, next) => {
  const snapshot = await trainingsRef.get();
  const trainings = snapshot.docs.map(doc => doc.data());
  res.json(trainings);
});

router.post('/', async (req, res, next) => {
  const typeIndex = req.body.type;
  const snapshot = await typesRef.doc(`${typeIndex}`).get();
  const type = snapshot.data();
  if (!type) {
    return res.status(500).end();
  }
  const training = {
    uid: req.body.uid,
    date: req.body.date,
    type: typeIndex,
    value: req.body.value,
    score: req.body.value * type.point,
    comment: req.body.comment || '',
    createdAt: FieldValue.serverTimestamp(),
  };
  trainingsRef.add(training);
  res.json(training);
});
