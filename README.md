# beancolage

This is an ongoing prototype of a plaintext accounting environment using theia-ide, beancount, fava, and more... 

## Getting started

Install [nvm](https://github.com/creationix/nvm#install-script).

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash

Install npm and node.

    nvm install 10
    nvm use 10

Install yarn.

    npm install -g yarn

## Install dependencies

Run the following commands to get started:

Download vscode plugins (such as vscode-beancount):

    yarn theia download:plugins

Install and build:

    yarn prepare


## Running the browser example

    yarn start:browser

*or:*

    yarn rebuild:browser
    cd browser-app
    yarn start

*or:* launch `Start Browser Backend` configuration from VS code.

Open http://localhost:3000 in the browser.

## Running the Electron example

    yarn start:electron

*or:*

    yarn rebuild:electron
    cd electron-app
    yarn start

*or:* launch `Start Electron Backend` configuration from VS code.


## Running the tests

    yarn test

*or* run the tests of a specific package with

    cd beancolage
    yarn test
    

## Developing with the browser example

Start watching all packages, including `browser-app`, of your application with

    yarn watch

*or* watch only specific packages with

    cd beancolage
    yarn watch

and the browser example.

    cd browser-app
    yarn watch

Run the example as [described above](#Running-the-browser-example)
## Developing with the Electron example

Start watching all packages, including `electron-app`, of your application with

    yarn watch

*or* watch only specific packages with

    cd beancolage
    yarn watch

and the Electron example.

    cd electron-app
    yarn watch

Run the example as [described above](#Running-the-Electron-example)

## Publishing beancolage

Create a npm user and login to the npm registry, [more on npm publishing](https://docs.npmjs.com/getting-started/publishing-npm-packages).

    npm login

Publish packages with lerna to update versions properly across local packages, [more on publishing with lerna](https://github.com/lerna/lerna#publish).

    npx lerna publish
