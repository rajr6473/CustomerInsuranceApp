import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext'; // adjust relative path as needed


// Example API function - replace with your actual API endpoints.
// const fetchDashboardData = async () => {
//   // Replace these URLs and data keys as per your backend.
//   const dashboardRes = await fetch("https://yourapi.com/dashboard"); // Returns { agentName, commission }
//   const dashData = await dashboardRes.json();

//   const customersRes = await fetch("https://yourapi.com/customers"); // Returns { count }
//   const customersData = await customersRes.json();

//   const policiesRes = await fetch("https://yourapi.com/policies"); // Returns { count }
//   const policiesData = await policiesRes.json();

//   return {
//     agentName: dashData.agentName,
//     commission: dashData.commission,
//     customerCount: customersData.count,
//     policyCount: policiesData.count,
//   };
// };

export default function AgentDashboard({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy / placeholder data
  // const [data] = useState({
  //   agentName: "Agent name",
  //   commission: 15000,
  //   customerCount: 12,
  //   policyCount: 27,
  // });
  const auth = useAuth();
  useEffect(() => {
    console.log('[AgentDashboard] User:', auth.user);
    console.log('[AgentDashboard] Token:', auth.getToken());
    setData(auth.user)
    // (Optional: fetch dashboard data here)
  }, []);

  // useEffect(() => {
  //   fetchDashboardData()
  //     .then(res => {
  //       setData(res);
  //       setLoading(false);
  //     })
  //     .catch(() => setLoading(false));
  // }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#367cff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dashboardTitle}>Agent Dashboard</Text>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.agentName}>{data.full_name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate("AddCustomer")}>
            <Icon name="person-add" size={28} color="#22b07d" />
            <Text style={styles.quickActionText}>Add Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate("AddPolicy")}>
            <Icon name="note-add" size={28} color="#429af7" />
            <Text style={styles.quickActionText}>Add Policy</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics Overview</Text>
        <View style={styles.statisticsRow}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("AllCustomers")}>
            <Icon name="group" size={28} color="#3a7efd" />
            <Text style={styles.statLabel}>All Customers</Text>
            <Text style={styles.statValue}>{data.customerCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("AllPolicies")}>
            <Icon name="description" size={28} color="#22b07d" />
            <Text style={styles.statLabel}>All Policies</Text>
            <Text style={styles.statValue}>{data.policyCount}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statisticsRow}>
          <View style={styles.statCard}>
            <Icon name="monetization-on" size={28} color="#fdbb21" />
            <Text style={styles.statLabel}>Commission Earned</Text>
            <Text style={styles.statValue}>₹{data.commission}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fc" },
  header: {
    padding: 18, backgroundColor: "#367cff", borderBottomLeftRadius: 20, borderBottomRightRadius: 20
  },
  dashboardTitle: {
    color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 8
  },
  welcome: { color: "#fff", fontSize: 13, marginBottom: 2 },
  agentName: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#393e46", marginBottom: 8 },
  quickActionsContainer: {
    flexDirection: "row", justifyContent: "space-between"
  },
  quickAction: {
    width: "48%", backgroundColor: "#fff", borderRadius: 12, padding: 20, alignItems: "center", marginBottom: 8, elevation: 2
  },
  quickActionText: { marginTop: 8, color: "#393e46", fontWeight: "600", fontSize: 15 },
  statisticsRow: {
    flexDirection: "row", justifyContent: "space-between", marginBottom: 10
  },
  statCard: {
    width: "48%", backgroundColor: "#fff", borderRadius: 12, padding: 18, alignItems: "center", elevation: 2
  },
  statLabel: { color: "#393e46", fontSize: 14, marginTop: 5 },
  statValue: {
    fontSize: 22, fontWeight: "bold", color: "#367cff", marginTop: 8
  }
});