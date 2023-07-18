# Beancolage, a plaintext accounting environment bundling Beancount-based tools

![beancolage-demo-short-scaled-slowed](https://user-images.githubusercontent.com/297435/204071516-1908c7ed-ac3e-4dc4-8817-1b62c219120f.gif)

This is an ongoing prototype of a plaintext accounting environment based on Eclipse Theia and including Beancount, VSCode-Beancount, and Fava.

⚠️ This is a prototype currently in early development. Feel free to file an issue if you have questions or interest in contributing.

## Motivation & Limitations

![Screenshot from 2022-11-25 23-23-07](https://user-images.githubusercontent.com/297435/204073620-87b01a4b-58d1-4a12-999f-d74f322a7179.png)

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
- `applications` groups the different app targets:
  - `browser` contains a browser based version of Beancolage that may be packaged as a Docker image
  - `electron` contains app to package, packaging configuration, and E2E tests for the electron target.
- `extensions/beancolage-extension` groups the various extensions, within `src` there is:
  - `navigator-fava` - A navigation panel for opening beancount files in Fava, and to see open Fava views (based on [open-editors-widget](https://github.com/eclipse-theia/theia/pull/9284/commits/a0472f6186d5d26a5b54f9b8c7ab7697c2d83f42)).
  - `fava-interface` - manages Fava server, notably adding in file arguments.
  - `process` - copy of [ves-process](https://github.com/VUEngine/VUEngine-Studio/tree/master/extensions/vuengine-studio-extension/src/process) from [VUEngine Studio](https://github.com/VUEngine/VUEngine-Studio).
- `extensions/beancolage-product` is based on [theia-blueprint-product](https://github.com/eclipse-theia/theia-blueprint/tree/master/theia-extensions/theia-blueprint-product) and handles application-wide customizations (getting started page, help, default workbench layout, colors, etc.).


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

### Package the Electron Application

```sh
yarn electron package
```

The packaged application is located in `applications/electron/dist`.

### Create a Preview Electron Application (without packaging it)

```sh
yarn electron package:preview
```

The packaged application is located in `applications/electron/dist`.

### Running E2E Tests on Electron

The E2E tests basic UI tests of the actual application.
This is done based on the preview of the packaged application.

```sh
yarn electron package:preview
yarn electron test
```

### Running Browser app

The browser app may be started with

```sh
# Download Plugins for browser app
yarn browser download:plugins

# Start browser app
yarn browser start
```

and connect to <http://localhost:3000/>

### Troubleshooting
TODO

### Reporting Feature Requests and Bugs

Many features in Beancolage are based on Theia and the included extensions/plugins. For bugs in Theia please consider opening an issue in the [Theia project on Github](https://github.com/eclipse-theia/theia/issues/new/choose).

If something isn't working properly, please [open an issue on Github](https://github.com/seltzered/beancolage/issues/new/choose) to let us know.

### Docker Build

You can create a Docker Image for Beancolage based on the browser app with the following build command:

```sh
docker build -t beancolage -f browser.Dockerfile .
```

You may then run this with

```sh
docker run -p=3000:3000 --rm beancolage
```

and connect to <http://localhost:3000/>