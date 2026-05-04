/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't fail production builds on lint warnings/errors.
  // We still run ESLint locally and in CI; this just keeps Vercel deploys
  // from blocking on stylistic issues you can fix in a follow-up commit.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TS errors still fail builds — that's correct.
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  webpack: (config) => {
    // tldraw asset handling
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
    })
    return config
  },
}

export default nextConfig
