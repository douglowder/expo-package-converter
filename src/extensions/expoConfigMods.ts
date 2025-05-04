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
  return addPlugin(expoConfig, '@react-native-tvos/config-tv')
}

const modifyExpoConfigForTV = (expoConfig: ExpoConfig): ExpoConfig => {
  if (!expoConfig) {
    throw new Error('No expo config specified')
  }
  return addTVToExpoConfigPlugins(expoConfig)
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
    modifyExpoConfigForTV,
    modifyExpoConfig,
  }
}
