import * as line from '@line/bot-sdk';
import { AccountLinkEvent } from '@line/bot-sdk';
import { noncesRef, usersRef } from '../../firestore';

export const handleAccountLink = async (
  client: line.Client,
  profile: line.Profile,
  event: AccountLinkEvent
): Promise<any> => {
  const snapshot = await noncesRef.doc(event.link.nonce).get();
  const doc = snapshot.data();
  if (!doc || event.link.result !== 'ok') {
    return client.replyMessage(event.replyToken, {
      text: `@${profile.displayName}さん、連携失敗...`,
      type: 'text',
    });
  }
  usersRef.doc(doc.uid).update({
    lineId: event.source.userId,
  });
  return client.replyMessage(event.replyToken, {
    text: `@${profile.displayName}さん、連携成功！`,
    type: 'text',
  });
};
