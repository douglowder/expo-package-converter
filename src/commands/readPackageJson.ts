import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'readDeps',
  alias: ['rd'],
  description:
    'Read and display the package dependencies for the current folder',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const packageJson = await toolbox.filesystem.readAsync(
      'package.json',
      'json'
    )
    if (!packageJson) {
      info('No package.json found')
      return
    }

    const deps = packageJson.dependencies ?? {}
    const devDeps = packageJson.devDependencies ?? {}

    info(`deps: ${JSON.stringify(deps, null, 2)}`)
    info(`devDeps: ${JSON.stringify(devDeps, null, 2)}`)
  },
}
