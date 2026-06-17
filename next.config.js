/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enables instrumentation.js (auto-starts the Discuss AI bot on boot).
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
