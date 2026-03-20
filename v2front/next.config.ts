import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disabled to avoid double-invoking effects during development
  reactStrictMode: false,
}

export default nextConfig
