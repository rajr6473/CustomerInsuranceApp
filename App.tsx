// App.tsx (root)

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

function RootWithLoader() {
  const { loading } = useAuth();   // <-- global loading from context

  return (
    <>
      <NavigationContainer>
        <AppNavigator />
        <Toast />
      </NavigationContainer>

      {loading && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#1d4ed8" />
          </View>
        </View>
      )}
    </>
  );
}

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootWithLoader />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
