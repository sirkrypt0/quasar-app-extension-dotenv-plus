<img src="https://img.shields.io/github/repo-size/sirkrypt0/quasar-app-extension-dotenv-plus" alt="repo size">

Quasar App Extension dotenv-plus
===

> Allows having multiple .env files and loads specified system variables for working with CI/CD environments.

Often when working in a team, you want to have multiple `.env` files for different setups. A simple example is having
a shared `.env` file that will be available in the repository and sets all necessary, non-confidential variables.
Then you want to have a file like `.env.dev` which is ignore by git and local to every developer. This can then be used
to store development specific or confidential settings.

But when deploying your app in CI/CD environments you have to set confidential values as well, right? You could append
those to your `.env` file via a script. This plugin makes this easier by allowing you to set the values you want to load
in a specified file and then loads those values from the system environment instead of any file.

# Install
```bash
quasar ext add dotenv-plus
```
Quasar CLI will retrieve it from NPM and install the extension.

## Prompts

1. **"Names of your dotenv files (space seperated)?"**
  The default is ".env". The files specified here will be loaded in that order, e.g. ".env .env.dev" will load ".env"
  first and ".env.dev" afterwards, possibly overriding env vars set previously.
2. **"Name of your CI dotenv dictionary file?"**
  The default is ".env.ci". Any key in that file will be loaded from system environment, allowing CI/CD environments to
  easily set the values via the system environment.

  
# Uninstall
```bash
quasar ext remove dotenv-plus
```

# Info
Having multiple dotenv files allows inheritance for your environments.
A common scenario would be to have a public `.env` file, and a local `.env.dev` file, where the local file can be used
to override shared configurations and adding confidential information that should not appear in the repository.

The `.env.ci` file should look like this and acts like a dictionary for loading system environment variables.
```dotenv
# .env.ci
MY_FIRST_KEY=
MY_SECOND_KEY=
```
This config results in the plugin looking for `MY_FIRST_KEY` and `MY_SECOND_KEY` in the system environment and loading
those. If any value is found, it will override the values set in any other `.env` file you specified before.


# Other Info
> Add other information that's not as important to know

# Donate
If you appreciate the work that went into this App Extension, please consider [donating to Quasar](https://donate.quasar.dev).
