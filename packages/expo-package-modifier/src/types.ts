import type { PackageJSON } from 'gluegun/build/types/toolbox/meta-types'

// package.json modifier types

export type PackageJSONModifierParams = {
  newVersion?: string | undefined
}

export type PackageJSONModifierMethod = (
  packageJson: PackageJSON,
  params?: PackageJSONModifierParams | undefined,
  info?: (message: string) => void | undefined
) => PackageJSON

export type PackageJSONModifier = string | [string, PackageJSONModifierParams]
