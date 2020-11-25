export const headers = {
	"User-Agent":
		"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0",
	Referer: "https://www.reddit.com/"
};

export const ERRORS = {
	INVALID_URL: "URL is invalid.",
	INVALID_TYPE: "I don't support dowloading this post file type yet.",
	INVALID_POST: "This post file can't be downloaded"
} as const;

export const placeholder = "https://ibb.co/rvYSLg5";

export const imageRegex = /\.(jpg|jpeg|png)$/;
export const gifRegex = /\.(gif|gifv)$/;
export const imgurRegex = /https\:\/\/(?:.\.)?imgur.com\/(\w+)\.[a-z]{3,4}/i;
export const linkRegex = /^((https\:\/\/)?(www\.)?)?(old\.)?reddit\.com\/r\/\w+\/comments\/\w+\/\w+\/?/g;