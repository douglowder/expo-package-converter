import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { GluegunToolbox } from 'gluegun'

import type { Config, ConfigData } from '../types'

const CONFIG_FILE_NAME = '.expoTVConverter.json'
const HOME_DIR =
  process.platform == 'win32' ? process.env.USERPROFILE : process.env.HOME
const CONFIG_FILE_PATH = join(HOME_DIR, CONFIG_FILE_NAME)
const DEFAULT_CONFIG_DATA: ConfigData = {
  validExpoVersions: [52, 53],
  tvVersions: {
    52: {
      '@react-native-tvos/config-tv': '0.1.1',
      'react-native-tvos': '0.77.2-0',
    },
    53: {
      '@react-native-tvos/config-tv': '0.1.1',
      'react-native-tvos': '0.79.2-0',
    },
  },
}

const validate = (data: ConfigData) => {
  if (!data.tvVersions) {
    throw new Error('Invalid config: missing tvVersions')
  }
}

const save = (data: ConfigData) => {
  validate(data)
  const dataString = JSON.stringify(data, null, 2)
  writeFileSync(CONFIG_FILE_PATH, dataString, { encoding: 'utf-8' })
}

const load = (): Config => {
  let data: ConfigData

  try {
    const dataString = readFileSync(CONFIG_FILE_PATH, { encoding: 'utf-8' })
    data = JSON.parse(dataString) as ConfigData
  } catch (_error) {
    data = { ...DEFAULT_CONFIG_DATA }
  }
  return {
    data,
    save: () => save(data),
  }
}

const clear = () => {
  save(DEFAULT_CONFIG_DATA)
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.config = {
    load,
    clear,
  }
}
