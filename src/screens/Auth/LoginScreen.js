// src/screens/Auth/LoginScreen.js
// src/screens/Auth/LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();   // use global loading

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('User ID / Mobile and Password are required.');
      return;
    }

    setError('');

    try {
      await signIn({
        email: email.trim(),
        password: password.trim(),
      });
      // on success, your AppNavigator should move to dashboard based on user
    } catch (e) {
      // no need to do much; toast already shown
      // optional: keep inline error message
      setError('Invalid credentials. Please check details and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* logo + text */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/logo.jpeg')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.appName}>Dr Wise Insurance</Text>
          <Text style={styles.tagline}>
            Secure coverage at your fingertips
          </Text>
        </View>




        <View style={styles.middle}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSubtitle}>
              Please enter your details to continue
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputWrapper}>
              <Icon
                name="person"
                size={20}
                color="#A0AEC0"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="User ID or Mobile Number"
                placeholderTextColor="#A0AEC0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={20}
                color="#A0AEC0"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Icon
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#A0AEC0"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={onLogin}
              disabled={loading}
              activeOpacity={0.9}
              style={[
                styles.primaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View className="linksRow" style={styles.linksRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                disabled={loading}
              >
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
              >
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footerText}>
            For enquiry contact us:{' '}
            <Text style={styles.footerPhone}>+91 7411 417 470</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// keep your existing styles object (no loader / popup needed here)

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoInitial: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  appName: {
    color: '#f9fafb',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  tagline: {
    color: '#9ca3af',
    fontSize: 13,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 18,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  primaryButton: {
    marginTop: 4,
    backgroundColor: '#1d4ed8',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  linkText: {
    fontSize: 13,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  footerText: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
  },
  footerPhone: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },

  /* Loader overlay */
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
  loaderText: {
    marginTop: 12,
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
  },

  /* Centered error popup */
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#b91c1c',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 18,
  },
  alertButton: {
    alignSelf: 'center',
    marginTop: 4,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#1d4ed8',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',     // white circle behind logo
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',             // hard clip to circle
    borderWidth: 2,
    borderColor: '#1d4ed8',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  logoImage: {
    width: '90%',                   // crop edges a bit
    height: '90%',
    resizeMode: 'cover',            // fill circle, trim extra top/bottom
  },


});
