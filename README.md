# trecamp-server

  
# 開発環境
localhostで立てたサーバーを外部からアクセスできるようにしなければならない。デプロイすればいいが、毎回デプロイするのは面倒なので、`ngrok`を用いてlocalhostを外部公開する。  
`ngrok`で立てたサーバーの有効期限は８時間なので、面倒だけど毎回変更する。

server/functionsで`npm run serve`  
これでlocalhost:5000が立ち上がる。  
別タブで  
`npm run staging`
これでhttps://◯◯◯.ngrok.io のようにURLが発行される。

LINE botのWebhook URLに設定（◯◯◯の部分を変える）.

# 技術スタック
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


### initialization
- Gitアカウント作成→招待される
- Gitのインストール
    - ローカルに作業用ディレクトリを作り、そこにgit clone
- VScodeのインストール
- node.jsのインストール
    - npm -vコマンドがきくことを確かめる
- firebaseに招待してもらう
- firebaseのインストール
    - npm install -g firebase-tools 
- ngrokのインストール
    - npm i -g ngrok

### documents

- firebase  
https://firebase.google.com/docs/web/setup?hl=ja

- line bot  
https://developers.line.biz/console/channel/1573235259/basic/

- passport  
http://www.passportjs.org/docs/authenticate/
