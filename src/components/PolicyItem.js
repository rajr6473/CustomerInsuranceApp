import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


export default function PolicyItem({ item, onDownload }){
return (
<View style={{padding:12, borderWidth:1, borderColor:'#eee', borderRadius:8, marginBottom:8}}>
<Text style={{fontWeight:'700'}}>{item.name}</Text>
<Text>Policy No: {item.policyNo}</Text>
<Text>{item.start} - {item.end}</Text>
<Text>Premium: {item.premium}</Text>
<TouchableOpacity onPress={()=> onDownload && onDownload(item)} style={{marginTop:8}}>
<Text style={{color:'#007bff'}}>Download</Text>
</TouchableOpacity>
</View>
)
}