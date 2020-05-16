/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const fs = require('fs')

const extendConf = function (api, conf) {
  const encoding = 'utf8'
  let target = conf.build.env
  const { config, parse } = require('dotenv')

  // Load each file declared in env_files into environment
	for(const fileName of api.prompts.env_files.split(' ')) {
    // see if there is anything to do
    if (fileName === void 0 || fileName === '') {
      continue
    }

    // resolve the path to the file
    const envPath = api.resolve.app(fileName)

    if (!fs.existsSync(envPath)) {
      console.log(`App Extension (dotenv-plus): '${fileName}' file missing; skipping`)
      continue
    }
    // dotenv options
    const envOptions = {
      encoding: encoding,
      path: envPath
    }
    const result = config(envOptions)
    // check for dotenv error
    if (result.error) {
      console.error(`App Extension (dotenv-plus): Error '${result.error}'`)
      process.exit(1)
    }

    const parsed = result.parsed
    for (const key in parsed) {
      target[key] = JSON.stringify(parsed[key])
    }
  }
  // Load env vars declared in env_ci file from system environment
  try {
    const envPath = api.resolve.app(api.prompts.env_ci)
    if (!fs.existsSync(envPath)) {
      console.log(`App Extension (dotenv-plus): '${api.prompts.env_ci}' file missing; skipping`)
      return
    }
    const parsed = parse(fs.readFileSync(envPath, { encoding }))

    for (const key in parsed) {
      if (Object.prototype.hasOwnProperty.call(process.env, key)) {
        target[key] = JSON.stringify(process.env[key])
      }
    }
  } catch (e) {
    console.error(`App Extension (dotenv-plus): Error '${e}'`)
    process.exit(1)
  }

}

module.exports = function (api) {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^1.1.1')
  api.compatibleWith('@quasar/app', '^1.1.0')


  // We extend /quasar.conf.js
  api.extendQuasarConf((conf) => {
    extendConf(api, conf)
  })
}
