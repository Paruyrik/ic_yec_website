import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/*.png' },
      { pathname: '/*.svg' },
    ],
    remotePatterns: [
      // Local dev — Payload serves uploads at the same origin
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
      // Uploadthing CDN (production)
      { protocol: 'https', hostname: '*.ufs.sh' },
      { protocol: 'https', hostname: '*.utfs.io' },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
