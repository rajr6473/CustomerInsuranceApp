// src/screens/User/NewPolicyScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import {
  Button,
  TextInput,
  Provider as PaperProvider,
  Dialog,
  Portal,
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const POLICY_TYPES = [
  { label: 'Life insurance', value: 'life' },
  { label: 'Health insurance', value: 'health' },
  { label: 'Motor insurance', value: 'motor' },
  { label: 'Other', value: 'other' },
];

export default function NewPolicyScreen({ navigation }) {
  const { getToken } = useAuth();

  const [policyType, setPolicyType] = useState('');
  const [planName, setPlanName] = useState('');
  const [sumInsured, setSumInsured] = useState('');
  const [premium, setPremium] = useState('');
  const [company, setCompany] = useState('');
  const [renewDate, setRenewDate] = useState(null);
  const [remarks, setRemarks] = useState('');

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const e = {};
    if (!policyType) e.policyType = 'Please select policy type.';
    if (!planName.trim()) e.planName = 'Please enter plan name.';
    if (!sumInsured.trim()) e.sumInsured = 'Please enter sum insured.';
    if (!premium.trim()) e.premium = 'Please enter premium amount.';
    if (!company.trim()) e.company = 'Please enter insurance company.';
    if (!renewDate) e.renewDate = 'Please select renewal date.';
    if (!remarks.trim()) e.remarks = 'Please enter remarks.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const token = await getToken();
      const payload = {
        insurance_type: policyType,
        plan_name: planName.trim(),
        sum_insured: Number(sumInsured),
        premium_amount: Number(premium),
        insurance_company: company.trim(),
        renewal_date: renewDate.toISOString().split('T')[0],
        remarks: remarks.trim(),
      };
      console.log('[DEBUG] addPolicy payload', payload);
      const res = await api.addPolicy(token, payload);
      console.log('[DEBUG] addPolicy response', res);

      if (!res?.success) {
        throw new Error(res?.message || 'Failed to submit policy');
      }

      setSuccessMessage(
        res.message || 'Your policy details have been added successfully.'
      );
      setSuccessVisible(true);
      setErrors({});
    } catch (err) {
      console.log('[DEBUG] addPolicy error', err?.response?.data || err);
      setErrors({
        api: 'Unable to save policy at the moment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessVisible(false);
    navigation?.navigate('UserMain');
  };

  const handleCancel = () => {
    navigation?.navigate('UserMain');
  };

  const formattedRenewDate = renewDate
    ? renewDate.toLocaleDateString()
    : 'Select renewal date';

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add new policy</Text>
          <Text style={styles.headerSubtitle}>
            Capture important details so Dr Wise can track your insurance
            correctly.
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Policy Type */}
            <Text style={styles.label}>Policy type</Text>
            <RNPickerSelect
              onValueChange={setPolicyType}
              value={policyType}
              items={POLICY_TYPES}
              placeholder={{ label: 'Select policy type', value: '' }}
              style={pickerSelectStyles}
            />
            {errors.policyType ? (
              <Text style={styles.error}>{errors.policyType}</Text>
            ) : null}

            {/* Plan Name */}
            <TextInput
              label="Plan name"
              value={planName}
              onChangeText={setPlanName}
              mode="outlined"
              style={styles.input}
              outlineColor="#e5e7eb"
              activeOutlineColor="#4f46e5"
            />
            {errors.planName ? (
              <Text style={styles.error}>{errors.planName}</Text>
            ) : null}

            {/* Sum Insured */}
            <TextInput
              label="Sum insured"
              value={sumInsured}
              onChangeText={setSumInsured}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineColor="#e5e7eb"
              activeOutlineColor="#4f46e5"
            />
            {errors.sumInsured ? (
              <Text style={styles.error}>{errors.sumInsured}</Text>
            ) : null}

            {/* Premium Amount */}
            <TextInput
              label="Premium amount"
              value={premium}
              onChangeText={setPremium}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineColor="#e5e7eb"
              activeOutlineColor="#4f46e5"
            />
            {errors.premium ? (
              <Text style={styles.error}>{errors.premium}</Text>
            ) : null}

            {/* Insurance Company */}
            <TextInput
              label="Insurance company"
              value={company}
              onChangeText={setCompany}
              mode="outlined"
              style={styles.input}
              outlineColor="#e5e7eb"
              activeOutlineColor="#4f46e5"
            />
            {errors.company ? (
              <Text style={styles.error}>{errors.company}</Text>
            ) : null}

            {/* Renewal Date */}
            <Button
              mode="outlined"
              onPress={() => setDatePickerVisible(true)}
              style={styles.dateButton}
              textColor="#4f46e5"
            >
              {formattedRenewDate}
            </Button>
            {errors.renewDate ? (
              <Text style={styles.error}>{errors.renewDate}</Text>
            ) : null}
            {datePickerVisible && (
              <DateTimePicker
                value={renewDate || new Date()}
                mode="date"
                display="calendar"
                onChange={(_, date) => {
                  setDatePickerVisible(false);
                  if (date) setRenewDate(date);
                }}
              />
            )}

            {/* Remarks */}
            <TextInput
              label="Remarks"
              value={remarks}
              onChangeText={setRemarks}
              mode="outlined"
              style={[styles.input, { height: 80 }]}
              multiline
              outlineColor="#e5e7eb"
              activeOutlineColor="#4f46e5"
            />
            {errors.remarks ? (
              <Text style={styles.error}>{errors.remarks}</Text>
            ) : null}

            {/* API error */}
            {errors.api ? <Text style={styles.error}>{errors.api}</Text> : null}

            {/* Buttons */}
            <Button
              mode="contained"
              loading={loading}
              onPress={handleSubmit}
              style={styles.primaryButton}
              buttonColor="#4f46e5"
            >
              Submit
            </Button>
            <Button
              mode="text"
              onPress={handleCancel}
              style={styles.secondaryButton}
              textColor="#6b7280"
            >
              Cancel
            </Button>
          </View>
        </ScrollView>

        {/* Success dialog */}
        <Portal>
          <Dialog
            visible={successVisible}
            onDismiss={handleSuccessClose}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>Policy added</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogMessage}>{successMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleSuccessClose}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: '#1d4ed8',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#dbeafe',
  },

  scroll: {
    flex: 1,
  },
  card: {
    marginTop: -12,              // pull up into the blue header
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  label: {
    marginBottom: 6,
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#ffffff',
  },
  dateButton: {
    marginTop: 4,
    marginBottom: 14,
    borderColor: '#c7d2fe',
    borderRadius: 10,
  },
  error: {
    color: '#dc2626',
    marginBottom: 8,
    fontSize: 12,
  },
  primaryButton: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 4,
  },
  secondaryButton: {
    marginTop: 4,
  },
  dialog: {
    borderRadius: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  dialogMessage: {
    fontSize: 14,
    color: '#4b5563',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    color: '#111827',
    marginBottom: 8,
  },
  inputAndroid: {
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    color: '#111827',
    marginBottom: 8,
  },
  placeholder: {
    color: '#9ca3af',
    fontSize: 15,
  },
};
