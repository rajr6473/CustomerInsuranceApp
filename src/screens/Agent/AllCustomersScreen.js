import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
// If you want clipboard functionality: import * as Clipboard from '@react-native-clipboard/clipboard';

export default function AllCustomersScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Toggle apiMode to true for API, false for dummy data
  const apiMode = false; // CHANGE TO TRUE to use API

  // Dummy customers list
  const dummyCustomers = [
    {
      name: "Customer name",
      role: "Agent: Self",
      status: "ACTIVE",
      mobile: "999999",
      id: "KR549218",
      password: "L6NRMR",
    },
    {
      name: "Customer name 2",
      role: "Agent: Self",
      status: "ACTIVE",
      mobile: "999999",
      id: "KR549218",
      password: "L6NRMR",
    },
    // Add more customer objects as needed
  ];

  useEffect(() => {
    if (apiMode) {
      setLoading(true);
      // Replace with your API endpoint
      fetch("https://yourapi.com/customers")
        .then(res => res.json())
        .then(data => {
          // Adjust mapping as per your API response structure
          setCustomers(data.customers);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setCustomers(dummyCustomers);
    }
  }, [apiMode]);

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>All Customers</Text>
      </View>
      <View style={styles.searchBox}>
        <Icon name="search" size={22} color="#878787" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search by customer name"
          style={{ flex: 1, fontSize: 16 }}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filtered.map((customer, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatar}><Text style={{ color: "#367cff", fontWeight: "bold" }}>{customer.name[0]}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.custName}>{customer.name}</Text>
              <Text style={styles.role}>{customer.role}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{customer.status}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Icon name="call" size={16} color="#393e46" />
            <Text style={styles.mobile}>{customer.mobile} <Text style={{ color: "#999" }}>Mobile</Text></Text>
          </View>
          <View style={styles.infoBlock}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <Icon name="badge" size={18} color="#367cff" />
              <Text style={{ marginLeft: 4 }}>ID: {customer.id}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  // Clipboard.setString(customer.id);
                }}
              >
                <Text style={{color:"#367cff", fontWeight: "bold"}}>Copy</Text>
              </TouchableOpacity>
            </View>
            <Text>Password: {customer.password}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f4f6fc", flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center",
    padding: 16, backgroundColor: "#367cff", borderBottomLeftRadius: 18, borderBottomRightRadius: 18
  },
  title: {
    color: "#fff", fontSize: 18, marginLeft: 12, fontWeight: "bold"
  },
  searchBox: {
    flexDirection: "row", backgroundColor: "#fff", margin: 16,
    borderRadius: 10, alignItems: "center", paddingHorizontal: 12, elevation: 1
  },
  card: {
    margin: 12, backgroundColor: "#fff", borderRadius: 13, padding: 16, elevation: 2
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: {
    backgroundColor: "#ddeafd", width: 40, height: 40, borderRadius: 20,
    justifyContent: "center", alignItems: "center", marginRight: 10
  },
  custName: { fontSize: 17, fontWeight: "bold", color: "#0575ff" },
  role: { fontSize: 12, color: "#555" },
  statusBadge: {
    backgroundColor: "#e3f9ec", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3, marginLeft: 5
  },
  statusText: { color: "#22b07d", fontWeight: "bold", fontSize: 12 },
  mobile: { marginLeft: 6, fontSize: 14, color: "#222" },
  infoBlock: {
    backgroundColor: "#f1f2f6", borderRadius: 8, padding: 10, marginBottom: 9, marginTop: 3
  },
  copyButton: {
    marginLeft: 18, backgroundColor: "#ddeafd", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5
  },
  buttonRow: {
    flexDirection: "row", justifyContent: "space-between", marginBottom: 6
  },
  whatsappBtn: {
    flex: 1, flexDirection: "row", backgroundColor: "#e8fbe6", borderRadius: 9,
    alignItems: "center", justifyContent: "center", marginRight: 10, padding: 10
  },
  callBtn: {
    flex: 1, flexDirection: "row", backgroundColor: "#ddeafd", borderRadius: 9,
    alignItems: "center", justifyContent: "center", padding: 10
  },
  deactivateBtn: {
    flex: 1, flexDirection: "row", backgroundColor: "#fff2e5", borderRadius: 9,
    alignItems: "center", justifyContent: "center", marginRight: 10, padding: 10
  },
  policyBtn: {
    flex: 1, flexDirection: "row", backgroundColor: "#ddeafd", borderRadius: 9,
    alignItems: "center", justifyContent: "center", padding: 10
  },
  btnText: { marginLeft: 7, fontWeight: "600", color: "#222" },
});