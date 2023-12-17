/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        port: "",
        pathname: "/v/**",
      },
      {
        protocol: "https",
        hostname: "blog.ppi-karabuk.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
}

module.exports = nextConfig
