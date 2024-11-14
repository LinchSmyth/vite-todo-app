import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import StimulusHMR from 'vite-plugin-stimulus-hmr'
import { rollup } from 'rollup'
import chokidar from 'chokidar'
import { build } from 'esbuild'
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

// TODO: use esbuild for both dev and prod bundles?
// TODO: caching?
// TODO: try to parallelize bundling
// TODO: use terser for minification
const bundle = async (inputs) => {
  let output = []

  for (const input of inputs) {
    const bundle = await rollup({
      input,
      treeshake: false
    })
    const bundled = await bundle.generate({
      format: 'es'
    })
    output = output.concat(bundled.output)
  }

  return output
}

/**
 * @param outputFileName {String}
 * @param files {Array<String>}
 * @returns {Array<{code: String}>}
 * @constructor
 */
const ProcessLegacyCode = (outputFileName, files) => {
  let config
  let fileWatcher

  return {
    name: 'process-legacy-code',
    configResolved (viteConfig) {
      config = viteConfig
    },
    configureServer (server) {
      const reloadPage = () => {
        server.ws.send({ type: 'full-reload', path: '*' })
      }

      fileWatcher = chokidar
        .watch(files, {
          ignoreInitial: true // Don't trigger chokidar on instantiation.
        })
        .on('add', reloadPage)
        .on('change', reloadPage)
        .on('unlink', reloadPage)

      server.middlewares.use(async (req, res, next) => {
        if (!req.url.includes(`vite-dev/entrypoints/${outputFileName}.js`)) {
          return next()
        }

        let code = ''
        let result = await build({
          entryPoints: files,
          sourcemap: false,
          minify: false,
          write: false,
          bundle: true,
          treeShaking: false,
          outdir: 'x',
          format: 'esm'
        })

        for (let out of result.outputFiles) {
          code += out.text
        }

        res.statusCode = 200
        res.end(code)
      })
    },
    async generateBundle (_options) {
      if (!config.build.manifest) { return }

      const chunks = await bundle(files)

      let code = ''
      for (const chunk of chunks) {
        code += chunk.code
      }

      const hash = getHash(code)

      this.emitFile({
        fileName: `assets/${outputFileName}-${hash}.js`,
        name: `entrypoints/${outputFileName}.js`,
        type: 'asset',
        source: code,
      })
    },
    async closeBundle () {
      await fileWatcher?.close()
    },
  }
}

export default defineConfig({
  plugins: [
    RubyPlugin(),
    StimulusHMR(),
    CustomPluginExample(),
    ProcessLegacyCode('legacy', [
      './app/javascript/legacy/bar.js',
      './app/javascript/legacy/foo.js',
    ]),
  ],
})
