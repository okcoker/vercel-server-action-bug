/** @type {import('next').NextConfig} */

module.exports = {
  experimental: {
    serverActions: {
      // The image doesnt have to be this large but gives some buffer
      // for the rest of the post body
      bodySizeLimit: "100mb",
    },
  },
};
