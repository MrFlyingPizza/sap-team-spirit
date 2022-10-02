/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/0',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
