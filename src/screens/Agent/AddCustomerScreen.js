import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const states = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh"
];

export default function AddCustomerScreen() {
  const [customerType, setCustomerType] = useState('Individual');
  
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

  // Individual specific states
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
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

  
  // Corporate specific states
  const [companyName, setCompanyName] = useState('');
  
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
            setState('');}}
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
            <Picker
                    selectedValue={state}
                    onValueChange={setState}
                    style={[inputStyle, { padding: 0 }]}
                  >
                    <Picker.Item label="Select State" value="" />
                    {states.map((stateName, i) => (
                      <Picker.Item label={stateName} value={stateName} key={i} />
                    ))}
            </Picker>
            <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={inputStyle} />
            {/* Add Pickers/Inputs for Gender, Height, Weight, Education, Marital Status, etc. */}
            {/* Add Date Picker for Birth Date */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={inputStyle}>
              <Text style={{ color: birthDate ? "#000" : "#bbb" }}>
                {birthDate ? birthDate.toLocaleDateString() : "Birth Date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
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
            <Picker
                    selectedValue={state}
                    onValueChange={setState}
                    style={[inputStyle, { padding: 0 }]}
                  >
                    <Picker.Item label="Select State" value="" />
                    {states.map((stateName, i) => (
                      <Picker.Item label={stateName} value={stateName} key={i} />
                    ))}
            </Picker>
            <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={inputStyle} />
            <TextInput placeholder="Type of Duty" value={dutyType} onChangeText={setDutyType} style={inputStyle} />
            <TextInput placeholder="Annual Income" value={annualIncome} onChangeText={setAnnualIncome} style={inputStyle} />
            <TextInput placeholder="Pan No." value={pan} onChangeText={setPan} style={inputStyle} />
            <TextInput placeholder="GST No." value={gst} onChangeText={setGst} style={inputStyle} />
            {/* Profile Image and Document upload logic goes here */}
            <TextInput placeholder="Additional Note" value={additionalNote} onChangeText={setAdditionalNote} style={inputStyle} />
          </View>
        )}

        <TouchableOpacity onPress={onSubmit} style={{
          backgroundColor: "#007bff",
          padding: 15,
          borderRadius: 8,
          marginTop: 20
        }}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: '700' }}>Save</Text>
        </TouchableOpacity>
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