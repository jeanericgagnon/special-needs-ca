const nextConfig = {
  turbopack: {
    root: new URL('.', import.meta.url).pathname,
  },
  outputFileTracingIncludes: {
    '/**/*': ['./ca_disability_crawler.db', './ca_disability_navigator.db'],
  },
};

export default nextConfig;
