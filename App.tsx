import React, { useEffect } from 'react';
import { Text, Button, View } from 'react-native';
import { register, login, logout, getCurrentUserData } from './src/services/firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';


function App(): React.JSX.Element {
  const testRegister = async () => {
    try {
      await register({
        email: 'usera@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        role: 'A',
      });
      console.log('✅ Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const testLogin = async () => {
    try {
      await login({
        email: 'usera@test.com',
        password: 'password123',
      });
      console.log('✅ Login successful!');
      
      // Get user data
      const userData = await getCurrentUserData();
      console.log('User data:', userData);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const testLogout = async () => {
    try {
      await logout();
      console.log('✅ Logout successful!');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Firebase Auth Test</Text>
      
      <View style={{ gap: 10 }}>
        <Button title="Test Register" onPress={testRegister} />
        <Button title="Test Login" onPress={testLogin} />
        <Button title="Test Logout" onPress={testLogout} />
      </View>
    </SafeAreaProvider>
  );
}

export default App;