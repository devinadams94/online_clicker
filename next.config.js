/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Webpack configuration for Phaser
  webpack: (config) => {
    // Enable importing of shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });

    return config;
  },
}

module.exports = nextConfig
