import type { PackageJSON } from 'gluegun/build/types/toolbox/meta-types'
import type { ExpoConfig } from '@expo/config-types'

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

export type PackageJSONModifierParams = {
  newVersion?: string | undefined
}

export type PackageJSONModifier = (
  packageJson: PackageJSON,
  params?: PackageJSONModifierParams | undefined
) => PackageJSON

export type ExpoConfigModifierParams = {
  // nothing yet
}

export type ExpoConfigModifier = (
  expoConfig: ExpoConfig,
  params: ExpoConfigModifierParams
) => ExpoConfig
