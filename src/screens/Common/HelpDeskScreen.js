import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function HelpDeskScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { getToken } = useAuth();

  const validate = () => {
    if (!name.trim()) return 'Please enter your name.';
    if (!email.trim()) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (!phone.trim() || phone.replace(/[^\d]/g, '').length < 7)
      return 'Please enter a valid phone number.';
    if (!description.trim()) return 'Please add a description.';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Validation', error);
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();

      const payload = {
        name,
        email,
        phone_number: phone,
        description,
      };

      const res = await api.submitHelpdesk(token, payload);

      if (!res?.success) {
        throw new Error(res?.message || 'Request failed');
      }

      // clear form
      setName('');
      setEmail('');
      setPhone('');
      setDescription('');
      console.log('[DEBUG] helpdesk submit response', res);
      Alert.alert('Success', res.message || 'Helpdesk request submitted successfully.');

      // wait 2 seconds, then stop loader and navigate
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Settings');
      }, 2000);
    } catch (err) {
      console.log('[DEBUG] submit helpdesk error', err);
      Alert.alert('Error', 'Could not submit request. Please try again later.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    navigation.navigate('Settings');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Helpdesk / Contact Support</Text>
          <Text style={styles.subtitle}>
            Share your issue and our team will get back to you shortly.
          </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 98765 43210"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the issue or request in a few lines"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />
        {/* <Text style={styles.label}>Attachments</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickAttachmentsHandler}>
          <Text style={styles.uploadBtnText}>Select files</Text>
        </TouchableOpacity>
        <FlatList
          data={attachments}
          keyExtractor={item => item.uri}
          renderItem={renderAttachment}
          style={{ width: '100%', marginTop: 8 }}
        /> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
          <TouchableOpacity
            style={[styles.button, styles.cancelBtn]}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitBtn]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.smallText}>
          We will contact you on the provided email/phone.
        </Text>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#102A43',
    textAlign: 'center',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D7E2',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#1A202C',
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },

  helperText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
  },

  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 4,
  },

  buttonsWrapper: {
    marginTop: 24,
  },

  button: {
    height: 48,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  submitBtn: {
    backgroundColor: '#1F4FE0',
  },

  cancelBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },

  submitBtnDisabled: {
    opacity: 0.6,
  },

  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  cancelBtnText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '500',
  },

  smallText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 16,
  },
});
