// package.json modifier types

export type PackageJSON = {
  name: string
  version: string
  private?: boolean
  dependencies?: { [key: string]: string }
  devDependencies?: { [key: string]: string }
  peerDependencies?: { [key: string]: string }
  expo?: { [key: string]: any }
} & { [key: string]: any }

export type PackageJSONModifierParams = {
  newVersion?: string | undefined
}

export type PackageJSONModifierMethod = (
  packageJson: PackageJSON,
  params?: PackageJSONModifierParams | undefined,
  info?: (message: string) => void | undefined
) => PackageJSON

export type PackageJSONModifier = string | [string, PackageJSONModifierParams]
