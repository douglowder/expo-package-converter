import { GluegunToolbox } from 'gluegun'

import type { ExpoConfig } from '@expo/config-types'
import { ExpoConfigModifier } from 'expo-config-modifier/build'

const addPlugin = (expoConfig: ExpoConfig, pluginName: string): ExpoConfig => {
  return {
    ...expoConfig,
    plugins: [...(expoConfig.plugins ?? []), pluginName],
  }
}

const addTVToExpoConfigPlugins = (expoConfig: ExpoConfig): ExpoConfig => {
  if (!expoConfig) {
    throw new Error('No expo config specified')
  }
  return addPlugin(expoConfig, '@react-native-tvos/config-tv')
}

const removeDevClientFromExpoConfigPlugins = (
  expoConfig: ExpoConfig
): ExpoConfig => {
  if (!expoConfig) {
    throw new Error('No expo config specified')
  }
  return {
    ...expoConfig,
    plugins: (expoConfig.plugins ?? []).filter((plugin) => {
      if (typeof plugin === 'string') {
        return plugin !== 'expo-dev-client' && plugin !== 'expo-dev-launcher'
      }
      if (Array.isArray(plugin)) {
        return (
          plugin[0] !== 'expo-dev-client' && plugin[0] !== 'expo-dev-launcher'
        )
      }
      return true
    }),
  }
}

const expoConfigMods = {
  addTVToExpoConfigPlugins,
  removeDevClientFromExpoConfigPlugins,
}

const modifyExpoConfig = (
  expoConfig: ExpoConfig,
  modifiers: ExpoConfigModifier[]
): ExpoConfig =>
  modifiers.reduce((expoConfigAcc, modifier) => {
    if (typeof modifier === 'string') {
      return expoConfigMods[modifier](expoConfigAcc)
    }
    return expoConfigMods[modifier[0]](expoConfigAcc, modifier[1])
  }, expoConfig)

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.expoConfigMods = {
    modifyExpoConfig,
  }
}
