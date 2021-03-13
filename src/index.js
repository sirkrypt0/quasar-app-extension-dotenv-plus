/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */


const fs = require('fs')

const loadEnv = function(envPath, target, fromProcEnv){
  try {
    // see if there is anything to do
    const encoding = 'utf8'
    const {parse} = require('dotenv')

    if (!fs.existsSync(envPath)) {
      console.log(`App Extension (dotenv-plus): '${envPath}' file missing; skipping`)
      return
    }

    const parsed = parse(fs.readFileSync(envPath, { encoding }))

    let loadFrom = fromProcEnv ? process.env : parsed

    for (const key in parsed) {
      if (Object.prototype.hasOwnProperty.call(loadFrom, key)) {
          target[key] = loadFrom[key]
      }
    }
  } catch (e) {
    console.error(`App Extension (dotenv-plus): Error '${e}'`)
    process.exit(1)
  }
}

const extendConf = function (api, conf) {
  let target = conf.build.env

  // Load each file declared in env_files into environment
  for(const fileName of api.prompts.env_files.split(' ')) {
    if (fileName === void 0 || fileName === '') {
      continue
    }
    loadEnv(api.resolve.app(fileName), target, false)
  }
  // Load env vars declared in env_ci file from system environment
  loadEnv(api.resolve.app(api.prompts.env_ci), target, true)
}

module.exports = function (api) {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^1.1.1 || ^2.0.0 || ^2.0.0-beta')
  api.compatibleWith('@quasar/app', '^2.0.0 || ^3.0.0 || ^3.0.0-beta')


  // We extend /quasar.conf.js
  api.extendQuasarConf((conf) => {
    extendConf(api, conf)
  })
}
