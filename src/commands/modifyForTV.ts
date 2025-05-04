import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'modifyForTV',
  alias: ['tv'],
  description: 'Make modifications to the project for TV compatibility',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const config = toolbox.config.load()

    const packageJson = await toolbox.filesystem.readAsync(
      'package.json',
      'json'
    )
    if (!packageJson) {
      info('No package.json found')
      return
    }

    const expoVersion = toolbox.packageMods.expoVersion(packageJson)
    if (!expoVersion) {
      info('No expo version found')
      return
    }

    info(`Expo version: ${expoVersion}`)

    if (!config.data.validExpoVersions.includes(expoVersion)) {
      info(`Expo version ${expoVersion} is not supported`)
      return
    }

    const tvVersions = config.data.tvVersions[expoVersion]
    if (!tvVersions) {
      info(`No TV versions found for Expo version ${expoVersion}`)
      return
    }

    info(`TV versions: ${JSON.stringify(tvVersions, null, 2)}`)

    const newPackageJson = toolbox.packageMods.modifyPackageJson(packageJson, [
      [
        'addReactNativeTVDependency',
        { newVersion: tvVersions['react-native-tvos'] },
      ],
      [
        'addTVConfigPluginDependency',
        { newVersion: tvVersions['@react-native-tvos/config-tv'] },
      ],
      'addExpoReactNativeExclusion',
      'removeDevClientIfPresent',
    ])

    info(`New package.json: ${JSON.stringify(newPackageJson, null, 2)}`)

    await toolbox.filesystem.writeAsync(
      'package.json',
      JSON.stringify(newPackageJson, null, 2)
    )

    const appJson = await toolbox.filesystem.readAsync('app.json', 'json')

    if (!appJson) {
      info('No app.json found')
      return
    }

    const newAppJson = {
      ...appJson,
      expo: toolbox.expoConfigMods.modifyExpoConfig(appJson.expo, [
        'addTVToExpoConfigPlugins',
        'removeDevClientFromExpoConfigPlugins',
      ]),
    }

    info(`New app.json: ${JSON.stringify(newAppJson, null, 2)}`)

    await toolbox.filesystem.writeAsync(
      'app.json',
      JSON.stringify(newAppJson, null, 2)
    )
  },
}
