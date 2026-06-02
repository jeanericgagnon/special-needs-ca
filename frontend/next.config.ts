import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    '/**/*': ['./ca_disability_crawler.db', './ca_disability_navigator.db'],
  },
};

export default nextConfig;
