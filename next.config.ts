import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["sanity", "@sanity/vision"],
  experimental: {
    viewTransition: true,
  },
  webpack: (config) => {
    const path = require("path");
    config.module = config.module ?? {};
    config.module.rules = config.module.rules ?? [];
    config.module.rules.push({
      test: /\.js$/,
      include: [
        /node_modules[\\/]sanity[\\/]/,
        /node_modules[\\/]@sanity[\\/]vision[\\/]/,
      ],
      use: [path.resolve(__dirname, "sanity-react-loader.js")],
    });
    return config;
  },
};


export default nextConfig;
