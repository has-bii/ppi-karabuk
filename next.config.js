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
      {
        protocol: "https",
        hostname: "img.ppi-karabuk.com",
        port: "",
        pathname: "*",
      },
    ],
  },
}

module.exports = nextConfig
