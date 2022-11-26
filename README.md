# Beancolage

[beancolage-demo-short-scaled.webm](https://user-images.githubusercontent.com/297435/204071147-ecd652d2-0b46-4aa7-aa16-272b4383a135.webm)

This is an ongoing prototype of a plaintext accounting environment based on Eclipse Theia and including Beancount, VSCode-Beancount, and Fava.

⚠️ This is a prototype currently in early development. Feel free to file an issue if you have questions or interest in contributing.

## Motivation & Limitations

TODO: Image

The aspiration of Beancolage is to provide a more 'download and try' experience for [plaintext accounting](https://plaintextaccounting.org/), centered around [Beancount](https://beancount.github.io/) and [Fava](https://beancount.github.io/fava/index.html). The hope is to make the plaintext accounting experience accessible beyond just those with deep technical expertise, potentially to assist in group/organization bookkeeping. This said, Beancolage is intended to be a [_bricolage_](https://en.wikipedia.org/wiki/Bricolage) and not intended to be a fully-integrated accounting tool.

### Can I use this for a full workflow including importing from my bank?

No, this is a missing piece of Beancolage right now, and may be explored later. Generally importers in the plaintext accounting space have been a challenge to collaboratively develop on - for now you might want to check the [external contribution](https://beancount.github.io/docs/external_contributions.html) guides on importing, such as [The Five Minute Ledger Update](https://reds-rants.netlify.app/personal-finance/the-five-minute-ledger-update/).


## License

Beancolage is built upon Eclipse Theia, a framework for building cloud and desktop IDEs.

- [Eclipse Public License 2.0](LICENSE)
- [一 (Secondary) GNU General Public License, version 2 with the GNU Classpath Exception](LICENSE)

Beancolage also uses:

- [vscode-beancount](https://github.com/Lencerf/vscode-beancount) by Lencerf (MIT License)
- [ves-process](https://github.com/VUEngine/VUEngine-Studio/tree/master/extensions/vuengine-studio-extension/src/process) from [VUEngine Studio](https://github.com/VUEngine/VUEngine-Studio) (Eclipse Public License v2.0)

Future releases of Beancolage plan to include:

- [Beancount](https://beancount.github.io/) (GNU GPLv2 License)
- [Fava](https://beancount.github.io/fava/index.html) (MIT License) 

## Repository Structure

This repository is inspired by [Theia-Blueprint](https://github.com/eclipse-theia/theia-blueprint) with various UI extensions.

- Root level configures mono-repo build with lerna
- `applications` groups the different app targets
  - `electron` contains app to package, packaging configuration, and E2E tests for the electron target.
- `beancolage-extension` groups the various extensions, within `src` there is:
  - `navigator-fava` - A navigation panel for opening beancount files in Fava, and to see open Fava views (based on [open-editors-widget](https://github.com/eclipse-theia/theia/pull/9284/commits/a0472f6186d5d26a5b54f9b8c7ab7697c2d83f42)) 
  - `fava-interface` - manages Fava server, notably adding in file arguments.
  - `process` - copy of [ves-process](https://github.com/VUEngine/VUEngine-Studio/tree/master/extensions/vuengine-studio-extension/src/process) from [VUEngine Studio](https://github.com/VUEngine/VUEngine-Studio)


## Getting Started

### Prequisite Installs

At this time, builds only work if you have Beancount and Fava installed such that `fava` by command line can be called. 

0. Install [Fava], assuming you already have Python installed this can be done via:

```sh
pip install fava
```

### Install Beancolage

TODO

## Building Beancolage

### Prerequisites

0. Clone this repository. 

0. Install [nvm](https://github.com/creationix/nvm#install-script).

0. Install npm and node.

```sh
nvm install --lts
```

```sh
nvm use --lts`
```

0. Install yarn.

```sh
npm install -g yarn
```

### (optional) Download vscode plugins

If adding or updating any vscode plugins (e.g. vscode-beancount) you may need to do:

```sh
yarn theia download:plugins
```

### (optional) Prepare

```sh
yarn prepare
```

### Build

```sh
yarn
```

### Package the Application

```sh
yarn electron package
```

The packaged application is located in `applications/electron/dist`.

### Create a Preview Application (without packaging it)

```sh
yarn electron package:preview
```

The packaged application is located in `applications/electron/dist`.

### Running E2E Tests

The E2E tests basic UI tests of the actual application.
This is done based on the preview of the packaged application.

```sh
yarn electron package:preview
yarn electron test
```

### Troubleshooting
TODO

### Reporting Feature Requests and Bugs
TODO

