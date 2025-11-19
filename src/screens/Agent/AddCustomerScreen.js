import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';



const states = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh"
];

export default function AddCustomerScreen(props) {
  const [customerType, setCustomerType] = useState('Individual');
    const navigation = props.navigation || useNavigation(); // Fallback if not passed
  
  // Shared states
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [pan, setPan] = useState('');
  const [gst, setGst] = useState('');
  // const [profileImage, setProfileImage] = useState(null); // Handle with your image picker logic
  const [documents, setDocuments] = useState([]);
  const [additionalNote, setAdditionalNote] = useState('');
  const [loading, setLoading] = useState(false);

  // Individual specific states
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [birthPlace, setBirthPlace] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [education, setEducation] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [businessJob, setBusinessJob] = useState('');
  const [businessJobName, setBusinessJobName] = useState('');
  const [dutyType, setDutyType] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  

  
  // Corporate specific states
  const [companyName, setCompanyName] = useState('');

  const handleCancel = () => {
      navigation.navigate('AgentMain');
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
  
  
  const onSubmit = async () => {
    try {
      let payload;
      if (customerType === 'Individual') {
        payload = {
          customerType,
          firstName,
          middleName,
          lastName,
          mobile,
          email,
          state,
          address,
          birthDate: birthDate.toISOString(),
          birthPlace,
          gender,
          height,
          weight,
          education,
          maritalStatus,
          businessJob,
          businessJobName,
          dutyType,
          annualIncome,
          pan,
          gst,
          // profileImage,
          documents,
          additionalNote
        };
      } else {
        payload = {
          customerType,
          companyName,
          mobile,
          email,
          state,
          address,
          dutyType,
          annualIncome,
          pan,
          gst,
          // profileImage,
          documents,
          additionalNote
        };
      }

      // Call you API here
      await api.addCustomer(payload);

      Alert.alert('Success', 'Customer added!');
      // Clear all fields if necessary

    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'Error occurred');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>Create Customer</Text>

        {/* Radio Buttons */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <TouchableOpacity onPress={() =>{setCustomerType('Individual');
            setState(''); setBirthDate(null);}}
            style={{ marginRight: 16 }}>
            <Text style={{ color: customerType === 'Individual' ? '#007bff' : '#000' }}>
              ⬤ Individual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setCustomerType('Corporate');
            setState('');}
          }>
            <Text style={{ color: customerType === 'Corporate' ? '#007bff' : '#000' }}>
              ⬤ Corporate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditional Form Rendering */}
        {customerType === 'Individual' ? (
          <View>
            <Text style={{ fontWeight: '500', marginBottom: 8 }}>Personal Detail</Text>
            <TextInput placeholder="First Name*" value={firstName} onChangeText={setFirstName} style={inputStyle} />
            <TextInput placeholder="Middle Name" value={middleName} onChangeText={setMiddleName} style={inputStyle} />
            <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={inputStyle} />
            <TextInput placeholder="Mobile Number*" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" style={inputStyle} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={inputStyle} />
            <View style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 6,
              marginBottom: 8,
              height: 56,             // Slightly increased
              justifyContent: 'center', // Ensures value is vertically centered
            }}>
              <Picker
                selectedValue={state}
                onValueChange={setState}
                style={{
                  height: 56,           // Match parent for no cropping
                  color: '#222',
                  backgroundColor: 'transparent'
                }}
                dropdownIconColor="#222" // if RN version supports it
              >
                <Picker.Item label="Select State" value="" />
                {states.map((stateName, i) => (
                  <Picker.Item label={stateName} value={stateName} key={i} />
                ))}
              </Picker>
            </View>
            <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={inputStyle} />
            {/* Add Pickers/Inputs for Gender, Height, Weight, Education, Marital Status, etc. */}
            {/* Add Date Picker for Birth Date */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={inputStyle}>
              <Text style={{ color: birthDate ? "#000" : "#bbb" }}>
                {birthDate ? birthDate.toLocaleDateString() : "Select Birth Date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setBirthDate(selectedDate);
                }}
              />
            )}
            <TextInput placeholder="Birth Place" value={birthPlace} onChangeText={setBirthPlace} style={inputStyle} />
            {/* Business/Job Section */}
            <Text style={{ fontWeight: '500', color: '#007bff', marginTop: 16 }}>Business/Job</Text>
            <TextInput placeholder="Name of Business/Job" value={businessJobName} onChangeText={setBusinessJobName} style={inputStyle} />
            <TextInput placeholder="Type of Duty" value={dutyType} onChangeText={setDutyType} style={inputStyle} />
            <TextInput placeholder="Annual Income" value={annualIncome} onChangeText={setAnnualIncome} style={inputStyle} />
            <TextInput placeholder="Pan No." value={pan} onChangeText={setPan} style={inputStyle} />
            <TextInput placeholder="GST No." value={gst} onChangeText={setGst} style={inputStyle} />
            {/* Profile Image and Document upload logic goes here */}
            <TextInput placeholder="Additional Note" value={additionalNote} onChangeText={setAdditionalNote} style={inputStyle} />
          </View>
        ) : (
          <View>
            <Text style={{ fontWeight: '500', marginBottom: 8 }}>Corporate Details</Text>
            <TextInput placeholder="Company Name*" value={companyName} onChangeText={setCompanyName} style={inputStyle} />
            <TextInput placeholder="Mobile Number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" style={inputStyle} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={inputStyle} />
            <View style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 6,
              marginBottom: 8,
              height: 56,             // Slightly increased
              justifyContent: 'center', // Ensures value is vertically centered
            }}>
              <Picker
                selectedValue={state}
                onValueChange={setState}
                style={{
                  height: 56,           // Match parent for no cropping
                  color: '#222',
                  backgroundColor: 'transparent'
                }}
                dropdownIconColor="#222" // if RN version supports it
              >
                <Picker.Item label="Select State" value="" />
                {states.map((stateName, i) => (
                  <Picker.Item label={stateName} value={stateName} key={i} />
                ))}
              </Picker>
            </View>
            <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={inputStyle} />
            <TextInput placeholder="Type of Duty" value={dutyType} onChangeText={setDutyType} style={inputStyle} />
            <TextInput placeholder="Annual Income" value={annualIncome} onChangeText={setAnnualIncome} style={inputStyle} />
            <TextInput placeholder="Pan No." value={pan} onChangeText={setPan} style={inputStyle} />
            <TextInput placeholder="GST No." value={gst} onChangeText={setGst} style={inputStyle} />
            {/* Profile Image and Document upload logic goes here */}
            <TextInput placeholder="Additional Note" value={additionalNote} onChangeText={setAdditionalNote} style={inputStyle} />
          </View>
        )}

        {/* <TouchableOpacity onPress={onSubmit} style={{
          backgroundColor: "#007bff",
          padding: 15,
          borderRadius: 8,
          marginTop: 20
        }}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: '700' }}>Save</Text>
        </TouchableOpacity> */}
       <View style={{ alignItems: 'center', marginBottom: 28 }}>
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: '#e0e0e0',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: '#cfcfcf',
          }}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={{ width: 90, height: 90 }} />
          ) : (
            <Text style={{ color: '#666' }}>No Photo</Text>
          )}
        </View>
        <TouchableOpacity onPress={pickProfilePicHandler}>
          <Text style={{ color: '#007bff', fontWeight: '500', fontSize: 15 }}>
            Upload Profile Photo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Attachments Section */}
      <View style={{ marginBottom: 28 }}>
        <Text style={styles.label}>Attachments</Text>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={pickAttachmentsHandler}
          activeOpacity={0.7}>
          <Text style={styles.uploadBtnText}>Select Files</Text>
        </TouchableOpacity>
        {attachments && attachments.length > 0 && (
          <View style={{ marginTop: 12 }}>
            {attachments.map(item => renderAttachment(item))}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.cancelBtn]}
          onPress={handleCancel}
          disabled={loading}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.submitBtn,
            loading && { opacity: 0.6 }
          ]}
          onPress={onSubmit}
          disabled={loading}>
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#ddd",
  padding: 10,
  marginBottom: 8,
  borderRadius: 6
};
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


  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center'
  },
  label: {
    fontWeight: '500',
    marginBottom: 10,
    fontSize: 16,
    color: '#334155',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    elevation: 1,
  },
  submitBtn: {
    backgroundColor: '#007bff',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelBtn: {
    backgroundColor: '#f3f3f3',
    borderWidth: 1,
    borderColor: '#c0c0c0',
  },
  cancelBtnText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  uploadBtn: {
    backgroundColor: '#eef6ff',
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  uploadBtnText: {
    color: '#007bff',
    fontWeight: '500',
    fontSize: 15,
  },

});