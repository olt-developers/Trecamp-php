# trecamp-server

技術スタック
- Node.js
- TypeScript
- LINE Messaging API

and using Firebase
- Firestore
- Hosting

主な機能は
- 旧サイト(olt.main.jp)から完全移行
- LINEアカウントとトレキャンアカウントの連携
- botからのアクション
  - 週末にランキング報告
  
# server立て
`server/functions`で  
`npm run serve`  
別タブで  
`npm run staging`

https://◯◯◯.ngrok.io のようにURLが発行されるので、frontend, LINE botそれぞれに設定（◯◯◯の部分を変える）

### documents

- firebase  
https://firebase.google.com/docs/web/setup?hl=ja

- line bot  
https://developers.line.biz/console/channel/1573235259/basic/

- passport  
http://www.passportjs.org/docs/authenticate/
