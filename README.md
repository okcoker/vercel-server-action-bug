### Vercel function bug

This is a simple Next.js app that demonstrates a bug with Vercel functions.

When you upload a file larger than 4.5MB, vercel throws a FUNCTION_PAYLOAD_TOO_LARGE error.

Currently, when that error happens, the server action is not called and subsequently the catch block executed. The promise is instead resolved as if the server action succeeded.

