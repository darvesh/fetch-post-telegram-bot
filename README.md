# Fetch Post Telegram Bot

> A telegram bot that fetches video/image/gif from the link you send.

### Supported websites

1. Reddit.
2. Instagram.
3. Many coming soon.

Telegram Bot Link : [FetchPostBot](https://t.me/fetchpostbot)
(You can use this bot only if you are whitelisted by me)

## Dependencies

You need to have _ffmpeg_ installed. Download it from [here](https://ffmpeg.org/download.html)

## Usage

1. Clone the repository and cd fetch-post-telegram-bot
2. Run `cp src/example.config.js src/config`.
3. Create and grab bot token from `@botfather` and add it to `src/config.ts`
4. If you are hosting [telegram-bot-api](https://github.com/tdlib/telegram-bot-api), add the API url to `config.js` otherwise keep BOT_API_URL as it is<sup>1</sup>.
5. `npm install`
6. `npm build && npm start`

> <sup>1</sup>If you don't host telegram-bot-api, [bot can't send files larger than 50MB](https://core.telegram.org/bots/api#sending-files)

## Commands

Master user can manage whitelist with these commands.

### To whitelist a user

```
/add <user_id> <name_or_username>
```

### To get list of whitelisted users

```
/list
```

### To remove a whitelisted user click `/rm_<user-id>` from the list<br>

## Todo

-   [ ] Inline support for image/gif/videos which doesn't use ffmpeg or youtube-dl
-   [ ] Reddit crosspost support
