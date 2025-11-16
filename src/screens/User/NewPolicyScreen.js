import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Provider } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';  // Ensure this dependency is there.

const POLICY_TYPES = [
  { label: 'LIC', value: 'LIC' },
  { label: 'Health', value: 'health' },
  { label: 'Premium', value: 'premium' },
];

export default function NewPolicyScreen({ navigation }) {
  const [policyType, setPolicyType] = useState('');
  const [premium, setPremium] = useState('');
  const [renewDate, setRenewDate] = useState(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!policyType || !premium || !renewDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://your-backend-api.com/policies', {
        policyType,
        premium,
        renewDate: renewDate.toISOString().split('T')[0],
      });
      Alert.alert('Success', 'Policy saved successfully!');
      if (navigation && navigation.goBack) navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save policy');
    }
    setLoading(false);
  };

  // Cancel action navigates to dashboard
  const handleCancel = () => {
    if (navigation && navigation.navigate) navigation.navigate('UserMain');
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* Simple Dropdown for Policy Type */}
        <RNPickerSelect
          onValueChange={setPolicyType}
          value={policyType}
          items={POLICY_TYPES}
          placeholder={{ label: 'Select Policy Type', value: null }}
          style={pickerSelectStyles}
        />

        <TextInput
          label="Premium Amount"
          value={premium}
          onChangeText={setPremium}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />

        <Button
          mode="outlined"
          onPress={() => setDatePickerVisible(true)}
          style={styles.input}
        >
          {renewDate ? renewDate.toDateString() : 'Select Renewal Date'}
        </Button>
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

        <Button
          mode="contained"
          loading={loading}
          onPress={handleSubmit}
          style={{ marginTop: 30 }}
        >
          Submit
        </Button>
        <Button
          mode="text"
          onPress={handleCancel}
          style={{ marginTop: 10 }}
        >
          Cancel
        </Button>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f4f8fa',
  },
  input: {
    marginBottom: 20,
  },
});

// Custom picker styles to match paper fields
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#8e24aa',      // Matches your button color
    borderRadius: 8,
    backgroundColor: '#f5f0fa',  // Light purple/grey background for modern look
    color: '#512da8',            // Deep purple text
    marginBottom: 18,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#8e24aa',
    borderRadius: 8,
    backgroundColor: '#f5f0fa',
    color: '#512da8',
    marginBottom: 18,
  },
  placeholder: {
    color: '#b39ddb',            // Subtle placeholder
    fontSize: 16,
  }
};