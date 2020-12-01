# Fetch Post Telegram Bot 
>This bot returns video/image/gif from the sent link.

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
2. Run `cp src/example.config.js src/config.ts`
3. Create and grab bot token from `@botfather` and add it to `src/config.ts`
2. `npm install`
3. `npm build && npm start`

## Todo
- [ ] Refactor
- [x] Fix reddit video downloading (combine audio and video with ffmpeg)
- [x] Support redd.it links
- [ ] Support crosspost links
- [x] Support giphy links  <!-- media.giphy.com --> 
