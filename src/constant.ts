export const INSTAGRAM_REGEX = /instagram.com\/p\/[\w-_]+/;
export const REDDIT_REGEX = /redd\.it|^((https:\/\/)?(www\.)?)?(old\.)?reddit\.com\/r\/\w+\/comments\/\w+\/\w+\/?/g;
export const REDDIT_REGEX_ONE = /redd\.it/;
export const REDDIT_REGEX_TWO = /^((https:\/\/)?(www\.)?)?(old\.)?reddit\.com\/r\/\w+\/comments\/\w+\/\w+\/?/g;
export const ERRORS = {
	INVALID_LINK: "Link is invalid or not supported",
	INVALID_POST: "This link couldn't be processed, try sending other link",
	NO_MEDIA: "No media could be found from this link/post",
	UNKNOWN:
		"This post's media size is too large or this bot is not capable of fetching this post's media yet"
} as const;

export const headers = `"User-Agent:'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0'"`;
