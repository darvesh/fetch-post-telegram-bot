export const INSTAGRAM_REGEX = /instagram/;
export const REDDIT_REGEX = /redd\.it|^((https\:\/\/)?(www\.)?)?(old\.)?reddit\.com\/r\/\w+\/comments\/\w+\/\w+\/?/g;
export const REDDIT_REGEX_ONE = /redd\.it/;
export const REDDIT_REGEX_TWO = /^((https\:\/\/)?(www\.)?)?(old\.)?reddit\.com\/r\/\w+\/comments\/\w+\/\w+\/?/g;

export const ERRORS = {
	INVALID_LINK: "LINK IS INVALID",
	INVALID_POST: "THIS LINK COULDN'T BE PROCESSED"
} as const;

export const headers = `"User-Agent:'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0'"`

export const placeholder = "https://ibb.co/rvYSLg5";