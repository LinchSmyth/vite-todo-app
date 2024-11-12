import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import StimulusHMR from 'vite-plugin-stimulus-hmr'
import { rollup } from 'rollup'

const CustomPluginExample = () => {
  let config;

  return [
    {
      name: 'custom-plugin-example:build',
      apply: 'build',
      configResolved(viteConfig) {
        config = viteConfig
      },
      generateBundle(_options) {
        if (!config.build.manifest) { return }

        this.emitFile({
          fileName: 'assets/custom.js',
          name: 'entrypoints/custom_plugin_example.js',
          type: 'asset',
          source: 'console.log("Our custom plugin in action!")',
        })
      },
    }
  ]
}

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
  let config;

  return [
    {
      name: 'process-legacy-code:build',
      apply: 'build',
      configResolved(viteConfig) {
        config = viteConfig
      },
      async generateBundle(_options) {
        if (!config.build.manifest) { return }

        const chunks = await bundle(files)

        let code = '';
        for (const chunk of chunks) {
          code += chunk.code
        }

        // TODO: compute code hash

        this.emitFile({
          fileName: `assets/${outputFileName}`,
          name: `entrypoints/${outputFileName}`,
          type: 'asset',
          source: code,
        })
      },
    }
  ]
}

export default defineConfig({
  plugins: [
    RubyPlugin(),
    StimulusHMR(),
    CustomPluginExample(),
    ProcessLegacyCode('legacy.js', [
      './app/javascript/legacy/bar.js',
      './app/javascript/legacy/foo.js',
    ]),
  ],
})
