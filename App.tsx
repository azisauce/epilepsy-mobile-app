import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { testFirebaseConnection } from './src/services/firebase/testConnection';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Text style={styles.text}>Hello, React Native is working!</Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default App;
