import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/humanize": ["./docs/engines/**/*.md"],
    "/api/humanize/demo": ["./docs/engines/**/*.md"],
    "/api/engines": ["./docs/engines/**/*.md"],
  },
};

export default nextConfig;
