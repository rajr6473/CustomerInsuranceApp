import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, BackHandler, FlatList } from 'react-native';
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
  extraNote: '',
  // Commission Detail
  subAgentCommission: '',
  subAgentCommissionAmount: '',
  subAgentTDSPercent: '',
  subAgentTDSAmount: '',
  subAgentAfterTDSValue: '',
  firstYearCommission: '',
  //  Nominee Detail
  nomineename: '',
  nomineerelation: '',
  nomineeage: '',
  // Bank Detail
  bankname: '',
  accounttype: '',
  accountnumber: '',
  ifsccode: '',
  accountholdername: '',

  // Document Upload
  uploadPolicy: null,
  additionalDocuments: [],
};

export default function LifeInsuranceForm(props) {
  const navigation = props.navigation || useNavigation(); // Fallback if not passed
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [policyAttachment, setPolicyAttachment] = useState(null);
  

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    navigation.navigate('AgentMain');
  };

  // Upload Policy Document (allow file picker or camera)
const uploadPolicyHandler = async () => {
  console.log('Upload Policy Handler Invoked');
  try {
    // Use DocumentPicker for files or ImagePicker for images
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
      multiple: true,
    });
//     if (result?.type === 'success') {
//   setAttachments((prevDocs) => [...prevDocs, ...(Array.isArray(result) ? result : [result])]);
// }
    if (result.type === 'success') {
      setPolicyAttachment(result); // State: policyAttachment
    }
  } catch (err) {
    console.log('Upload failed:', err);
  }
};

// Add Additional Document (multiple attachments)
const addDocumentHandler = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
      multiple: true,
    });
    if (result.type === 'success') {
      setAttachments(prevDocs => [...prevDocs, result]); // State: attachments (array)
    }
  } catch (err) {
    console.log('Attach error:', err);
  }
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

  const [profilePic, setProfilePic] = useState(null);

const pickProfilePicHandler = async () => {
  try {
    // Use ImagePicker launchImageLibraryAsync for expo, or similar for bare RN:
    const result = await launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      setProfilePic(result.uri);
    }
  } catch (e) {
    Alert.alert('Error', 'Could not pick profile picture.');
  }
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
      attachments.forEach((file, idx) => {
        formData.append('attachments', {
          uri: file.uri,
          type: file.type || 'application/octet-stream',
          name: file.name || `attachment-${idx}`,
        });
      });
      setAttachments([]);
      if (navigation && navigation.goBack) {
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || e?.message);
    }
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
          <Text style={formStyles.title}>Nominee Detail</Text>
          <TextInput placeholder="Nominee Name" value={formData.nomineename} onChangeText={text => handleChange('nomineename', text)} style={formStyles.input}/>
          <TextInput placeholder="Nominee Relationship" value={formData.nomineerelation} onChangeText={text => handleChange('nomineerelation', text)} style={formStyles.input}/>
          <TextInput placeholder="Nominee Age" value={formData.nomineeage} onChangeText={text => handleChange('nomineeage', text)} style={formStyles.input}/>
          <TouchableOpacity onPress={onNext} style={formStyles.button}><Text style={formStyles.buttonText}>Next</Text></TouchableOpacity>
        </>
      )}

      {formStep === 5 && (
        <>
          <Text style={formStyles.title}>Bank Details</Text>
          <TextInput placeholder="Bank Name" value={formData.bankname} onChangeText={text => handleChange('bankname', text)} style={formStyles.input}/>
          <TextInput placeholder="Account Type" value={formData.accounttype} onChangeText={text => handleChange('accounttype', text)} style={formStyles.input}/>
          <TextInput placeholder="Account Number" value={formData.accountnumber} onChangeText={text => handleChange('accountnumber', text)} style={formStyles.input} keyboardType="numeric" />
          <TextInput placeholder="IFSC Code" value={formData.ifsccode} onChangeText={text => handleChange('ifsccode', text)} style={formStyles.input}/>
          <TextInput placeholder="Account Holder Name" value={formData.accountholdername} onChangeText={text => handleChange('accountholdername', text)} style={formStyles.input}/>
          <TouchableOpacity onPress={onNext} style={formStyles.button}><Text style={formStyles.buttonText}>Next</Text></TouchableOpacity>
        </>
      )}

      {formStep === 6 && (
      <View style={formStyles.container}>
      <Text style={formStyles.title}>Policy & Upload Document</Text>
      
      {/* Upload Policy Section */}
      <View style={styles.card}>
        <Text style={styles.header}>Upload Policy</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={uploadPolicyHandler}>
          <Text style={styles.uploadBtnText}>Upload or Capture Policy</Text>
          {/* Icon can be added here */}
        </TouchableOpacity>
      </View>
      
      {/* Additional Documents Section */}
      <View style={styles.card}>
        <Text style={styles.header}>Additional Documents</Text>
        <TouchableOpacity style={styles.addBtn} onPress={addDocumentHandler}>
          <Text style={styles.addBtnText}>+ Add Document</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBtns}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
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

uploadBtn: {
    marginTop: 8,
    backgroundColor: '#f0f7ff',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#007bff'
  },
  uploadBtnText: {
    color: '#007bff',
    fontSize: 15,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center'
  },
  cancelBtn: {
    backgroundColor: '#ff4349',
    marginRight: 12
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  card: {
  backgroundColor: '#fff',
  borderRadius: 14,
  padding: 16,
  marginVertical: 10,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 6,
},
header: {
  fontWeight: '700',
  fontSize: 16,
  marginBottom: 14,
  color: '#222',
},
uploadBtn: {
  backgroundColor: '#f7f9fc',
  borderRadius: 10,
  padding: 14,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#e3eaf2',
},
uploadBtnText: {
  color: '#3069a1',
  fontWeight: '600',
  fontSize: 15,
},
addBtn: {
  // similar style as uploadBtn
},
addBtnText: {
  color: '#3069a1',
  fontWeight: '600',
},
actionBtns: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 18,
},
cancelBtn: {
  backgroundColor: '#e0e0e0',
  borderRadius: 10,
  paddingVertical: 12,
  paddingHorizontal: 28,
},
cancelBtnText: {
  color: '#222',
  fontWeight: '600',
  fontSize: 16,
},
submitBtn: {
  backgroundColor: '#2196f3',
  borderRadius: 10,
  paddingVertical: 12,
  paddingHorizontal: 28,
},
submitBtnText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
},

});