import React from 'react';
import { Text, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function TermsScreen(){
const url = 'https://example.com/terms';
return (
<SafeAreaView style={{flex:1,padding:16}}>
<Text style={{fontSize:20,fontWeight:'700', marginBottom:12}}>Terms & Conditions</Text>
<Text style={{marginBottom:12}}>This will open in browser.</Text>
<TouchableOpacity onPress={()=>Linking.openURL(url)} style={{backgroundColor:'#007bff', padding:12, borderRadius:8}}>
<Text style={{color:'#fff', textAlign:'center'}}>Open Terms</Text>
</TouchableOpacity>
</SafeAreaView>
)
}