import chokidar from 'chokidar'
import { minify } from 'terser'
import { getHash } from './hash.mjs'
import { build } from 'esbuild'

// TODO: caching?
/**
 * @param outputFileName {String}
 * @param files {Array<String>}
 */
const ProcessLegacyCode = (outputFileName, files) => {
  const outdir = `./${outputFileName}`
  const outdirServe = `./${outputFileName}-dev`
  const bundle = (outdir) => build({
    entryPoints: files,
    outdir: outdir,
    bundle: true,
    sourcemap: false,
    minify: false,
    write: false,
    treeShaking: false,
    format: 'esm'
  })

  let config
  let fileWatcher

  return {
    name: 'process-legacy-code',
    configResolved (viteConfig) {
      config = viteConfig
    },
    configureServer (server) {
      const reloadPage = () => server.ws.send({ type: 'full-reload', path: '*' })

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

        const result = await bundle(outdirServe)

        let code = ''
        for (let out of result.outputFiles) {
          code += out.text
        }

        res.statusCode = 200
        res.end(code)
      })
    },
    async generateBundle (_options) {
      if (!config.build.manifest) { return }

      const result = await bundle(outdir)
      const files = {}
      for (let file of result.outputFiles) {
        files[file.path] = file.text
      }

      const { code } = await minify(files)
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

export default ProcessLegacyCode
