import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'modifyForTV',
  alias: ['tv'],
  description: 'Make modifications to the project for TV compatibility',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    await toolbox.utils.validate()

    const packageJson = await toolbox.utils.readPackageJson()
    const expoConfig = await toolbox.utils.readExpoConfig()

    const config = toolbox.config.load()

    const expoVersion = toolbox.utils.expoVersion(packageJson)
    const tvVersions = config.data.tvVersions[expoVersion]

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

    await toolbox.utils.writePackageJson(newPackageJson)

    const newExpoConfig = toolbox.expoConfigMods.modifyExpoConfig(expoConfig, [
      'addTVToExpoConfigPlugins',
      'removeDevClientFromExpoConfigPlugins',
    ])

    await toolbox.utils.writeExpoConfig(newExpoConfig)
  },
}
