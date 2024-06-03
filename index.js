import { AppRegistry } from 'react-native';
import App from './App'; // Chemin vers votre composant App
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
