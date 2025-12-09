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

  const renderField = (
    label,
    value,
    setValue,
    secure,
    onToggle,
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={setValue}
          secureTextEntry={!secure}
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
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Change Password</Text>

    {renderField(
      'Current Password',
      current,
      setCurrent,
      showCurrent,
      () => setShowCurrent(s => !s),
    )}
    {renderField(
      'New Password',
      newPwd,
      setNewPwd,
      showNew,
      () => setShowNew(s => !s),
    )}
    {renderField(
      'Confirm New Password',
      confirm,
      setConfirm,
      showConfirm,
      () => setShowConfirm(s => !s),
    )}

    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={[styles.secondaryButton, loading && { opacity: 0.7 }]}
        onPress={onCancel}
        disabled={loading}
      >
        <Text style={styles.secondaryText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={onUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update</Text>
        )}
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f8fb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
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
  button: {
    marginTop: 18,
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
  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 18,
},
secondaryButton: {
  flex: 1,
  marginRight: 8,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#d1d5db',
  paddingVertical: 12,
  alignItems: 'center',
  backgroundColor: '#ffffff',
},
secondaryText: {
  fontSize: 15,
  color: '#4b5563',
},
button: {
  flex: 1,
  marginLeft: 8,
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
