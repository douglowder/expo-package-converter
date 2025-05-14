import {
  PackageJSON,
  PackageJSONModifierParams,
  ExpoConfigModifierParams,
} from './types'
import type { ExpoConfig } from '@expo/config-types'

export const modifyPackageJson = (
  packageJson: PackageJSON,
  modifiers: PackageJSONModifierParams[]
) => {
  return modifiers.reduce((packageJsonAcc, modifier) => {
    const { dependencyChanges, expoSectionModifier } = modifier
    if (expoSectionModifier) {
      packageJsonAcc.expo = expoSectionModifier(packageJsonAcc.expo)
    }
    if (dependencyChanges) {
      packageJsonAcc = dependencyChanges.reduce((pkg, dependencyChange) => {
        const { dependencyName, newVersion, dependencyType } = dependencyChange
        const _dependencyType = dependencyType || 'dependencies'
        return {
          ...pkg,
          [_dependencyType]: {
            ...pkg[_dependencyType],
            [dependencyName]: newVersion,
          },
        }
      }, packageJsonAcc)
    }
    return packageJsonAcc
  }, packageJson)
}

const filteredExpoConfig = (
  expoConfig: ExpoConfig,
  removedPlugins: string[]
) => {
  const expoConfigAcc = { ...expoConfig }
  if (!expoConfigAcc.plugins) {
    return expoConfigAcc
  }
  removedPlugins.forEach((plugin) => {
    expoConfigAcc.plugins = expoConfigAcc.plugins.filter((p) => {
      if (typeof p === 'string') {
        return p !== plugin
      } else {
        return p[0] !== plugin
      }
    })
  })
  return expoConfigAcc
}

const pluginNames = (plugins: ExpoConfig['plugins']) => {
  return plugins.map((p) => {
    if (typeof p === 'string') {
      return p
    } else {
      return p[0]
    }
  })
}

export const modifyExpoConfig = (
  expoConfig: ExpoConfig,
  modifiers: ExpoConfigModifierParams[]
) => {
  return modifiers.reduce((expoConfigAcc, modifier) => {
    const { addedPlugins, removedPlugins } = modifier
    if (addedPlugins) {
      // Filter out existing plugins that match the added plugins, then add the new values
      expoConfigAcc = filteredExpoConfig(
        expoConfigAcc,
        pluginNames(addedPlugins)
      )
      expoConfigAcc.plugins = [...expoConfigAcc.plugins, ...addedPlugins]
    }
    if (removedPlugins) {
      expoConfigAcc = filteredExpoConfig(expoConfigAcc, removedPlugins)
    }
    return expoConfigAcc
  }, expoConfig)
}
