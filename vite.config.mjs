import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import StimulusHMR from 'vite-plugin-stimulus-hmr'
import CustomPluginExample from './vite_support/custom_plugin_example.mjs'
import ProcessLegacyCode from './vite_support/process_legacy_code.mjs'


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
