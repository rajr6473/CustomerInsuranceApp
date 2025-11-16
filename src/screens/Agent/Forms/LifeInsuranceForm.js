import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';



const initialFormData = {
  // Client Detail
  clientName: '',
  policyHolder: '',
  insuredName: '',
  referenceName: '',
  brokerName: '',
  // Insurance Detail 1
  insuranceCompany: '',
  agencyCode: '',
  brokerCode: '',
  policyType: '',
  planName: '',
  // Insurance Detail 2
  paymentMode: '',
  policyNumber: '',
  policyBookingDate: '',
  policyStartDate: '',
  policyEndDate: '',
  riskStartDate: '',
  policyTerm: '',
  premiumPaymentTerm: '',
  sumInsured: '',
  netPremium: '',
  gstYear1: '',
  gstYear2: '',
  gstYear3: '',
  totalPremium: '',
  bonus: '',
  fund: '',
  extraNote: '',
  // Commission Detail
  subAgentCommission: '',
  subAgentCommissionAmount: '',
  subAgentTDSPercent: '',
  subAgentTDSAmount: '',
  subAgentAfterTDSValue: '',
  firstYearCommission: '',
  // Document Upload
  uploadPolicy: null,
  additionalDocuments: [],
};

export default function LifeInsuranceForm(props) {
  const navigation = props.navigation || useNavigation(); // Fallback if not passed
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Back button handling
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => {
          if (formStep > 0) {
            setFormStep(formStep - 1);
          } else {
            navigation.goBack();
          }
        }}>
          {/* Replace with your desired icon */}
          <Text style={{ marginLeft: 16, paddingRight:20, fontSize:14, color:'orange' }}>Back</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation, formStep]);

  const onNext = () => setFormStep(formStep + 1);

  const onSubmit = async () => {
    try {
      // await api.addPolicy(auth.getToken(), formData);
      Alert.alert('Success', 'Policy added');
      setFormData(initialFormData);
      setFormStep(0);
      if (navigation && navigation.goBack) {
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || e?.message);
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      {formStep === 0 && (
        <>
          <Text style={formStyles.title}>Client Detail</Text>
          <TextInput placeholder="Client Name" value={formData.clientName} onChangeText={text => handleChange('clientName', text)} style={formStyles.input} />
          <TextInput placeholder="Policy Holder" value={formData.policyHolder} onChangeText={text => handleChange('policyHolder', text)} style={formStyles.input} />
          <TextInput placeholder="Insured Name" value={formData.insuredName} onChangeText={text => handleChange('insuredName', text)} style={formStyles.input} />
          <TextInput placeholder="Reference By Name" value={formData.referenceName} onChangeText={text => handleChange('referenceName', text)} style={formStyles.input} />
          <TextInput placeholder="Broker Name" value={formData.brokerName} onChangeText={text => handleChange('brokerName', text)} style={formStyles.input} />
          <TouchableOpacity onPress={onNext} style={formStyles.button}><Text style={formStyles.buttonText}>Next</Text></TouchableOpacity>
        </>
      )}

      {formStep === 1 && (
        <>
          <Text style={formStyles.title}>Insurance Detail</Text>
          <TextInput placeholder="Insurance Company Name" value={formData.insuranceCompany} onChangeText={text => handleChange('insuranceCompany', text)} style={formStyles.input} />
          <TextInput placeholder="Agency Code" value={formData.agencyCode} onChangeText={text => handleChange('agencyCode', text)} style={formStyles.input} />
          <TextInput placeholder="Broker Code" value={formData.brokerCode} onChangeText={text => handleChange('brokerCode', text)} style={formStyles.input} />
          <TextInput placeholder="Policy Type" value={formData.policyType} onChangeText={text => handleChange('policyType', text)} style={formStyles.input} />
          <TextInput placeholder="Plan Name" value={formData.planName} onChangeText={text => handleChange('planName', text)} style={formStyles.input} />
          <TouchableOpacity onPress={onNext} style={formStyles.button}><Text style={formStyles.buttonText}>Next</Text></TouchableOpacity>
        </>
      )}

      {formStep === 2 && (
        <>
          <Text style={formStyles.title}>Insurance Detail (contd.)</Text>
          <TextInput placeholder="Payment Mode" value={formData.paymentMode} onChangeText={text => handleChange('paymentMode', text)} style={formStyles.input} />
          <TextInput placeholder="Policy Number" value={formData.policyNumber} onChangeText={text => handleChange('policyNumber', text)} style={formStyles.input} />
          <TextInput placeholder="Policy Booking Date" value={formData.policyBookingDate} onChangeText={text => handleChange('policyBookingDate', text)} style={formStyles.input} />
          <TextInput placeholder="Policy Start Date" value={formData.policyStartDate} onChangeText={text => handleChange('policyStartDate', text)} style={formStyles.input} />
          <TextInput placeholder="Policy End Date" value={formData.policyEndDate} onChangeText={text => handleChange('policyEndDate', text)} style={formStyles.input} />
          <TextInput placeholder="Risk Start Date" value={formData.riskStartDate} onChangeText={text => handleChange('riskStartDate', text)} style={formStyles.input} />
          <TextInput placeholder="Policy Term" value={formData.policyTerm} onChangeText={text => handleChange('policyTerm', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Premium Payment Term" value={formData.premiumPaymentTerm} onChangeText={text => handleChange('premiumPaymentTerm', text)} style={formStyles.input} />
          <TextInput placeholder="Sum Insured" value={formData.sumInsured} onChangeText={text => handleChange('sumInsured', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Net Premium" value={formData.netPremium} onChangeText={text => handleChange('netPremium', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="1st Year GST %" value={formData.gstYear1} onChangeText={text => handleChange('gstYear1', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="2nd Year GST %" value={formData.gstYear2} onChangeText={text => handleChange('gstYear2', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="3rd Year GST %" value={formData.gstYear3} onChangeText={text => handleChange('gstYear3', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Total Premium" value={formData.totalPremium} onChangeText={text => handleChange('totalPremium', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Bonus" value={formData.bonus} onChangeText={text => handleChange('bonus', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Fund" value={formData.fund} onChangeText={text => handleChange('fund', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Extra Note" value={formData.extraNote} onChangeText={text => handleChange('extraNote', text)} style={formStyles.input} />
          <TouchableOpacity onPress={onNext} style={formStyles.button}><Text style={formStyles.buttonText}>Next</Text></TouchableOpacity>
        </>
      )}

      {formStep === 3 && (
        <>
          <Text style={formStyles.title}>Commission Detail</Text>
          <TextInput placeholder="1st Year Commission %" value={formData.firstYearCommission} onChangeText={text => handleChange('firstYearCommission', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Sub Agent Commission %" value={formData.subAgentCommission} onChangeText={text => handleChange('subAgentCommission', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Sub Agent Commission Amount" value={formData.subAgentCommissionAmount} onChangeText={text => handleChange('subAgentCommissionAmount', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Sub Agent TDS %" value={formData.subAgentTDSPercent} onChangeText={text => handleChange('subAgentTDSPercent', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Sub Agent TDS Amount" value={formData.subAgentTDSAmount} onChangeText={text => handleChange('subAgentTDSAmount', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="Sub Agent After TDS Value" value={formData.subAgentAfterTDSValue} onChangeText={text => handleChange('subAgentAfterTDSValue', text)} style={formStyles.input} keyboardType="numeric" />
          <TouchableOpacity onPress={onNext} style={formStyles.button}><Text style={formStyles.buttonText}>Next</Text></TouchableOpacity>
        </>
      )}

      {formStep === 4 && (
        <>
          <Text style={formStyles.title}>Policy & Upload Document</Text>
          {/* For file upload, use relevant picker and set formData.uploadPolicy/additionalDocuments */}
          <TouchableOpacity onPress={onSubmit} style={formStyles.button}><Text style={formStyles.buttonText}>Submit</Text></TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const formStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8 },
  button: { backgroundColor: '#007bff', padding: 16, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});