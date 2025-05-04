import type { PackageJSON } from 'gluegun/build/types/toolbox/meta-types'

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
  params: PackageJSONModifierParams
) => PackageJSON
