export type ExpoTVConfig = {
  '@react-native-tvos/config-tv': string
  'react-native-tvos': string
}

export type ExpoTVVersions = { [key: string]: ExpoTVConfig }

export type ConfigData = {
  tvVersions: ExpoTVVersions
}

export type Config = {
  data: ConfigData
  save: () => void
}
