import type { ExpoConfig } from '@expo/config-types'

// expo config modifier types

export type ExpoConfigModifierParams = {
  // nothing yet
}

export type ExpoConfigModifierMethod = (
  expoConfig: ExpoConfig,
  params: ExpoConfigModifierParams,
  info?: (message: string) => void | undefined,
) => ExpoConfig

export type ExpoConfigModifier = string | [string, ExpoConfigModifierParams]
