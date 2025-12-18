// src/screens/Agent/JS/AddCustomerScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import api from '../../services/api';
import {useAuth} from '../../context/AuthContext';
import {Picker} from '@react-native-picker/picker';


const genders = ['male', 'female', 'other'];
// put this ABOVE the component
const INDIA_STATES = [
  'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam',
  'Bihar','Chandigarh','Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu','Delhi',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand',
  'Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal',
];
const maritalStatuses = ['single', 'married', 'divorced'];

export default function AddCustomerScreen() {
  const navigation = useNavigation();
  const {getToken} = useAuth();

  const [customerType, setCustomerType] = useState('individual');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');


  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    mobile: '',
    gender: '',
    birth_date: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    pan_no: '',
    gst_no: '',
    occupation: '',
    annual_income: '',
    marital_status: '',
    image_url: '',
    documents: [],
  });

  const handleChange = (field, value) =>
    setForm(prev => ({...prev, [field]: value}));

  const pickProfileImage = async () => {
    const res = await launchImageLibrary({mediaType: 'photo'});
    if (res.assets && res.assets[0]) {
      handleChange('image_url', res.assets[0].uri);
    }
  };

  const addDocument = async () => {
    const res = await launchImageLibrary({mediaType: 'photo'});
    if (res.assets && res.assets[0]) {
      const doc = {
        document_type: 'other',
        document_file: res.assets[0].uri, // later change to base64 if backend needs
      };
      handleChange('documents', [...form.documents, doc]);
    }
  };

  const validate = () => {
  const e = {};

  if (customerType === 'individual') {
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
  } else {
    if (!form.company_name.trim()) e.company_name = 'Company name is required';
  }

  if (!form.mobile.trim()) e.mobile = 'Mobile is required';
  if (!form.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = 'Enter a valid email';

  if (!form.state) e.state = 'State is required';
  setErrors(e);
  return Object.keys(e).length === 0;
};


  const handleCancel = () => {
    navigation.navigate('AgentMain');
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoadingSubmit(true);
      const token = await getToken();

      const payload = {
        ...form,
        customer_type: customerType,
      };

      const res = await api.addCustomer(token, payload);
      console.log('[AddCustomerScreen] addCustomer result:', res);

      setLoadingSubmit(false);
      setSuccessVisible(true);

      setTimeout(() => {
        setSuccessVisible(false);
        navigation.navigate('AgentMain');
      }, 3000);
    } catch (err) {
      console.log('[AddCustomerScreen] addCustomer error:', err.message);
      setLoadingSubmit(false);
      // optional: show Alert here
    }
  };

  return (
    <LinearGradient
      colors={['#003B5C', '#007B8A']}
      style={styles.gradient}>
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.card}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Add Customer</Text>
          <Text style={styles.subtitle}>
            Create a new customer profile
          </Text>

          {/* customer type */}
          <View style={styles.section}>
            <Text style={styles.label}>Customer Type</Text>
            <View style={styles.radioRow}>
              {['individual', 'corporate'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.radioChip,
                    customerType === type && styles.radioChipActive,
                  ]}
                  onPress={() => setCustomerType(type)}>
                  <Icon
                    name={type === 'individual' ? 'account-circle' : 'domain'}
                    size={20}
                    color={customerType === type ? '#fff' : '#003B5C'}
                  />
                  <Text
                    style={[
                      styles.radioText,
                      customerType === type && styles.radioTextActive,
                    ]}>
                    {type === 'individual' ? 'Individual' : 'Corporate'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* name / company */}
          <View style={styles.row}>
              <View style={[styles.inputWrapper, {marginRight: 8}]}>
                <Text style={styles.label}>First name</Text>
                <TextInput
                  style={styles.input}
                  value={form.first_name}
                  onChangeText={t => {
                handleChange('first_name', t);
                if (errors.first_name) setErrors(prev => ({...prev, first_name: ''}));
              }}
            />
            {errors.first_name ? <Text style={styles.errorText}>{errors.first_name}</Text> : null}
              </View>
              <View style={[styles.inputWrapper, {marginLeft: 8}]}>
                <Text style={styles.label}>Last name</Text>
                <TextInput
                  style={styles.input}
                  value={form.last_name}
                  onChangeText={t => {
                handleChange('last_name', t);
                if (errors.last_name) setErrors(prev => ({...prev, last_name: ''}));
              }}
            />
            {errors.last_name ? <Text style={styles.errorText}>{errors.last_name}</Text> : null}
              </View>
            </View>
          {customerType !='individual' && (
            <View style={styles.section}>
              <Text style={styles.label}>Company name</Text>
              <TextInput
                style={styles.input}
                value={form.company_name}
                onChangeText={t => {
                handleChange('company_name', t);
                if (errors.company_name) setErrors(prev => ({...prev, company_name: ''}));
              }}
            />
            {errors.company_name ? <Text style={styles.errorText}>{errors.company_name}</Text> : null}
            </View>
          )}

          {/* email, mobile */}
          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={t => {
                handleChange('email', t);
                if (errors.email) setErrors(prev => ({...prev, email: ''}));
              }}
              keyboardType="email-address"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>


          <View style={styles.section}>
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={form.mobile}
              onChangeText={t => {
                handleChange('mobile', t);
                if (errors.mobile) setErrors(prev => ({...prev, mobile: ''}));
              }}
            />
            {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
          </View>

          {/* gender chips */}
          <View style={styles.section}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.dropdownRow}>
              {genders.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.dropdownChip,
                    form.gender === g && styles.dropdownChipActive,
                  ]}
                  onPress={() => handleChange('gender', g)}>
                  <Text
                    style={[
                      styles.dropdownText,
                      form.gender === g && styles.dropdownTextActive,
                    ]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* state */}
          <View style={styles.section}>
            <Text style={styles.label}>State</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.state}
                onValueChange={val => handleChange('state', val)}
                style={styles.picker}
              >
                <Picker.Item label="Select state" value="" />
                {INDIA_STATES.map(s => (
                  <Picker.Item key={s} label={s} value={s} />
                ))}
              </Picker>
            </View>
            {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
          </View>


          {/* marital status */}
          <View style={styles.section}>
            <Text style={styles.label}>Marital status</Text>
            <View style={styles.dropdownRow}>
              {maritalStatuses.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.dropdownChip,
                    form.marital_status === m &&
                      styles.dropdownChipActive,
                  ]}
                  onPress={() => handleChange('marital_status', m)}>
                  <Text
                    style={[
                      styles.dropdownText,
                      form.marital_status === m &&
                        styles.dropdownTextActive,
                    ]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* address */}
          <View style={styles.section}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, {height: 70}]}
              multiline
              value={form.address}
              onChangeText={t => handleChange('address', t)}
            />
          </View>

          {/* profile photo */}
          <View style={styles.section}>
            <Text style={styles.label}>Profile photo</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickProfileImage}>
              <Icon name="camera" size={18} color="#fff" />
              <Text style={styles.uploadText}>
                {form.image_url ? 'Change photo' : 'Upload from gallery'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* documents */}
          <View style={styles.section}>
            <Text style={styles.label}>Documents</Text>
            <TouchableOpacity
              style={styles.uploadButtonOutline}
              onPress={addDocument}>
              <Icon name="file-upload" size={18} color="#007BFF" />
              <Text style={styles.uploadTextOutline}>Add document</Text>
            </TouchableOpacity>
            {form.documents.length > 0 && (
              <Text style={styles.helperText}>
                {form.documents.length} document(s) attached
              </Text>
            )}
          </View>

          {/* buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleCancel}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSubmit}
              disabled={loadingSubmit}>
              {loadingSubmit ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {apiError ? <Text style={styles.apiErrorText}>{apiError}</Text> : null}        
      {/* success popup */}
      <Modal transparent visible={successVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrapper}>
              <Icon name="check" size={30} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Customer created</Text>
            <Text style={styles.modalMessage}>
              Customer created successfully.
            </Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {flex: 1},
  overlay: {flex: 1, padding: 16},
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003B5C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  section: {marginBottom: 14},
  label: {fontSize: 13, fontWeight: '600', color: '#445', marginBottom: 4},
  input: {
    borderWidth: 1,
    borderColor: '#dde3ea',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9fbff',
  },
  row: {flexDirection: 'row', marginBottom: 14},
  inputWrapper: {flex: 1},
  radioRow: {flexDirection: 'row', marginTop: 6},
  radioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#c7d4e5',
    marginRight: 10,
    backgroundColor: '#f5f7fb',
  },
  radioChipActive: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  radioText: {marginLeft: 6, color: '#003B5C', fontSize: 13},
  radioTextActive: {color: '#fff'},
  dropdownRow: {flexDirection: 'row', flexWrap: 'wrap'},
  dropdownRowWrap: {flexDirection: 'row', flexWrap: 'wrap'},
  dropdownChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#c7d4e5',
    marginRight: 8,
    marginBottom: 8,
  },
  dropdownChipActive: {
    backgroundColor: '#00A0B5',
    borderColor: '#00A0B5',
  },
  dropdownText: {fontSize: 12, color: '#445'},
  dropdownTextActive: {color: '#fff'},
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  uploadText: {color: '#fff', fontSize: 13, marginLeft: 8},
  uploadButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#007BFF',
    alignSelf: 'flex-start',
  },
  uploadTextOutline: {
    color: '#007BFF',
    fontSize: 13,
    marginLeft: 6,
  },
  helperText: {fontSize: 12, color: '#16a34a', marginTop: 4},
  actionsRow: {flexDirection: 'row', marginTop: 10},
  secondaryButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#c7d4e5',
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {color: '#003B5C', fontWeight: '600'},
  primaryButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: '#00A0B5',
  },
  primaryButtonText: {color: '#fff', fontWeight: '600'},
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 22,
    borderRadius: 18,
    alignItems: 'center',
    width: '75%',
  },
  modalIconWrapper: {
    backgroundColor: '#22c55e',
    borderRadius: 999,
    padding: 12,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  modalMessage: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
  },
  errorText: {
  marginTop: 4,
  color: '#dc2626',
  fontSize: 12,
},
apiErrorText: {
  marginTop: 10,
  color: '#b91c1c',
  fontSize: 13,
  textAlign: 'center',
},
pickerWrapper: {
  borderWidth: 1,
  borderColor: '#dde3ea',
  borderRadius: 10,
  marginBottom: 8,
  overflow: 'hidden',
  backgroundColor: '#f9fbff',
},
// picker: {height: 44},

});
