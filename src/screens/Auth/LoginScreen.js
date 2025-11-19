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
const [loading, setLoading] = useState(false);
const auth = useAuth();

const onLogin = async () => {
    setLoading(true);
    try {
      await auth.signIn({ email: email.trim(), password: password.trim() });
      // Optionally: navigation.navigate('DashboardHome');
    } catch (e) {
      Alert.alert('Login failed', e.message);
    } finally {
      setLoading(false);
    }
  };
  
const onLoginOld = async () => {
  try {
  setLoading(true);
  const response = await fetch('https://dr-wise-ag.onrender.com/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password: password.trim() })
  });
  const data = await response.json();
  console.log(email.trim(), password.trim());
  console.log('Fetch response:', data);
  // if (!data.data?.token) throw new Error('Invalid response');
  if (data.success && data.data && data.data.token) {
    console.log('Login successful, token:', data.data.token);
  await auth.signIn({ token: data.data.token });
  // navigation.navigate('DashboardHome'); // enable this if you want auto-navigation
} else {
  throw new Error(data.message || 'Invalid response');
}

} catch (e) {
  Alert.alert('Login failed', e.message);
} finally {
  setLoading(false);
}

};


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
      <TouchableOpacity onPress={onLogin} disabled={loading} style={{ backgroundColor: '#007bff', borderRadius: 8, padding: 14, marginBottom: 12 }}>
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
    </SafeAreaView>
  );
}