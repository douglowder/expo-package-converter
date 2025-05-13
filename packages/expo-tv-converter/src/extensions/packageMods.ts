import { GluegunToolbox } from 'gluegun'

import type {
  PackageJSON,
  PackageJSONModifier,
  PackageJSONModifierParams,
} from 'expo-package-modifier'

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

const modifyReactNativeDependency = (
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

const addTVConfigPluginDependency = (
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

const addReactNativeTVDependency = (
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
    newVersion: `npm:react-native-tvos@${newVersion}`,
  })
}

const addExpoReactNativeExclusion = (packageJson: PackageJSON): PackageJSON => {
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

const removeDevClientIfPresent = (packageJson: PackageJSON): PackageJSON => {
  if (!packageJson) {
    throw new Error('No package.json specified')
  }
  return {
    ...packageJson,
    dependencies: {
      ...packageJson.dependencies,
      'expo-dev-client': undefined,
    },
  }
}

const packageMods = {
  addExpoReactNativeExclusion,
  addReactNativeTVDependency,
  modifyReactNativeDependency,
  addTVConfigPluginDependency,
  removeDevClientIfPresent,
}

const modifyPackageJson = (
  packageJson: PackageJSON,
  modifiers: PackageJSONModifier[]
): PackageJSON =>
  modifiers.reduce((packageJsonAcc, modifier) => {
    if (typeof modifier === 'string') {
      return packageMods[modifier](packageJsonAcc)
    }
    return packageMods[modifier[0]](packageJsonAcc, modifier[1])
  }, packageJson)

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.packageMods = {
    modifyPackageJson,
  }
}
