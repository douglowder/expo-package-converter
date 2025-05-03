import { GluegunToolbox } from 'gluegun'

import type { PackageJSON } from 'gluegun/build/types/toolbox/meta-types'

const modifyDependency = (
  packageJson: PackageJSON,
  dependencyName: string,
  newVersion: string,
  dependencyType: 'dependencies' | 'devDependencies' = 'dependencies'
): PackageJSON => ({
  ...packageJson,
  [dependencyType]: {
    ...packageJson[dependencyType],
    [dependencyName]: newVersion,
  },
})

const modifyReactNativeDependency = (
  packageJson: PackageJSON,
  newVersion: string
): PackageJSON => {
  return modifyDependency(packageJson, 'react-native', newVersion)
}

const modifyTVConfigPluginDependency = (
  packageJson: PackageJSON,
  newVersion: string
): PackageJSON => {
  return modifyDependency(
    packageJson,
    '@react-native-tvos/config-tv',
    newVersion,
    'devDependencies'
  )
}

const addReactNativeTVDependency = (
  packageJson: PackageJSON,
  tvVersion: string
): PackageJSON => {
  return modifyReactNativeDependency(
    packageJson,
    `react-native:npm:react-native-tvos@${tvVersion}`
  )
}

const addExpoReactNativeExclusion = (packageJson: PackageJSON): PackageJSON => {
  return {
    ...packageJson,
    expo: {
      ...(packageJson?.expo ?? {}),
      install: {
        ...(packageJson?.expo?.install ?? {}),
        exclude: [
          ...(packageJson?.expo?.install?.exclude ?? []),
          'react-native',
        ],
      },
    },
  }
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.packageMods = {
    addExpoReactNativeExclusion,
    addReactNativeTVDependency,
    modifyReactNativeDependency,
    modifyTVConfigPluginDependency,
  }
}
