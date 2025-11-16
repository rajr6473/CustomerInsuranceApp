import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function ForgotPasswordScreen({ navigation }){
const [email, setEmail] = useState('');
const onSubmit = async ()=>{
try{
await api.forgotPassword({ email });
Alert.alert('Success','Reset link sent to email');
navigation.goBack();
}catch(e){ Alert.alert('Error', e.response?.data?.message || e.message) }
}


return (
<SafeAreaView style={{flex:1, padding:16}}>
<Text style={{fontSize:20,fontWeight:'700', marginBottom:12}}>Forgot Password</Text>
<TextInput placeholder="Registered Email" value={email} onChangeText={setEmail} style={{borderWidth:1,borderColor:'#ddd', padding:10, marginBottom:12}} autoCapitalize='none' />
<TouchableOpacity onPress={onSubmit} style={{backgroundColor:'#007bff', padding:12, borderRadius:8}}>
<Text style={{color:'#fff', textAlign:'center'}}>Continue</Text>
</TouchableOpacity>
</SafeAreaView>
)
}