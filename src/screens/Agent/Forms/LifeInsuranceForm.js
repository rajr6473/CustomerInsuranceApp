// src/screens/Agent/Forms/JS/LifeInsuranceForm.js
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

const POLICY_TYPES = ['term', 'endowment', 'money back', 'ulip', 'whole life'];
const PAYMENT_MODES = ['yearly', 'half-yearly', 'quarterly', 'monthly', 'single'];
const NOMINEE_RELATIONS = ['spouse', 'father', 'mother', 'son', 'daughter', 'brother', 'sister', 'other'];

const initialFormData = {
  client_id: '',
  policy_holder: '',
  insured_name: '',

  insurance_company_id: '',
  agency_code_id: '',
  policy_type: 'term',
  payment_mode: 'yearly',
  policy_number: '',
  policy_booking_date: '',
  policy_start_date: '',
  policy_end_date: '',
  policy_term_years: '',
  premium_payment_term_years: '',
  plan_name: '',
  sum_insured: '',
  net_premium: '',
  gst_percentage_year_1: '18',
  gst_percentage_year_2: '4.5',
  gst_percentage_year_3: '4.5',
  total_premium: '',
  reference_by_name: '',

  installment_autopay_start_date: '',
  installment_autopay_end_date: '',

  nominees: [
    { nominee_name: '', relationship: 'spouse', age: '' },
  ],

  bank_name: '',
  account_type: '',
  account_number: '',
  ifsc_code: '',
  account_holder_name: '',
};

