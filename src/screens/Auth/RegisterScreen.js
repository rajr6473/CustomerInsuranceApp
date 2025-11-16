import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import api from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function RegisterScreen({ navigation }){
const [firstName,setFirstName] = useState('');
const [lastName,setLastName] = useState('');
const [email,setEmail] = useState('');
const [phone,setPhone] = useState('');
const [password,setPassword] = useState('');
const [confirm,setConfirm] = useState('');


const onRegister = async ()=>{
if(password !== confirm) { Alert.alert('Error','Passwords do not match'); return }
try{
await api.register({ firstName, lastName, email, phone, password });
Alert.alert('Registered','Please login');
navigation.goBack();
}catch(e){ Alert.alert('Error', e.response?.data?.message || e.message) }
}


return (
<ScrollView contentContainerStyle={{padding:16}}>
<Text style={{fontSize:20, fontWeight:'700', marginBottom:12}}>Register</Text>
<View style={{flexDirection:'row', gap:8}}>
<TextInput placeholder="First" value={firstName} onChangeText={setFirstName} style={{flex:1, borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:8}} />
<TextInput placeholder="Last" value={lastName} onChangeText={setLastName} style={{flex:1, borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:8}} />
</View>
<TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:8}} autoCapitalize='none' />
<TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={{borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:8}} keyboardType='phone-pad' />
<TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:8}} />
<TextInput placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry style={{borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:8}} />
<TouchableOpacity onPress={onRegister} style={{backgroundColor:'#007bff', padding:12, borderRadius:8}}>
<Text style={{color:'#fff', textAlign:'center'}}>Register</Text>
</TouchableOpacity>
</ScrollView>
)
}