import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // adjust relative path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 


export default function UserDashboard({ navigation }){
const [data, setData] = useState(null);
const { user, getToken } = useAuth();
console.log('UserDashboard rendered with user:', user);

// useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const token = await getToken();
//         const res = await api.getUserDashboard(token);
//         setData(res);
//       } catch (e) {
//         console.warn('[DEBUG] getUserDashboard error', e);
//       }
//     };
//     fetchDashboard();
//   }, [getToken]);

const displayName = user?.full_name || 'Customer';


// Helper for displaying counts safely
const getCount = (items) => (items && items.length) || 0;

return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeLabel}>Welcome back,</Text>
            <Text style={styles.welcomeName}>{displayName}</Text>
            <Text style={styles.welcomeSub}>Here is a quick overview of your insurance.</Text>
          </View>
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
      </ScrollView>  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },
  welcomeCard: {
    backgroundColor: '#0ea5e9',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  welcomeLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginBottom: 2,
  },
  welcomeName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },

  // keep your existing card styles below...
});
