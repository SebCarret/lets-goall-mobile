import React from 'react';
import { LogBox } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import { useFonts } from 'expo-font';
import Navigation from './screens/Navigation';

LogBox.ignoreAllLogs();

export default function App() {

  const [loaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <Navigation />
    </PaperProvider>
  )
};

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
  },
  ios: {
    regular: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
  }
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4392F1',
    error: '#DC493A'
  },
  fonts: configureFonts(fontConfig)
};