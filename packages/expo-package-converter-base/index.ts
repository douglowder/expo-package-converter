export type { ExpoConfig } from '@expo/config-types'

export type {
  PackageJSON,
  PackageJSONModifierParams,
  ExpoConfigModifierParams,
} from './src/types'

export { modifyPackageJson, modifyExpoConfig } from './src/modifiers'
