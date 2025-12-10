/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/rematch-field",
  assetPrefix: "/rematch-field/",
};
export default nextConfig;