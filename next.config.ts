import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "oneinhimbiblestudy.com" }],
        destination: "https://www.oneinhimbiblestudy.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
