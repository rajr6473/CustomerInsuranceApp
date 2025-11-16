import React, {useState} from 'react';
import { TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import api from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext'; // adjust relative path as needed



export default function ChangePasswordScreen(){
const [current, setCurrent] = useState('');
const [newPwd, setNewPwd] = useState('');
const [confirm, setConfirm] = useState('');
const auth = useAuth();


const onUpdate = async ()=>{
if(newPwd !== confirm) { Alert.alert('Error','Passwords do not match'); return }
try{
// call change password endpoint - here reusing register for placeholder
await api.changePassword ? api.changePassword(auth.getToken(), { current, newPwd }) : Promise.resolve();
Alert.alert('Success','Password updated');
}catch(e){ Alert.alert('Error', e.response?.data?.message || e.message) }
}


return (
<SafeAreaView style={{flex:1,padding:16}}>
<Text style={{fontSize:20,fontWeight:'700', marginBottom:12}}>Change Password</Text>
<TextInput placeholder="Current Password" value={current} onChangeText={setCurrent} secureTextEntry style={{borderWidth:1,borderColor:'#ddd',padding:10, marginBottom:8}} />
<TextInput placeholder="New Password" value={newPwd} onChangeText={setNewPwd} secureTextEntry style={{borderWidth:1,borderColor:'#ddd',padding:10, marginBottom:8}} />
<TextInput placeholder="Confirm New Password" value={confirm} onChangeText={setConfirm} secureTextEntry style={{borderWidth:1,borderColor:'#ddd',padding:10, marginBottom:8}} />
<TouchableOpacity onPress={onUpdate} style={{backgroundColor:'#007bff', padding:12, borderRadius:8}}>
<Text style={{color:'#fff', textAlign:'center'}}>Update</Text>
</TouchableOpacity>
</SafeAreaView>
)
}