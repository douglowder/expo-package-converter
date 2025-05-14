import { GluegunToolbox } from 'gluegun'
import {
  modifyExpoConfig,
  modifyPackageJson,
} from 'expo-package-converter-base'
import { PackageJSONDependencyTypes } from 'expo-package-converter-base/src/types'

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

    const newPackageJson = modifyPackageJson(packageJson, [
      {
        dependencyChanges: [
          {
            dependencyName: 'react-native-tvos',
            newVersion: `react-native@npm:react-native-tvos@${tvVersions['react-native-tvos']}`,
          },
          {
            dependencyName: '@react-native-tvos/config-tv',
            dependencyType: PackageJSONDependencyTypes.devDependencies,
            newVersion: tvVersions['@react-native-tvos/config-tv'],
          },
          {
            dependencyName: 'expo-dev-client',
            newVersion: undefined,
          },
        ],
      },
      {
        expoSectionModifier: (expoSection) => {
          return {
            ...(expoSection ?? {}),
            install: {
              ...(expoSection?.install ?? {}),
              exclude: [
                ...(expoSection?.install?.exclude ?? {}),
                'react-native',
              ],
            },
          }
        },
      },
    ])
    await toolbox.utils.writePackageJson(newPackageJson)

    const newExpoConfig = modifyExpoConfig(expoConfig, [
      {
        addedPlugins: ['@react-native-tvos/config-tv'],
        removedPlugins: ['expo-dev-client', 'expo-dev-launcher'],
      },
    ])

    await toolbox.utils.writeExpoConfig(newExpoConfig)
  },
}
