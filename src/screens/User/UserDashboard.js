import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // adjust relative path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 


export default function UserDashboard({ navigation }){
const [data, setData] = useState(null);
const auth = useAuth();


useEffect(()=>{
const fetch = async ()=>{
try{
const res = await api.getUserDashboard(auth.getToken());
setData(res);
}catch(e){ console.warn(e) }
}
fetch();
},[]);

// Helper for displaying counts safely
const getCount = (items) => (items && items.length) || 0;

return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f8fc", padding: 18 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 18 }}>
        Customer name
      </Text>
      {/* Card #1 */}
      <TouchableOpacity
        style={{
          backgroundColor: "#e3f0fd",
          borderRadius: 18,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.09,
          shadowRadius: 5,
          elevation: 4
        }}
        onPress={() => navigation.navigate("MyInsurance")}
      >
        <Icon name="shield-check" size={36} color="#4092ff" style={{ marginRight: 20 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>My Portfolio</Text>
          <Text style={{ fontSize: 13, color: "#555" }}>
            Tap to view details of Insurance / Investments / etc
          </Text>
        </View>
        <Icon name="chevron-right" size={26} color="#aaa" />
      </TouchableOpacity>

      {/* Card #2 */}
      <TouchableOpacity
        style={{
          backgroundColor: "#e3f0fd",
          borderRadius: 18,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.09,
          shadowRadius: 5,
          elevation: 4
        }}
        onPress={() => navigation.navigate("UpcomingInstallment")}
      >
        <Icon name="credit-card-clock" size={36} color="#4092ff" style={{ marginRight: 20 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Upcoming Installment</Text>
          <Text style={{ fontSize: 13, color: "#555" }}>
            Tap to view details
          </Text>
        </View>
        <Icon name="chevron-right" size={26} color="#aaa" />
      </TouchableOpacity>

      {/* Card #3 */}
      <TouchableOpacity
        style={{
          backgroundColor: "#e3f0fd",
          borderRadius: 18,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.09,
          shadowRadius: 5,
          elevation: 4
        }}
        onPress={() => navigation.navigate("UpcomingRenewal")}
      >
        <Icon name="autorenew" size={36} color="#4092ff" style={{ marginRight: 20 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Upcoming Renewal Policy</Text>
          <Text style={{ fontSize: 13, color: "#555" }}>
            Tap to view details
          </Text>
        </View>
        <Icon name="chevron-right" size={26} color="#aaa" />
      </TouchableOpacity>

      {/* Card #4 */}
      <TouchableOpacity
        style={{
          backgroundColor: "#e3f0fd",
          borderRadius: 18,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.09,
          shadowRadius: 5,
          elevation: 4
        }}
        onPress={() => navigation.navigate("NewPolicy")}
      >
        <Icon name="add-circle-outline" size={36} color="#4092ff" style={{ marginRight: 20 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Add New Policy</Text>
          <Text style={{ fontSize: 13, color: "#555" }}>
            Tap to add the details
          </Text>
        </View>
        <Icon name="chevron-right" size={26} color="#aaa" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}