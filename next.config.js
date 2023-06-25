const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, options) => {
    config.externals.push({
      '@aws-sdk/signature-v4-crt': '@aws-sdk/signature-v4-crt',
    });

    return config;
  },
};
