/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import { Provider } from 'react-redux';
import reducer from "./reducers/reducer"
import {createStore, applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
