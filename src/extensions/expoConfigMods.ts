import { GluegunToolbox } from 'gluegun'

import type { ExpoConfig } from '@expo/config-types'

const addPlugin = (expoConfig: ExpoConfig, pluginName: string): ExpoConfig => {
  return {
    ...expoConfig,
    plugins: [...(expoConfig.plugins ?? []), pluginName],
  }
}

const addTVConfigPlugin = (expoConfig: ExpoConfig): ExpoConfig => {
  return addPlugin(expoConfig, '@react-native-tvos/config-tv')
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.packageMods = {
    addTVConfigPlugin,
  }
}
