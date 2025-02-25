import { t } from "elysia";

export const ValidHandle = t.String({
	minLength: 3,
	maxLength: 253,
	pattern: '^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$'
});
