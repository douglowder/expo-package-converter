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
  },
}
