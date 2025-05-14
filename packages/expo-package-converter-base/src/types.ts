// package.json modifier types
import type { ExpoConfig } from '@expo/config-types'

export enum PackageJSONDependencyTypes {
  dependencies = 'dependencies',
  devDependencies = 'devDependencies',
  peerDependencies = 'peerDependencies',
}

export type PackageJSONExpoSection = {
  [key: string]: any
}

export type PackageJSONExpoSectionModifier = (
  expoSection: PackageJSONExpoSection
) => PackageJSONExpoSection

export type PackageJSON = {
  name: string
  version: string
  private?: boolean | undefined
  dependencies?: { [key: string]: string } | undefined
  devDependencies?: { [key: string]: string } | undefined
  peerDependencies?: { [key: string]: string } | undefined
  expo?: PackageJSONExpoSection | undefined
} & { [key: string]: any }

export type PackageJSONModifierParams = {
  dependencyChanges?:
    | {
        dependencyName?: string | undefined
        dependencyType?: PackageJSONDependencyTypes | undefined
        newVersion?: string | undefined
      }[]
    | undefined
  expoSectionModifier?: PackageJSONExpoSectionModifier | undefined
}

export type PackageJSONModifier = string | [string, PackageJSONModifierParams]

// expo config modifier types

export type ExpoConfigPluginParams = { [key: string]: any }

export type ExpoConfigPlugin = ExpoConfig['plugins'][number]

export type ExpoConfigModifierParams = {
  addedPlugins?: ExpoConfigPlugin[] | undefined
  removedPlugins?: string[] | undefined
}

export type ExpoConfigModifier = string | [string, ExpoConfigModifierParams]
