// src/screens/Agent/Forms/JS/HealthInsuranceForm.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';


const POLICY_TYPES = ['New', 'Renewal', 'Porting'];
const PAYMENT_MODES = ['Yearly', 'Half-Yearly', 'Quarterly', 'Monthly', 'Single'];
const RELATIONSHIPS = ['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'];
const DOCUMENT_TYPES = ['PAN', 'Aadhaar', 'KYC', 'Payment Receipt', 'Medical Report', 'Other'];

const initialFormData = {
  client_id: '',
  policy_holder: '',
  referenceName: '',
  brokerName: '',

  insurance_company_id: '',
  insurance_company_name: '',
  policyType: 'New',
  planName: '',
  policyNumber: '',
  paymentMode: 'Yearly',
  policyBookingDate: '',
  policyStartDate: '',
  policyEndDate: '',
  policyTerm: '',
  sumInsured: '',
  netPremium: '',
  gstPercent: '18',
  totalPremium: '',
  extraNote: '',

  firstYearCommission: '',
  subAgentCommission: '',
  subAgentTDSPercent: '',
  subAgentTDSAmount: '',
  subAgentAfterTDSValue: '',

  family_members: [{ full_name: '', age: '', relationship: 'Self', sum_insured: '' }],
};

export default function HealthInsuranceForm({ onCancel, onSuccess, pickAttachmentsHandler }) {
  const { getToken } = useAuth();

  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [attachments, setAttachments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');
  

  // date picker state
  const [datePickerField, setDatePickerField] = useState(null); // 'booking' | 'start' | 'end' | null
  const [tempDate, setTempDate] = useState(new Date());

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFamilyChange = (index, key, value) => {
    setFormData(prev => {
      const updated = [...prev.family_members];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, family_members: updated };
    });
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      family_members: [
        ...prev.family_members,
        { full_name: '', age: '', relationship: 'Other', sum_insured: '' },
      ],
    }));
  };

  const removeFamilyMember = index => {
    setFormData(prev => {
      const updated = prev.family_members.filter((_, i) => i !== index);
      return {
        ...prev,
        family_members:
          updated.length > 0 ? updated : [{ full_name: '', age: '', relationship: 'Self', sum_insured: '' }],
      };
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setAttachments([]);
    setFormStep(0);
    setError('');
  };

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const token = await getToken();
        const res = await api.getInsuranceCompanies(token);
        setCompanies(res?.data?.insurance_companies || []);
      } catch {
        setError('Could not load insurance companies');
      } finally {
        setLoadingCompanies(false);
      }
    };
    loadCompanies();
  }, [getToken]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const token = await getToken();
        const res = await api.getAllClients(token);
        const list = res?.data?.customers || res?.customers || [];
        setCustomers(list);
      } catch {
        setError('Could not load customers');
      } finally {
        setLoadingCustomers(false);
      }
    };
    loadCustomers();
  }, [getToken]);

  // hardware back: step inside form
  useEffect(() => {
    const onBackPress = () => {
      if (formStep > 0) {
        setFormStep(s => s - 1);
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [formStep]);

  const onNext = () => {
    setError('');
    setFormStep(s => s + 1);
  };

  const onPrev = () => {
    setError('');
    setFormStep(s => (s > 0 ? s - 1 : s));
  };

  const openDatePicker = (fieldKey, currentValue) => {
    setDatePickerField(fieldKey); // 'policyBookingDate' etc.
    if (currentValue) {
      const parts = currentValue.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        setTempDate(d);
      } else {
        setTempDate(new Date());
      }
    } else {
      setTempDate(new Date());
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      // Android fires both 'set' and 'dismiss'
      if (event.type === 'dismissed') {
        setDatePickerField(null);
        return;
      }
    }
    const date = selectedDate || tempDate;
    setTempDate(date);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    if (datePickerField) {
      handleChange(datePickerField, `${yyyy}-${mm}-${dd}`);
    }
    if (Platform.OS === 'android') {
      setDatePickerField(null);
    }
  };

  const validateBeforeSubmit = () => {
    const required = [
      'client_id',
      'policy_holder',
      'insurance_company_id',
      'policyType',
      'policyNumber',
      'policyStartDate',
      'policyEndDate',
      'policyTerm',
      'paymentMode',
      'sumInsured',
      'netPremium',
      'gstPercent',
      'totalPremium',
    ];
    for (const k of required) {
      if (!String(formData[k]).trim()) {
        return `Please fill ${k.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
      }
    }
    if (!formData.family_members.length || !formData.family_members[0].full_name) {
      return 'Please add at least one family member';
    }
    return '';
  };

  const onSubmit = async () => {
    const msg = validateBeforeSubmit();
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    try {
      setLoadingSubmit(true);
      const token = await getToken();

      const payload = {
        client_id: Number(formData.client_id),
        policy_holder: formData.policy_holder,
        insurance_company_id: formData.insurance_company_id,
        insurance_company_name: formData.insurance_company_name,
        policy_type: formData.policyType,
        insurance_type: 'Individual',
        policy_number: formData.policyNumber,
        plan_name: formData.planName,
        policy_booking_date: formData.policyBookingDate,
        policy_start_date: formData.policyStartDate,
        policy_end_date: formData.policyEndDate,
        policy_term_years: Number(formData.policyTerm),
        payment_mode: formData.paymentMode,
        sum_insured: Number(formData.sumInsured),
        net_premium: Number(formData.netPremium),
        gst_percentage: Number(formData.gstPercent),
        total_premium: Number(formData.totalPremium),
        installment_autopay_start_date: formData.policyStartDate,
        installment_autopay_end_date: formData.policyEndDate,
        family_members: formData.family_members.map(m => ({
          full_name: m.full_name,
          age: Number(m.age),
          relationship: m.relationship,
          sum_insured: Number(m.sum_insured || formData.sumInsured),
        })),
        documents: attachments.map((file, idx) => ({
          document_type: DOCUMENT_TYPES[0],
          document_file: 'base64_string_here',
          name: file.name || `attachment_${idx + 1}`,
        })),
      };

      const res = await api.addHealthPolicy(token, payload);

      if (res.status) {
        Alert.alert(
          'Success',
          `${res.message}\nPolicy No: ${res.data.policy_number}`,
          [
            {
              text: 'OK',
              onPress: () => {
                resetForm();
                onSuccess && onSuccess();
              },
            },
          ],
        );
      } else {
        // backend returned status: false
        const msg = res.message || 'Health policy not created';
        console.log('[DEBUG] addHealthPolicy logical error:', msg, res);
        setError(msg);
      }
    } catch (e) {
      // exact error from api.js
      console.log('[DEBUG] addHealthPolicy catch error:', e.message);
      setError(e.message || 'Something went wrong while creating policy');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const renderDateInput = (label, fieldKey) => (
    <>
      <Text style={formStyles.label}>{label}</Text>
      <TouchableOpacity
        style={formStyles.dateInput}
        onPress={() => openDatePicker(fieldKey, formData[fieldKey])}
      >
        <Text style={{ color: formData[fieldKey] ? '#0f172a' : '#94a3b8' }}>
          {formData[fieldKey] || 'Select date'}
        </Text>
      </TouchableOpacity>
    </>
  );

  // STEP 0 – client card
  const renderStep0 = () => (
    <>
      <View style={formStyles.headerBand}>
        <Text style={formStyles.headerTitle}>Create Health Policy</Text>
        <Text style={formStyles.headerSubtitle}>Step 1 of 5 · Client details</Text>
      </View>

      <View style={formStyles.card}>
        <Text style={formStyles.cardTitle}>Client Details</Text>
        <Text style={formStyles.cardSubtitle}>Link policy to an existing customer</Text>

        <Text style={formStyles.label}>Client</Text>
        {loadingCustomers ? (
          <ActivityIndicator />
        ) : (
          <View style={formStyles.pickerWrapper}>
            <Picker
              selectedValue={formData.client_id}
              onValueChange={val => {
                const c = customers.find(x => String(x.id) === String(val));
                handleChange('client_id', val);
                handleChange('policy_holder', c?.name || '');
              }}>
              <Picker.Item label="Select client" value="" />
              {customers.map(c => (
                <Picker.Item key={c.id} label={`${c.name} (${c.mobile})`} value={c.id} />
              ))}
            </Picker>
          </View>
        )}

        <TextInput
          placeholder="Reference by name"
          style={formStyles.input}
          value={formData.referenceName}
          onChangeText={t => handleChange('referenceName', t)}
        />
        <TextInput
          placeholder="Broker name"
          style={formStyles.input}
          value={formData.brokerName}
          onChangeText={t => handleChange('brokerName', t)}
        />
      </View>

      <View style={formStyles.buttonRow}>
        <TouchableOpacity
          style={formStyles.secondaryButton}
          onPress={() => {
            resetForm();
            onCancel && onCancel();
          }}
        >
          <Text style={formStyles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={formStyles.primaryButton} onPress={onNext}>
          <Text style={formStyles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

    </>
  );

  // STEP 1 – insurance card
  const renderStep1 = () => (
    <>
      <View style={formStyles.headerBand}>
        <Text style={formStyles.headerTitle}>Create Health Policy</Text>
        <Text style={formStyles.headerSubtitle}>Step 2 of 5 · Insurance details</Text>
      </View>

      <View style={formStyles.card}>
        <Text style={formStyles.cardTitle}>Insurance Details</Text>
        <Text style={formStyles.cardSubtitle}>Select company and basic policy info</Text>

        <Text style={formStyles.label}>Insurance company</Text>
        {loadingCompanies ? (
          <ActivityIndicator />
        ) : (
          <View style={formStyles.pickerWrapper}>
            <Picker
              selectedValue={formData.insurance_company_id}
              onValueChange={val => {
                const c = companies.find(x => x.id === val);
                handleChange('insurance_company_id', val);
                handleChange('insurance_company_name', c?.name || '');
              }}>
              <Picker.Item label="Select company" value="" />
              {companies.map(c => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={formStyles.label}>Policy type</Text>
        <View style={formStyles.pickerWrapper}>
          <Picker
            selectedValue={formData.policyType}
            onValueChange={v => handleChange('policyType', v)}>
            {POLICY_TYPES.map(p => (
              <Picker.Item key={p} label={p} value={p} />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Plan name"
          style={formStyles.input}
          value={formData.planName}
          onChangeText={t => handleChange('planName', t)}
        />
        <TextInput
          placeholder="Policy number"
          style={formStyles.input}
          value={formData.policyNumber}
          onChangeText={t => handleChange('policyNumber', t)}
        />
      </View>

      <View style={formStyles.buttonRow}>
        <TouchableOpacity style={formStyles.secondaryButton} onPress={onPrev}>
          <Text style={formStyles.secondaryButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={formStyles.primaryButton} onPress={onNext}>
          <Text style={formStyles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // STEP 2 – premium & dates card
  const renderStep2 = () => (
    <>
      <View style={formStyles.headerBand}>
        <Text style={formStyles.headerTitle}>Create Health Policy</Text>
        <Text style={formStyles.headerSubtitle}>Step 3 of 5 · Premium & dates</Text>
      </View>

      <View style={formStyles.card}>
        <Text style={formStyles.cardTitle}>Premium & Dates</Text>
        <Text style={formStyles.cardSubtitle}>Capture amounts and policy period</Text>

        <Text style={formStyles.label}>Payment mode</Text>
        <View style={formStyles.pickerWrapper}>
          <Picker
            selectedValue={formData.paymentMode}
            onValueChange={v => handleChange('paymentMode', v)}>
            {PAYMENT_MODES.map(p => (
              <Picker.Item key={p} label={p} value={p} />
            ))}
          </Picker>
        </View>

        {renderDateInput('Policy booking date', 'policyBookingDate')}
        {renderDateInput('Policy start date', 'policyStartDate')}
        {renderDateInput('Policy end date', 'policyEndDate')}

        <TextInput
          placeholder="Policy term (years)"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.policyTerm)}
          onChangeText={t => handleChange('policyTerm', t)}
        />

        <TextInput
          placeholder="Sum insured"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.sumInsured)}
          onChangeText={t => handleChange('sumInsured', t)}
        />
        <TextInput
          placeholder="Net premium"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.netPremium)}
          onChangeText={t => handleChange('netPremium', t)}
        />
        <TextInput
          placeholder="GST %"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.gstPercent)}
          onChangeText={t => handleChange('gstPercent', t)}
        />
        <TextInput
          placeholder="Total premium"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.totalPremium)}
          onChangeText={t => handleChange('totalPremium', t)}
        />
        <TextInput
          placeholder="Extra note"
          style={formStyles.input}
          value={formData.extraNote}
          onChangeText={t => handleChange('extraNote', t)}
        />
      </View>

      <View style={formStyles.buttonRow}>
        <TouchableOpacity style={formStyles.secondaryButton} onPress={onPrev}>
          <Text style={formStyles.secondaryButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={formStyles.primaryButton} onPress={onNext}>
          <Text style={formStyles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // STEP 3 – commission card
  const renderStep3 = () => (
    <>
      <View style={formStyles.headerBand}>
        <Text style={formStyles.headerTitle}>Create Health Policy</Text>
        <Text style={formStyles.headerSubtitle}>Step 4 of 5 · Commission</Text>
      </View>

      <View style={formStyles.card}>
        <Text style={formStyles.cardTitle}>Commission</Text>
        <Text style={formStyles.cardSubtitle}>Internal commission breakup (optional)</Text>

        <TextInput
          placeholder="1st year commission %"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.firstYearCommission)}
          onChangeText={t => handleChange('firstYearCommission', t)}
        />
        <TextInput
          placeholder="Sub-agent commission amount"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.subAgentCommission)}
          onChangeText={t => handleChange('subAgentCommission', t)}
        />
        <TextInput
          placeholder="Sub-agent TDS %"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.subAgentTDSPercent)}
          onChangeText={t => handleChange('subAgentTDSPercent', t)}
        />
        <TextInput
          placeholder="Sub-agent TDS amount"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.subAgentTDSAmount)}
          onChangeText={t => handleChange('subAgentTDSAmount', t)}
        />
        <TextInput
          placeholder="Sub-agent after TDS value"
          style={formStyles.input}
          keyboardType="numeric"
          value={String(formData.subAgentAfterTDSValue)}
          onChangeText={t => handleChange('subAgentAfterTDSValue', t)}
        />
      </View>

      <View style={formStyles.buttonRow}>
        <TouchableOpacity style={formStyles.secondaryButton} onPress={onPrev}>
          <Text style={formStyles.secondaryButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={formStyles.primaryButton} onPress={onNext}>
          <Text style={formStyles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // STEP 4 – family & docs card
  const renderStep4 = () => (
    <>
      <View style={formStyles.headerBand}>
        <Text style={formStyles.headerTitle}>Create Health Policy</Text>
        <Text style={formStyles.headerSubtitle}>Step 5 of 5 · Family & documents</Text>
      </View>

      <View style={formStyles.card}>
        <Text style={formStyles.cardTitle}>Family Members</Text>
        <Text style={formStyles.cardSubtitle}>Who is covered under this policy?</Text>

        {formData.family_members.map((m, idx) => (
          <View key={idx} style={formStyles.familyCard}>
            <View style={formStyles.familyHeaderRow}>
              <Text style={formStyles.familyHeader}>Member {idx + 1}</Text>
              {formData.family_members.length > 1 && (
                <TouchableOpacity onPress={() => removeFamilyMember(idx)}>
                  <Text style={formStyles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              placeholder="Full name"
              style={formStyles.input}
              value={m.full_name}
              onChangeText={t => handleFamilyChange(idx, 'full_name', t)}
            />
            <TextInput
              placeholder="Age"
              style={formStyles.input}
              keyboardType="numeric"
              value={String(m.age)}
              onChangeText={t => handleFamilyChange(idx, 'age', t)}
            />
            <View style={formStyles.pickerWrapper}>
              <Picker
                selectedValue={m.relationship}
                onValueChange={v => handleFamilyChange(idx, 'relationship', v)}>
                {RELATIONSHIPS.map(r => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>
            <TextInput
              placeholder="Member sum insured"
              style={formStyles.input}
              keyboardType="numeric"
              value={String(m.sum_insured)}
              onChangeText={t => handleFamilyChange(idx, 'sum_insured', t)}
            />
          </View>
        ))}

        <TouchableOpacity onPress={addFamilyMember}>
          <Text style={formStyles.addMemberText}>+ Add member</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 12 }}>
          <Text style={formStyles.cardTitle}>Attachments</Text>
          <Text style={formStyles.cardSubtitle}>Upload proposal / KYC / payment proof</Text>

          <TouchableOpacity
            style={formStyles.uploadBtn}
            onPress={pickAttachmentsHandler}>
            <Text style={formStyles.uploadBtnText}>Pick attachments</Text>
          </TouchableOpacity>
          {attachments.map((a, i) => (
            <Text key={i} style={formStyles.attachmentText}>
              {a.name || a.uri}
            </Text>
          ))}
        </View>

        {!!error && <Text style={formStyles.errorText}>{error}</Text>}
      </View>

      <View style={formStyles.buttonRow}>
        <TouchableOpacity style={formStyles.secondaryButton} onPress={onPrev}>
          <Text style={formStyles.secondaryButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={formStyles.primaryButton}
          onPress={onSubmit}
          disabled={loadingSubmit}>
          {loadingSubmit ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={formStyles.primaryButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <>
      <ScrollView style={formStyles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
        {formStep === 0 && renderStep0()}
        {formStep === 1 && renderStep1()}
        {formStep === 2 && renderStep2()}
        {formStep === 3 && renderStep3()}
        {formStep === 4 && renderStep4()}
      </ScrollView>

      {datePickerField && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
    </>
  );
}

const formStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerBand: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#0f172a',
  },
  headerTitle: {
    color: '#f9fafb',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#cbd5f5',
    marginTop: 4,
    fontSize: 13,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
    marginTop: 3,
  },
  label: {
    marginTop: 6,
    marginBottom: 4,
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  primaryButton: {
    flex: 1,
    marginLeft: 6,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    marginRight: 6,
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  familyCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9fafb',
  },
  familyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  familyHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  deleteText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  addMemberText: {
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 2,
  },
  uploadBtn: {
    marginTop: 8,
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  uploadBtnText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '600',
  },
  attachmentText: {
    fontSize: 11,
    marginTop: 4,
    color: '#475569',
  },
  errorText: {
    marginTop: 10,
    color: '#dc2626',
    fontSize: 13,
  },
});
