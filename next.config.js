module.exports = {
  trailingSlash: true,
  poweredByHeader: false,
  async exportPathMap() {
    return {
      '/': { page: '/' },
    };
  },
  images: {
    unoptimized: true,
  },
};
