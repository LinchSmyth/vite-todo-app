import { getHash } from './hash.mjs'

const CustomPluginExample = () => {
  let config

  const sourceCode = 'console.log("%cOur custom plugin in action!", "background:#b6ff97; color:#1a5700;")'

  return [
    {
      name: 'custom-plugin-example:build',
      configResolved (viteConfig) {
        config = viteConfig
      },
      configureServer (server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url.includes(`vite-dev/entrypoints/custom_plugin_example.js`)) {
            return next()
          }

          res.statusCode = 200
          res.end(sourceCode)
        })
      },
      generateBundle (_options) {
        if (!config.build.manifest) { return }

        this.emitFile({
          fileName: `assets/custom-${getHash(sourceCode)}.js`,
          name: 'entrypoints/custom_plugin_example.js',
          type: 'asset',
          source: sourceCode,
        })
      },
    }
  ]
}

export default CustomPluginExample