export default function LifeInsuranceForm({ onCancel, onSuccess, pickAttachmentsHandler }) {
  const { getToken } = useAuth();

  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [attachments, setAttachments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [holderEdited, setHolderEdited] = useState(false);
  const [insuredEdited, setInsuredEdited] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');

  // date picker state
  const [datePickerField, setDatePickerField] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNomineeChange = (index, key, value) => {
    setFormData(prev => {
      const updated = [...prev.nominees];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, nominees: updated };
    });
  };

  const addNominee = () => {
    setFormData(prev => ({
      ...prev,
      nominees: [...prev.nominees, { nominee_name: '', relationship: 'other', age: '' }],
    }));
  };

  const removeNominee = index => {
    setFormData(prev => {
      const updated = prev.nominees.filter((_, i) => i !== index);
      return { ...prev, nominees: updated.length ? updated : [{ nominee_name: '', relationship: 'spouse', age: '' }] };
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
    setDatePickerField(fieldKey);
    if (currentValue) {
      const [y, m, d] = currentValue.split('-');
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      setTempDate(date);
    } else {
      setTempDate(new Date());
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android' && event.type === 'dismissed') {
      setDatePickerField(null);
      return;
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

  const renderDateInput = (label, fieldKey) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => openDatePicker(fieldKey, formData[fieldKey])}
      >
        <Text style={{ color: formData[fieldKey] ? '#020617' : '#94a3b8' }}>
          {formData[fieldKey] || 'Select date'}
        </Text>
      </TouchableOpacity>
    </>
  );

  const validateBeforeSubmit = () => {
    const required = [
      'client_id',
      'policy_holder',
      'insured_name',
      'insurance_company_id',
      'policy_type',
      'policy_number',
      'policy_start_date',
      'policy_end_date',
      'policy_term_years',
      'payment_mode',
      'sum_insured',
      'net_premium',
      'gst_percentage_year_1',
      'total_premium',
    ];
    for (const k of required) {
      if (!String(formData[k]).trim()) {
        return `Please fill ${k.replace(/_/g, ' ')}`;
      }
    }
    if (!formData.nominees.length || !formData.nominees[0].nominee_name) {
      return 'Please add at least one nominee';
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
        insured_name: formData.insured_name,
        insurance_company_id: Number(formData.insurance_company_id),
        agency_code_id: formData.agency_code_id ? Number(formData.agency_code_id) : null,
        policy_type: formData.policy_type,
        payment_mode: formData.payment_mode,
        policy_number: formData.policy_number,
        policy_booking_date: formData.policy_booking_date,
        policy_start_date: formData.policy_start_date,
        policy_end_date: formData.policy_end_date,
        policy_term_years: Number(formData.policy_term_years),
        premium_payment_term_years: Number(formData.premium_payment_term_years || 0),
        plan_name: formData.plan_name,
        sum_insured: Number(formData.sum_insured),
        net_premium: Number(formData.net_premium),
        gst_percentage_year_1: Number(formData.gst_percentage_year_1),
        gst_percentage_year_2: Number(formData.gst_percentage_year_2 || 0),
        gst_percentage_year_3: Number(formData.gst_percentage_year_3 || 0),
        total_premium: Number(formData.total_premium),
        reference_by_name: formData.reference_by_name,
        installment_autopay_start_date: formData.installment_autopay_start_date || formData.policy_start_date,
        installment_autopay_end_date: formData.installment_autopay_end_date || formData.policy_end_date,
        nominees: formData.nominees.map(n => ({
          nominee_name: n.nominee_name,
          relationship: n.relationship,
          age: Number(n.age),
        })),
        bank_details: {
          bank_name: formData.bank_name,
          account_type: formData.account_type,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          account_holder_name: formData.account_holder_name,
        },
        documents: attachments.map((file, idx) => ({
          document_type: 'proposal_form',
          document_file: 'base64_encoded_pdf_string_here',
          name: file.name || `attachment_${idx + 1}`,
        })),
      };

      console.log('[DEBUG] addLifePolicy payload:', payload);
      const res = await api.addLifePolicy(token, payload); // you will implement in api.js

      if (res.status) {
        Alert.alert(
          'Success',
          `${res.message}\nPolicy No: ${res.data?.policy_number || ''}`,
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
        setError(res.message || 'Life policy not created');
      }
    } catch (e) {
      console.log('[DEBUG] addLifePolicy error:', e.message);
      setError(e.message || 'Something went wrong while creating life policy');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // STEP 0 – client / insured
  const renderStep0 = () => (
    <>
      <View style={styles.headerBand}>
        <Text style={styles.headerTitle}>Create Life Policy</Text>
        <Text style={styles.headerSubtitle}>Step 1 of 4 · Client & insured</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Client & Insured</Text>
        <Text style={styles.cardSubtitle}>Select client and proposer details</Text>

        <Text style={styles.label}>Client</Text>
        {loadingCustomers ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.client_id}
              onValueChange={val => {
                const c = customers.find(x => String(x.id) === String(val));
                handleChange('client_id', val);
              }}
            >

              <Picker.Item label="Select client" value="" />
              {customers.map(c => (
                <Picker.Item key={c.id} label={`${c.name} (${c.mobile})`} value={c.id} />
              ))}
            </Picker>
          </View>
        )}

        <TextInput
          placeholder="Policy holder name"
          style={styles.input}
          value={formData.policy_holder}
          onChangeText={t => handleChange('policy_holder', t)}
        />

        <TextInput
          placeholder="Insured name"
          style={styles.input}
          value={formData.insured_name}
          onChangeText={t => handleChange('insured_name', t)}
        />
        <TextInput
          placeholder="Reference by name"
          style={styles.input}
          value={formData.reference_by_name}
          onChangeText={t => handleChange('reference_by_name', t)}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            resetForm();
            onCancel && onCancel();
          }}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // STEP 1 – policy basics
  const renderStep1 = () => (
    <>
      <View style={styles.headerBand}>
        <Text style={styles.headerTitle}>Create Life Policy</Text>
        <Text style={styles.headerSubtitle}>Step 2 of 4 · Policy details</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Policy Details</Text>
        <Text style={styles.cardSubtitle}>Company, type and plan</Text>

        <Text style={styles.label}>Insurance company</Text>
        {loadingCompanies ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.insurance_company_id}
              onValueChange={val => {
                const c = companies.find(x => x.id === val);
                handleChange('insurance_company_id', val);
              }}>
              <Picker.Item label="Select company" value="" />
              {companies.map(c => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>
          </View>
        )}

        <TextInput
          placeholder="Agency code ID"
          style={styles.input}
          keyboardType="numeric"
          value={String(formData.agency_code_id || '')}
          onChangeText={t => handleChange('agency_code_id', t)}
        />

        <Text style={styles.label}>Policy type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.policy_type}
            onValueChange={v => handleChange('policy_type', v)}>
            {POLICY_TYPES.map(p => (
              <Picker.Item key={p} label={p} value={p} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Payment mode</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.payment_mode}
            onValueChange={v => handleChange('payment_mode', v)}>
            {PAYMENT_MODES.map(p => (
              <Picker.Item key={p} label={p} value={p} />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Policy number"
          style={styles.input}
          value={formData.policy_number}
          onChangeText={t => handleChange('policy_number', t)}
        />
        <TextInput
          placeholder="Plan name"
          style={styles.input}
          value={formData.plan_name}
          onChangeText={t => handleChange('plan_name', t)}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
          <Text style={styles.secondaryButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // STEP 2 – premium & terms
  const renderStep2 = () => (
    <>
      <View style={styles.headerBand}>
        <Text style={styles.headerTitle}>Create Life Policy</Text>
        <Text style={styles.headerSubtitle}>Step 3 of 4 · Premium & terms</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Premium & Terms</Text>
        <Text style={styles.cardSubtitle}>Amounts and tenure</Text>

        {renderDateInput('Policy booking date', 'policy_booking_date')}
        {renderDateInput('Policy start date', 'policy_start_date')}
        {renderDateInput('Policy end date', 'policy_end_date')}

        <TextInput
          placeholder="Policy term (years)"
          style={styles.input}
          keyboardType="numeric"
          value={String(formData.policy_term_years)}
          onChangeText={t => handleChange('policy_term_years', t)}
        />
        <TextInput
          placeholder="Premium payment term (years)"
          style={styles.input}
          keyboardType="numeric"
          value={String(formData.premium_payment_term_years)}
          onChangeText={t => handleChange('premium_payment_term_years', t)}
        />

        <TextInput
          placeholder="Sum insured"
          style={styles.input}
          keyboardType="numeric"
          value={String(formData.sum_insured)}
          onChangeText={t => handleChange('sum_insured', t)}
        />
        <TextInput
          placeholder="Net premium"
          style={styles.input}
          keyboardType="numeric"
          value={String(formData.net_premium)}
          onChangeText={t => handleChange('net_premium', t)}
        />
        <TextInput
          placeholder="GST % year 1"
          style={styles.input}
          keyboardType="numeric"
          value={String(formData.gst_percentage_year_1)}
          onChangeText={t => handleChange('gst_percentage_year_1', t)}
        />
        <TextInput
          placeholder="GST % year 2"
          style={styles.input}
          keyboardType="numeric"
          value={String(formData.gst_percentage_year_2)}
          onChangeText={t => handleChange('gst_percentage_year_2', t)}
        />
        <TextInput
          placeholder="GST % year 3"
          style={styles.input}
          keyboardType="numeric"
          value={String(formData.gst_percentage_year_3)}
          onChangeText={t => handleChange('gst_percentage_year_3', t)}
        />
        <TextInput
          placeholder="Total premium"
          style={styles.input}
          keyboardType="numeric"
          value={String(formData.total_premium)}
          onChangeText={t => handleChange('total_premium', t)}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
          <Text style={styles.secondaryButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // STEP 3 – nominee, bank, documents
  const renderStep3 = () => (
    <>
      <View style={styles.headerBand}>
        <Text style={styles.headerTitle}>Create Life Policy</Text>
        <Text style={styles.headerSubtitle}>Step 4 of 4 · Nominee & bank</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nominee Details</Text>
        <Text style={styles.cardSubtitle}>Who will receive benefits?</Text>

        {formData.nominees.map((n, idx) => (
          <View key={idx} style={styles.familyCard}>
            <View style={styles.familyHeaderRow}>
              <Text style={styles.familyHeader}>Nominee {idx + 1}</Text>
              {formData.nominees.length > 1 && (
                <TouchableOpacity onPress={() => removeNominee(idx)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              placeholder="Nominee name"
              style={styles.input}
              value={n.nominee_name}
              onChangeText={t => handleNomineeChange(idx, 'nominee_name', t)}
            />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={n.relationship}
                onValueChange={v => handleNomineeChange(idx, 'relationship', v)}>
                {NOMINEE_RELATIONS.map(r => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>
            <TextInput
              placeholder="Age"
              style={styles.input}
              keyboardType="numeric"
              value={String(n.age)}
              onChangeText={t => handleNomineeChange(idx, 'age', t)}
            />
          </View>
        ))}

        <TouchableOpacity onPress={addNominee}>
          <Text style={styles.addMemberText}>+ Add nominee</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.cardTitle}>Bank Details</Text>
          <Text style={styles.cardSubtitle}>For payouts and refunds</Text>

          <TextInput
            placeholder="Bank name"
            style={styles.input}
            value={formData.bank_name}
            onChangeText={t => handleChange('bank_name', t)}
          />
          <TextInput
            placeholder="Account type"
            style={styles.input}
            value={formData.account_type}
            onChangeText={t => handleChange('account_type', t)}
          />
          <TextInput
            placeholder="Account number"
            style={styles.input}
            keyboardType="numeric"
            value={formData.account_number}
            onChangeText={t => handleChange('account_number', t)}
          />
          <TextInput
            placeholder="IFSC code"
            style={styles.input}
            value={formData.ifsc_code}
            onChangeText={t => handleChange('ifsc_code', t)}
          />
          <TextInput
            placeholder="Account holder name"
            style={styles.input}
            value={formData.account_holder_name}
            onChangeText={t => handleChange('account_holder_name', t)}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.cardTitle}>Attachments</Text>
          <Text style={styles.cardSubtitle}>Upload proposal / KYC / payment proof</Text>

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={pickAttachmentsHandler}>
            <Text style={styles.uploadBtnText}>Pick attachments</Text>
          </TouchableOpacity>
          {attachments.map((a, i) => (
            <Text key={i} style={styles.attachmentText}>
              {a.name || a.uri}
            </Text>
          ))}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
          <Text style={styles.secondaryButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onSubmit}
          disabled={loadingSubmit}>
          {loadingSubmit ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
        {formStep === 0 && renderStep0()}
        {formStep === 1 && renderStep1()}
        {formStep === 2 && renderStep2()}
        {formStep === 3 && renderStep3()}
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

const styles = StyleSheet.create({
  // different background from Health (deep green-blue)
  screen: {
    flex: 1,
    backgroundColor: '#022c22',
  },
  headerBand: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#022c22',
  },
  headerTitle: {
    color: '#ecfdf5',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#a7f3d0',
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
    color: '#022c22',
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
    color: '#020617',
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
    backgroundColor: '#0f766e',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#0f766e',
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
    color: '#0f766e',
    fontWeight: '600',
    marginTop: 2,
  },
  uploadBtn: {
    marginTop: 8,
    backgroundColor: '#ecfdf5',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  uploadBtnText: {
    color: '#0f766e',
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
