import * as line from '@line/bot-sdk';
import * as express from 'express';
import { lineToken } from '../config';

export const middleware = (req: express.Request) => {
  const signature = req.get('x-line-signature');
  if (!signature) {
    throw new line.SignatureValidationFailed('no signature');
  }
  if (!line.validateSignature(JSON.stringify(req.body), lineToken.channelSecret, signature)) {
    throw new line.SignatureValidationFailed('signature validation failed', signature);
  }
};
