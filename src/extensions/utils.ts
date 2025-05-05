import { GluegunToolbox } from 'gluegun'
import { PackageJSON } from 'gluegun/build/types/toolbox/meta-types'
import type { ExpoConfig } from '@expo/config-types'
import { minVersion, parse, SemVer } from 'semver'
import { Config } from '../types'

// Filesystem access

const readPackageJson = async (
  toolbox: GluegunToolbox
): Promise<PackageJSON | undefined> => {
  return await toolbox.filesystem.readAsync('package.json', 'json')
}

const writePackageJson = async (
  toolbox: GluegunToolbox,
  packageJson: PackageJSON
): Promise<void> => {
  await toolbox.filesystem.writeAsync(
    'package.json',
    JSON.stringify(packageJson, null, 2)
  )
}

const readExpoConfig = async (
  toolbox: GluegunToolbox
): Promise<ExpoConfig | undefined> => {
  return (await toolbox.filesystem.readAsync('app.json', 'json')).expo
}

const writeExpoConfig = async (
  toolbox: GluegunToolbox,
  expoConfig: ExpoConfig
): Promise<void> => {
  const appJson = await toolbox.filesystem.readAsync('app.json', 'json')
  await toolbox.filesystem.writeAsync(
    'app.json',
    JSON.stringify({ ...appJson, expo: expoConfig }, null, 2)
  )
}

// Validation

const doesPackageJsonExist = async (toolbox: GluegunToolbox) => {
  const packageJson = await toolbox.filesystem.readAsync('package.json', 'json')
  return !!packageJson
}

const doesExpoConfigExist = async (toolbox: GluegunToolbox) => {
  const appJson = await toolbox.filesystem.readAsync('app.json', 'json')
  return !!appJson?.expo
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

const doesPackageJsonHaveValidExpoVersion = async (
  packageJson: PackageJSON,
  config: Config
) => {
  const version = expoVersion(packageJson)
  if (!version) {
    return false
  }
  return config.data.validExpoVersions.includes(version)
}

const validate = async (toolbox: GluegunToolbox) => {
  const config = await toolbox.config.load()
  if (!(await doesPackageJsonExist(toolbox))) {
    throw new Error('No package.json found')
  }
  if (!(await doesExpoConfigExist(toolbox))) {
    throw new Error('No app.json found')
  }
  const packageJson = await readPackageJson(toolbox)
  if (!(await doesPackageJsonHaveValidExpoVersion(packageJson, config))) {
    throw new Error('Invalid Expo version in package.json')
  }
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.utils = {
    expoVersion,
    readPackageJson: async () => readPackageJson(toolbox),
    readExpoConfig: async () => readExpoConfig(toolbox),
    writePackageJson: async (packageJson: PackageJSON) =>
      writePackageJson(toolbox, packageJson),
    writeExpoConfig: async (expoConfig: ExpoConfig) =>
      writeExpoConfig(toolbox, expoConfig),
    validate: async () => validate(toolbox),
  }
}
