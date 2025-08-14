import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },

  esbuild: {
    jsx: "transform",
    jsxDev: false,
    jsxImportSource: "@",
    jsxInject: `import { jsx } from '@/jsx-runtime'`,
    jsxFactory: "jsx.component",
  },

  server: {
    proxy: {
      "/auth": "http://auth:3000",
      "/2fa": "http://auth:3000",
      "/profile": "http://profile:3001",
      "/friends": "http://friends:3002",
      "/block": "http://friends:3002",
      "/notifications": "ws://notifications:3003",
      "/chat": "ws://chat:3004",
      "/dashboard": "ws://dashboard:3005",
    },
    historyApiFallback: true,
  },
});

/*
	Here we have told esbuild that we want it 
	to transform any JSX code it finds in our source. 
	When building the code, it will inject the jsxInject 
	to the top of the file and use jsx.component 
	when transforming regular components.
*/
