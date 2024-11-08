import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import StimulusHMR from 'vite-plugin-stimulus-hmr'

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
          fileName: "assets/custom.js",
          name: "entrypoints/custom_plugin_example.js",
          type: "asset",
          source: "console.log('Our custom plugin in action!')",
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
  ],
})
