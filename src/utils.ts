export const parseURL = (
	regex: InstanceType<typeof RegExp>,
	url: string
): string => {
	const link = url.match(regex)?.[0];
	if (link) return link;
	throw new Error("Invalid URL");
};