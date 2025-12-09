// src/screens/Auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.forgotPassword({ email: email.trim() });
      const msg = res?.message || 'Reset link sent to email';
      Alert.alert('Success', msg);
      setTimeout(() => {
        navigation.navigate('Login'); // your auth stack login route
      }, 2000);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        'Unable to process request. Please check the email and try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !email.trim() || loading;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your registered email address and a password reset link will be sent to you.
      </Text>

      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Registered Email</Text>
        <TextInput
          placeholder="name@example.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        onPress={onSubmit}
        disabled={isDisabled}
        style={[
          styles.button,
          isDisabled && { opacity: 0.6 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f6f8fb' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 20,
  },
  fieldWrapper: { marginBottom: 16 },
  label: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    fontSize: 15,
    color: '#111827',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
