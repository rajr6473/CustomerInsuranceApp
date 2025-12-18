import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';


export default function AddLeadForm(props) {
  const auth = useAuth();

  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setStateVal] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [productInterest, setProductInterest] = useState('');
  const [priority, setPriority] = useState('');
  const [currentStage, setCurrentStage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigation = props.navigation || useNavigation(); // Fallback if not passed
  

  const productOptions = [
    { label: 'Select product', value: '' },
    { label: 'Health Insurance', value: 'health' },
    { label: 'Life Insurance', value: 'life' },
    { label: 'Motor Insurance', value: 'motor' },
    { label: 'Other Insurance', value: 'other' },
  ];

  const stateOptions = [
    { label: 'Select state', value: '' },
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
    { label: 'Assam', value: 'Assam' },
    { label: 'Bihar', value: 'Bihar' },
    { label: 'Chhattisgarh', value: 'Chhattisgarh' },
    { label: 'Goa', value: 'Goa' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Haryana', value: 'Haryana' },
    { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
    { label: 'Jharkhand', value: 'Jharkhand' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Kerala', value: 'Kerala' },
    { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Manipur', value: 'Manipur' },
    { label: 'Meghalaya', value: 'Meghalaya' },
    { label: 'Mizoram', value: 'Mizoram' },
    { label: 'Nagaland', value: 'Nagaland' },
    { label: 'Odisha', value: 'Odisha' },
    { label: 'Punjab', value: 'Punjab' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'Sikkim', value: 'Sikkim' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'Telangana', value: 'Telangana' },
    { label: 'Tripura', value: 'Tripura' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'Uttarakhand', value: 'Uttarakhand' },
    { label: 'West Bengal', value: 'West Bengal' },
  ];

  const priorityOptions = [
    { label: 'Select priority', value: '' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  const stageOptions = [
    { label: 'Select stage', value: '' },
    { label: 'Consultation', value: 'consultation' },
    { label: 'One-on-One', value: 'one_on_one' },
    { label: 'Converted', value: 'converted' },
    { label: 'Policy Created', value: 'policy_created' },
    { label: 'Referral Settled', value: 'referral_settled' },
  ];

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!name || !contactNumber || !productInterest || !priority || !currentStage) {
      setErrorMsg('Please fill all required fields marked with *');
      return;
    }

    try {
      setSubmitting(true);
      const token = await auth.getToken();

      const payload = {
        name,
        contact_number: contactNumber,
        email,
        city,
        state,
        address,
        note: notes,
        product_interest: productInterest,
        priority,
        current_stage: currentStage,
        referred_by: "Friend Reference",
        lead_source: "agent_referral",
      };

      const res = await api.addLead(token, payload);

      if (res?.status) {
        Alert.alert(
          'Lead Created',
          res?.message || 'Lead created successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('AgentMain'),
            },
          ],
          { cancelable: false },
        );
      } else {
        setErrorMsg(res?.message || 'Unable to create lead, please try again');
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      setErrorMsg(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <LinearGradient
      colors={['#021B3A', '#0F4C81']}
      style={styles.container}
    >
      <View style={styles.headerSpacer} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Add Lead</Text>
        <Text style={styles.subtitle}>
          Capture new lead details and track them through stages.
        </Text>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {/* Lead Information */}
        <View className="card" style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Lead Information</Text>
          </View>

          <Text style={styles.label}>Lead Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Contact Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="10 digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={contactNumber}
            onChangeText={setContactNumber}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Lead Details */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Lead Details</Text>
          </View>

          <Text style={styles.label}>Product Interest *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={productInterest}
              onValueChange={value => setProductInterest(value)}
              style={styles.picker}
            >
              {productOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Priority Level *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={priority}
              onValueChange={value => setPriority(value)}
              style={styles.picker}
            >
              {priorityOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Current Stage *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={currentStage}
              onValueChange={value => setCurrentStage(value)}
              style={styles.picker}
            >
              {stageOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Address Information</Text>
          </View>

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City name"
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.label}>State</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={state}
              onValueChange={value => setStateVal(value)}
              style={styles.picker}
            >
              {stateOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Complete Address</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="House / Street / Area"
            multiline
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Additional Notes */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Additional Notes</Text>
          </View>

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Any extra details about the lead..."
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.navigate('AgentMain')}
            disabled={submitting}
          >
            <Text style={[styles.buttonText, { color: '#374151' }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Create Lead</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSpacer: {
    height: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 12,
    marginHorizontal: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#dbeafe',
    marginTop: 4,
    marginBottom: 14,
    marginHorizontal: 16,
  },
  errorText: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    fontSize: 13,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#2563eb',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
    fontSize: 14,
    color: '#111827',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9fafb',
  },
  picker: {
    // height: 46,
    color: '#111827',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: '#e5e7eb',
  },
  primaryButton: {
    marginLeft: 8,
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 8},
    elevation: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});

