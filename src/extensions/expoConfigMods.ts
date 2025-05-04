import { GluegunToolbox } from 'gluegun'

import type { ExpoConfig } from '@expo/config-types'
import { ExpoConfigModifier, ExpoConfigModifierParams } from '../types'

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

const modifyExpoConfig = (
  expoConfig: ExpoConfig,
  modifiers: {
    method: ExpoConfigModifier
    params?: ExpoConfigModifierParams
  }[]
): ExpoConfig =>
  modifiers.reduce(
    (expoConfigAcc, modifier) =>
      modifier.method(expoConfigAcc, modifier.params),
    expoConfig
  )

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.expoConfigMods = {
    addTVToExpoConfigPlugins,
    removeDevClientFromExpoConfigPlugins,
    modifyExpoConfig,
  }
}
