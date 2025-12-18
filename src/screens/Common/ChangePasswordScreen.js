// src/screens/Common/ChangePasswordScreen.js
import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ChangePasswordScreen() {
  const [current, setCurrent] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { getToken, signOut } = useAuth();
  const navigation = useNavigation();

  const onUpdate = async () => {
    if (!current || !newPwd || !confirm) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (newPwd !== confirm) {
      Alert.alert('Error', 'New password and confirmation do not match');
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const payload = {
        current_password: current,
        new_password: newPwd,
        password_confirmation: confirm,
      };
      const res = await api.changePassword(token, payload);
      const msg = res?.message || 'Password changed successfully';

      Alert.alert('Success', msg);
      setTimeout(() => {
        signOut();                 // clear token / user
      }, 2000);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        'Failed to change password. Please check your current password.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, value, setValue, secure, onToggle) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput
        value={value}
        onChangeText={setValue}
        secureTextEntry={secure}
        style={styles.input}
        placeholder={label}
      />
      <TouchableOpacity onPress={onToggle} style={styles.iconWrap}>
        <Icon
          name={secure ? 'visibility-off' : 'visibility'}
          size={20}
          color="#64748b"
        />
      </TouchableOpacity>
    </View>
  </View>
);

  const onCancel = () => {
    navigation.goBack();
  };


  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>
          Keep your account secure by updating your password regularly.
        </Text>

        {renderField(
          'Current Password',
          current,
          setCurrent,
          !showCurrent,
          () => setShowCurrent(s => !s),
        )}

        {renderField(
          'New Password',
          newPwd,
          setNewPwd,
          !showNew,
          () => setShowNew(s => !s),
        )}

        {renderField(
          'Confirm New Password',
          confirm,
          setConfirm,
          !showConfirm,
          () => setShowConfirm(s => !s),
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, loading && {opacity: 0.7}]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.secondaryText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, loading && {opacity: 0.7}]}
            onPress={onUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  iconWrap: {
    paddingLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    paddingVertical: 11,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '500',
  },
  primaryButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 999,
    backgroundColor: '#2563eb',
    paddingVertical: 11,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 6},
    elevation: 4,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});

