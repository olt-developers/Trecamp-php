import * as line from '@line/bot-sdk';
import { AccountLinkEvent } from '@line/bot-sdk';

export const handleAccountLink = async (
  client: line.Client,
  profile: line.Profile,
  event: AccountLinkEvent
): Promise<any> => {
  return event.link.result === 'ok'
    ? client.replyMessage(event.replyToken, {
        text: `@${profile.displayName}さん、連携成功！`,
        type: 'text',
      })
    : client.replyMessage(event.replyToken, {
        text: `@${profile.displayName}さん、連携失敗...`,
        type: 'text',
      });
};
