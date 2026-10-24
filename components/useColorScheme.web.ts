import { useColorScheme as useColorSchemeCore } from 'react-native';

// The web build renders only in the browser (app.json web.output is
// "single"), so it can follow the visitor's light or dark setting directly.
// If the app ever switches to server rendering, this must return a fixed
// value again so the server and browser render the same styles.
export const useColorScheme = () => {
  const coreScheme = useColorSchemeCore();
  return coreScheme === 'dark' ? 'dark' : 'light';
};
