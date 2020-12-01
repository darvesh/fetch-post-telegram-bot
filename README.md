# Fetch Post Telegram Bot 
>This bot returns video/image/gif from the link you send.

### Supported websites
1. Reddit.
2. Instagram.
3. Many coming soon.

Telegram Bot Link : [FetchPostBot](https://t.me/fetchpost)

## Work in Progress

## Dependencies
You need to have *ffmpeg* installed. Download it from [here](https://ffmpeg.org/download.html)
## Usage
1. Clone the repository and cd fetch-post-telegram-bot
2. Run `cp src/example.config.js src/config.
3. Create and grab bot token from `@botfather` and add it to `src/config.ts`
4. If you are hosting [telegram-bot-api](https://github.com/tdlib/telegram-bot-api), add the API url to `config.js` <sup>1</sup> otherwise keep BOT_API_URL as it is.
5. `npm install`
6. `npm build && npm start`

><sup>1</sup>If you don't host telegram-bot-api, [bot can't send file whose size is more than 50MB](https://core.telegram.org/bots/api#sending-files)


## Todo
[ ] Inline support for image/gi/videos which doesn't use ffmpeg or youtube-dl
[ ] Reddit crosspost support