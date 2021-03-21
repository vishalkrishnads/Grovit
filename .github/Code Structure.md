# Code, directory structure & contributions

As you may have already read from the main docs, the app is built from React Native with JS while all the microcontrollers run C++. This doc guides you through on how to build the app from source, make your mods, improve and/or contribute your improvements back to this project. Judges please note that all contributors will be mentioned by GitHub itself so that you'll know if we have accepted anyone else's contribution on or before the judgement date.

## Build from source

This guide explains the process of building the app from source assuming that you already have the mentioned prerequisites at hand.

### Prerequisites
* React Native development environment set up and running (See [this](https://reactnative.dev/docs/environment-setup#development-os) on how to do it)
* Git installed (See [this](https://git-scm.com/downloads) on how to install)
* A nice text editor, in case issues arise (we'll be using [VS Code](https://code.visualstudio.com/) for this guide)
### Steps
1. Create a new React Native project

    ```
    npx react-native init Grovit
    ```
2. Change the working directory `cd Grovit`
3. Try running the app to make sure it's working fine

    ```
    npx react-native run-android
    ```
4. Assuming you don't have any errors and the sample app shows up properly, we can proceed to initialize an empty git repository in the directory

    ```
    git init
    ```
5. Add this repo as a remote origin

    ```
    git remote add origin https://github.com/vishalkrishnads/Grovit.git
    ```
6. Pull the source from this repo

    ```
    git pull origin master
    ```
7. Install all the node modules

    ```
    npm install package.json
    ```
If everything went well, you should be able to see a debuggable version of the Grovit app on your connected device or emulator. The certs and/or configs for the production version are not open sourced due to obvious security reasons. You can create the production builds of your mods using your own certificates.

### Issues
* If during pulling the source from this repo, a conflict occurs, delete the conflicting files from your bare React Native project...
  ```
  Windows:
  del .gitattributes .gitignore App.js index.js package.json

  Linux:
  rm .gitattributes .gitignore App.js index.js package.json
  ```
  ...and try pulling again.

* Due to a bug in `react-native-material-textfield`, most likely, the metro server won't build and will throw an error

    ```
    TypeError: undefined is not an object (evaluating '_reactNative.Animated.Text.propTypes.style')
    ```
  In order to fix this, inside your project directory, go to the source directory of the module and open these files in your editor
  
    ```
    cd node_modules/react-native-material-textfield/src/components
    code affix/index.js helper/index.js label/index.js
    ```
  In all these files, find the two lines of code as follows...
  
    ```javascript
    import { Animated } from 'react-native'

    // in affix/index.js and helper/index.js, this is in line 14
    // in label/index.js, it's in line 46
    style: Animated.Text.propTypes.style
    ```
  and change it to...
  
    ```javascript
    import { Animated, Text } from 'react-native'

    style: Text.propTypes.style
    ```
  and then reload the app from the metro server. The app should reload successfully
  
## Directory Structure
This repo is structured in the following way:
```
|
|--.github
|    |
|    |--Screenshots: screenshots for docs
|    |--...extra docs
|
|--android: android build files
|
|-- src
|    |
|    |--assets: all the assets required for the screens
|    |--img: all the static image files
|    |--screens: all the source for the screens
|
|--.gitattributes
|--.gitignore
|-- App.js
|-- index.js
|-- package.json
|-- README.md
```

## Contributing
You are free to fork this repo, build your own features and open a PR to this repo. But please do note that this repo was created and is being maintained for the CS InAPP competition. So, we'll not be accepting any contributions from outside until the competition finishes.
