import type { PackageJSON } from 'gluegun/build/types/toolbox/meta-types'
import type { ExpoConfig } from '@expo/config-types'

// Saved configuration types

export type ExpoTVConfig = {
  '@react-native-tvos/config-tv': string
  'react-native-tvos': string
}

export type ExpoTVVersions = { [key: string]: ExpoTVConfig }

export type ConfigData = {
  validExpoVersions: number[]
  tvVersions: ExpoTVVersions
}

export type Config = {
  data: ConfigData
  save: () => void
}

// package.json modifier types

export type PackageJSONModifierParams = {
  newVersion?: string | undefined
}

export type PackageJSONModifierMethod = (
  packageJson: PackageJSON,
  params?: PackageJSONModifierParams | undefined,
  info?: (message: string) => void | undefined
) => PackageJSON

export type PackageJSONModifier = string | [string, PackageJSONModifierParams]

// expo config modifier types

export type ExpoConfigModifierParams = {
  // nothing yet
}

export type ExpoConfigModifierMethod = (
  expoConfig: ExpoConfig,
  params: ExpoConfigModifierParams,
  info?: (message: string) => void | undefined
) => ExpoConfig

export type ExpoConfigModifier = string | [string, ExpoConfigModifierParams]
