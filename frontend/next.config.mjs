/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // other configurations...
  
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          dns: false,
          fs: false,
          net: false,
          tls: false,
          child_process: false,
          timers: 'timers-browserify',
          'timers/promises': false,
        };
        
        // Add this line to exclude mongodb from client-side bundling
        config.externals = [...(config.externals || []), 'mongodb'];
      }
      return config;
    },
  
    async headers() {
      return [
        {
          source: '/dashboard/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, max-age=0',
            },
          ],
        },
      ];
    },
  }
  
  export default nextConfig