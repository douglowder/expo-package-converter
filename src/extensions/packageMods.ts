import { GluegunToolbox } from 'gluegun'
import { minVersion, parse, SemVer } from 'semver'

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

const expoVersion = (
  packageJson: PackageJSON,
  info?: (message: string) => void | undefined
): number | undefined => {
  const expoString = packageJson.dependencies?.expo ?? ''
  if (!expoString.length) {
    return undefined
  }
  info && info(`Expo string: ${expoString}`)
  let version: SemVer | null = null
  try {
    version = parse(minVersion(expoString))
    if (!version) {
      return undefined
    }
  } catch (e) {
    return undefined
  }
  return version.major
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.packageMods = {
    expoVersion,
    addExpoReactNativeExclusion,
    addReactNativeTVDependency,
    modifyReactNativeDependency,
    modifyTVConfigPluginDependency,
  }
}
