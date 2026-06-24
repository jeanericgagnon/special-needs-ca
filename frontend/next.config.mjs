const nextConfig = {
  turbopack: {
    root: new URL('.', import.meta.url).pathname,
  },
  outputFileTracingIncludes: {
    '/**/*': ['./ca_disability_crawler.db', './ca_disability_navigator.db'],
  },
  async redirects() {
    return [
      {
        source: '/counties/:state/:slug',
        destination: '/benefits/:state/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
