import { GluegunToolbox } from 'gluegun'
import { minVersion, parse, SemVer } from 'semver'

import type { PackageJSON } from 'gluegun/build/types/toolbox/meta-types'
import type { PackageJSONModifier, PackageJSONModifierParams } from '../types'

const _modifyDependency = (
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

const modifyReactNativeDependency: PackageJSONModifier = (
  packageJson: PackageJSON,
  params: PackageJSONModifierParams
): PackageJSON => {
  if (!packageJson) {
    throw new Error('No package.json specified')
  }
  const { newVersion } = params
  if (!newVersion) {
    throw new Error('No new version specified')
  }
  return _modifyDependency(packageJson, 'react-native', newVersion)
}

const modifyTVConfigPluginDependency: PackageJSONModifier = (
  packageJson: PackageJSON,
  params: PackageJSONModifierParams
): PackageJSON => {
  if (!packageJson) {
    throw new Error('No package.json specified')
  }
  const { newVersion } = params
  if (!newVersion) {
    throw new Error('No new version specified')
  }
  return _modifyDependency(
    packageJson,
    '@react-native-tvos/config-tv',
    newVersion,
    'devDependencies'
  )
}

const addReactNativeTVDependency: PackageJSONModifier = (
  packageJson: PackageJSON,
  params: PackageJSONModifierParams
): PackageJSON => {
  if (!packageJson) {
    throw new Error('No package.json specified')
  }
  const { newVersion } = params
  if (!newVersion) {
    throw new Error('No new version specified')
  }
  return modifyReactNativeDependency(packageJson, {
    newVersion: `react-native:npm:react-native-tvos@${newVersion}`,
  })
}

const addExpoReactNativeExclusion: PackageJSONModifier = (
  packageJson: PackageJSON,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _params: PackageJSONModifierParams
): PackageJSON => {
  if (!packageJson) {
    throw new Error('No package.json specified')
  }
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

const modifyPackageJson = (
  packageJson: PackageJSON,
  modifiers: {
    method: PackageJSONModifier
    params: PackageJSONModifierParams
  }[]
): PackageJSON =>
  modifiers.reduce(
    (packageJsonAcc, modifier) =>
      modifier.method(packageJsonAcc, modifier.params),
    packageJson
  )

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.packageMods = {
    expoVersion,
    addExpoReactNativeExclusion,
    addReactNativeTVDependency,
    modifyReactNativeDependency,
    modifyTVConfigPluginDependency,
    modifyPackageJson,
  }
}
