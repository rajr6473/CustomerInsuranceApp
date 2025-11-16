import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { pickMultiple, types } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native'; // assuming react-navigation is set up


const API_URL = 'https://example.com/api/helpdesk';  // <-- Change to your endpoint

export default function HelpDeskScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  const validate = () => {
    if (!name.trim()) return 'Please enter your name.';
    if (!email.trim()) return 'Please enter your email.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Please enter a valid email address.';
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 7) return 'Please enter a valid phone number.';
    if (!description.trim()) return 'Please add a description.';
    return null;
  };

  const pickAttachmentsHandler = async () => {
    try {
      const results = await pickMultiple({ type: [types.allFiles] });
      const uris = new Set(attachments.map(a => a.uri));
      const merged = [...attachments];
      results.forEach(file => {
        if (!uris.has(file.uri)) {
          merged.push(file);
          uris.add(file.uri);
        }
      });
      setAttachments(merged);
    } catch (err) {
      Alert.alert('Error', 'Could not pick attachment.');
    }
  };

  const removeAttachment = uri => {
    setAttachments(prev => prev.filter(a => a.uri !== uri));
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Validation', error);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('description', description);
      attachments.forEach((file, idx) => {
        formData.append('attachments', {
          uri: file.uri,
          type: file.type || 'application/octet-stream',
          name: file.name || `attachment-${idx}`,
        });
      });
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      Alert.alert('Success', 'Helpdesk request submitted successfully.');
      setName('');
      setEmail('');
      setPhone('');
      setDescription('');
      setAttachments([]);
    } catch (err) {
      Alert.alert('Error', 'Could not submit request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.navigate('Settings');
  };


  const renderAttachment = ({ item }) => (
    <View style={styles.attachmentRow}>
      <Text numberOfLines={1} style={styles.attachmentName}>
        {item.name || item.uri}
      </Text>
      <TouchableOpacity onPress={() => removeAttachment(item.uri)} style={styles.removeBtn}>
        <Text style={styles.removeBtnText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Helpdesk / Contact Support</Text>
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
        <Text style={styles.label}>Attachments</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickAttachmentsHandler}>
          <Text style={styles.uploadBtnText}>Select files</Text>
        </TouchableOpacity>
        <FlatList
          data={attachments}
          keyExtractor={item => item.uri}
          renderItem={renderAttachment}
          style={{ width: '100%', marginTop: 8 }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 24 }}>
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
            <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
        </View>
        <Text style={styles.smallText}>We will contact you on the provided email/phone.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center', backgroundColor: '#f7f9fc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#0f172a' },
  label: { alignSelf: 'flex-start', marginTop: 12, marginBottom: 6, color: '#334155', fontSize: 15 },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6eef8',
    fontSize: 15,
    color: '#0f172a',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  textArea: { textAlignVertical: 'top', minHeight: 110 },
  uploadBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#93c5fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    backgroundColor: '#fff',
  },
  uploadBtnText: { fontSize: 15, color: '#3069a1', fontWeight: '600' },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  attachmentName: { flex: 1, marginRight: 8, color: '#0f172a' },
  removeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#f97316',
    borderRadius: 8,
  },
  removeBtnText: { color: '#fff', fontWeight: '600' },
  submitBtn: {
    width: '100%',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  smallText: { marginTop: 12, color: '#475569', fontSize: 13 },
  button: {
  flex: 1,
  height: 44,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 22,
  marginHorizontal: 4,
  elevation: 2,
  minWidth: 100,
  maxWidth: 170,
},
cancelBtn: {
  backgroundColor: '#F54336',
},
submitBtn: {
  backgroundColor: '#2196F3',
},
cancelBtnText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
},
submitBtnText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
},
});