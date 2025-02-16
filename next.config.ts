/** @type {import('next').NextConfig} */


const nextConfig = {
  experimental: {
    // swcPlugins: [["@preact-signals/safe-react/swc", {mode: "auto",
    // }]],
    reactCompiler: true,
    // ppr: 'incremental',

  },
  


  // experimental: {
  //   serverActions: true,
  // },
  // webpack: (config, { dev, isServer }) => {
  //   if (!isServer) {
  //     Object.assign(config.resolve.alias, {
  //       react: 'preact/compat',
  //       'react-dom/test-utils': 'preact/test-utils',
  //       'react-dom': 'preact/compat',
  //       "react/jsx-runtime": "preact/jsx-runtime"
  //     })
  //   }

  //   return config
  // },
  typescript: {            //added 2023 to prevent typescript build errors
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
		unoptimized: true
	},
  output: 'export',
  devServer: {
    https: true, // Enable HTTPS in development
    // You can optionally provide your own certificate and key files:
    // https: {
    //   key: fs.readFileSync('./ssl/my-key.pem'),
    //   cert: fs.readFileSync('./ssl/my-cert.pem'),
    // },
  },

  // npx next dev --experimental-https
  
  reactStrictMode: false,
  
  
}

module.exports = nextConfig
