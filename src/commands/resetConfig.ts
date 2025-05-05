import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'resetConfig',
  alias: ['r'],
  description: 'Reset the CLI config to the defaults',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    toolbox.config.clear()

    info(`Cleared and reset config`)
  },
}
