// src/screens/Auth/ForgotPasswordScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('success');
  const [popupMessage, setPopupMessage] = useState('');

  // auto hide popup
  useEffect(() => {
    if (!popupVisible) return;
    const t = setTimeout(() => setPopupVisible(false), 4000);
    return () => clearTimeout(t);
  }, [popupVisible]);

  const showPopup = (type, message) => {
    setPopupType(type);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const onSubmit = async () => {
    if (!email.trim()) {
      showPopup('error', 'Registered email is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword({ email: email.trim() });
      const msg =
        res?.message ||
        'If this email is registered, a password reset link has been sent.';
      showPopup('success', msg);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        'Unable to process your request. Please check the email and try again.';
      showPopup('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigation.navigate('Login');
  };

  const isDisabled = !email.trim() || loading;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onCancel} style={styles.backButton}>
            <Icon name="arrow-back-ios" size={18} color="#e5e7eb" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoInitial}>DW</Text>
          </View>
          <Text style={styles.appName}>Dr Wise Insurance</Text>
          <Text style={styles.tagline}>
            Recover access to your secure account
          </Text>
        </View>

        {/* Card */}
        <View style={styles.middle}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Reset your password</Text>
            <Text style={styles.cardSubtitle}>
              Enter the email linked with your Dr Wise account. A secure reset
              link will be sent if the account exists.
            </Text>

            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Registered email</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="email"
                  size={20}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="name@example.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  editable={!loading}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={onSubmit}
              disabled={isDisabled}
              style={[
                styles.primaryButton,
                isDisabled && styles.primaryButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Send reset link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                Cancel and go back
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Need help? Contact support at{' '}
            <Text style={styles.footerPhone}>+91 9999999</Text>
          </Text>
        </View>
      </View>

      {/* Custom popup overlay */}
      {popupVisible && (
        <View style={styles.popupOverlay}>
          <View
            style={[
              styles.popupBox,
              popupType === 'success'
                ? styles.popupSuccess
                : styles.popupError,
            ]}
          >
            <View style={styles.popupIconCircle}>
              <Icon
                name={popupType === 'success' ? 'check-circle' : 'error'}
                size={26}
                color={popupType === 'success' ? '#16a34a' : '#dc2626'}
              />
            </View>
            <Text style={styles.popupTitle}>
              {popupType === 'success' ? 'Email sent' : 'Error'}
            </Text>
            <Text style={styles.popupMessage}>{popupMessage}</Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => setPopupVisible(false)}
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { color: '#f9fafb', fontSize: 16, fontWeight: '600' },

  logoArea: { alignItems: 'center', marginTop: 4, marginBottom: 8 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoInitial: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  appName: { color: '#f9fafb', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  tagline: { color: '#9ca3af', fontSize: 13, textAlign: 'center' },

  middle: { flex: 1, justifyContent: 'center' },

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
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 18 },

  fieldWrapper: { marginBottom: 16 },
  label: { fontSize: 13, color: '#4b5563', marginBottom: 6, fontWeight: '500' },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#111827' },

  primaryButton: {
    marginTop: 4,
    backgroundColor: '#1d4ed8',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: { opacity: 0.65 },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },

  secondaryButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#4b5563', fontSize: 14, fontWeight: '600' },

  footerText: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
  },
  footerPhone: { color: '#60a5fa', fontWeight: '600' },

  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBox: {
    width: '80%',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    alignItems: 'center',
  },
  popupSuccess: { borderTopWidth: 4, borderTopColor: '#16a34a' },
  popupError: { borderTopWidth: 4, borderTopColor: '#dc2626' },
  popupIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  popupTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  popupMessage: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 14,
  },
  popupButton: {
    marginTop: 4,
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#1d4ed8',
  },
  popupButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
