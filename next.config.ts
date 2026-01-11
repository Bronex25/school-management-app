const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.pexels.com' },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig
