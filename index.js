/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './assets/components/env.js'
import { LogBox } from 'react-native';

AppRegistry.registerComponent(appName, () => App);
LogBox.ignoreAllLogs();