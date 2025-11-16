import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // adjust relative path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any icon library



export default function LoginScreen({ navigation }){
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const auth = useAuth();


const onLogin = async ()=>{
    // fake enable try catch later
    // await auth.signIn({ role: 'user', name: 'rajesh'});
    await auth.signIn({ role: 'agent', name: 'rajesh'});
// try{
// const res = await api.login({ email, password });
// if(!res || !res.token) throw new Error('Invalid response');
// // store token and fetch profile via App's signIn to reuse flows
// await auth.signIn({ email, password });
// }catch(e){ Alert.alert('Login failed', e.response?.data?.message || e.message) }
}

return (
    <SafeAreaView style={{ flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#fff' }}>
      {/* Logo */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        {/* Replace with <Image source={require('./logo.png')} /> */}
        <Text style={{ fontSize: 40, color: '#007bff', fontWeight: 'bold' }}>IB</Text>
        <Text style={{ fontSize: 20, color: '#666' }}>INSUREBOOK TECHNOLOGY PVT LTD</Text>
      </View>

      {/* Title */}
      <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>Sign In</Text>
      <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 20 }}>
        Please Enter The Details To Begin
      </Text>

      {/* User ID Input */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 8, marginBottom: 12, padding: 10 }}>
        <Icon name="person" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, fontSize: 16 }}
          placeholder="User ID or Mobile Number"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 8, marginBottom: 16, padding: 10 }}>
        <Icon name="lock" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, fontSize: 16 }}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "visibility" : "visibility-off"} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity onPress={onLogin} style={{ backgroundColor: '#007bff', borderRadius: 8, padding: 14, marginBottom: 12 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: '600' }}>Sign In</Text>
      </TouchableOpacity>

      {/* Action Links */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={{ color: '#007bff' }}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: '#007bff' }}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Contact & Version */}
      <Text style={{ textAlign: 'center', color: '#666', marginBottom: 4 }}>
        For Enquiry Contact Us: <Text style={{ color: '#007bff' }}>+91999999</Text>
      </Text>
      <Text style={{ textAlign: 'center', color: '#aaa', fontSize: 12 }}>Version 4.1 (Android 15)</Text>
    </SafeAreaView>
  );
}