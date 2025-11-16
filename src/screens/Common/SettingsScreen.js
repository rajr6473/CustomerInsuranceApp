import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext'; // adjust relative path as needed

// import Icon from 'react-native-vector-icons/MaterialIcons'; // Uncomment if using vector icons

export default function SettingsScreen({ navigation }){
const auth = useAuth();

return (
    <SafeAreaView style={{flex:1, backgroundColor:'#f7f7f7'}}>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        {/* <Icon name="person" size={40} color="#4Bab3a" style={styles.profileIcon} /> */}
        {/* <View style={styles.profileIcon}/> */}
        {
            <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>🧑‍💼</Text>
            </View>
        }
        <Text style={styles.profileName}>Customer Name</Text>
        {/* Add below line for subtitle if required */}
        {/* <Text style={styles.profileSubtitle}>Agent</Text> */}
      </View>

      {/* Card Settings Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Info')}>
          {/* <Icon name="info" size={24} color="#4Bab3a" style={styles.cardIcon} /> */}
          <View style={styles.placeholderIcon}/>
          <View>
            <Text style={styles.cardTitle}>Info</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ChangePassword')}>
          {/* <Icon name="lock" size={24} color="#ffb300" style={styles.cardIcon} /> */}
          <View style={[styles.placeholderIcon, {backgroundColor:'#ffb300'}]}/>
          <View>
            <Text style={styles.cardTitle}>Change Password</Text>
            <Text style={styles.cardSubtitle}>Update your login password</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Terms')}>
          {/* <Icon name="description" size={24} color="#a98241" style={styles.cardIcon} /> */}
          <View style={[styles.placeholderIcon, {backgroundColor:'#a98241'}]}/>
          <View>
            <Text style={styles.cardTitle}>Terms & Condition</Text>
            <Text style={styles.cardSubtitle}>View app terms and conditions</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ContactUs')}>
          {/* <Icon name="support-agent" size={24} color="#43b0c4" style={styles.cardIcon} /> */}
          <View style={[styles.placeholderIcon, {backgroundColor:'#43b0c4'}]}/>
          <View>
            <Text style={styles.cardTitle}>Contact Us</Text>
            <Text style={styles.cardSubtitle}>For enquiry and support</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('HelpDesk')}>
          {/* <Icon name="support-agent" size={24} color="#43b0c4" style={styles.cardIcon} /> */}
          <View style={[styles.placeholderIcon, {backgroundColor:'#43b0c4'}]}/>
          <View>
            <Text style={styles.cardTitle}>Helpdesk</Text>
            <Text style={styles.cardSubtitle}>For quiries and feedback</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Button at the Bottom */}
      <TouchableOpacity style={styles.logoutButton} onPress={auth.signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: '#4Bab3a', // green
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 24,
  },
  profileIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#b3e6b2', marginBottom: 8,
  },
  profileName: {
    fontSize: 20, color: '#fff', fontWeight: '700',
  },
  profileSubtitle: {
    fontSize: 14, color: '#e5e5e5'
  },
  section: {
    paddingHorizontal: 16,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 1 }, // iOS
    shadowOpacity: 0.1, // iOS
    shadowRadius: 1.5, // iOS
  },
  cardIcon: {
    marginRight: 16,
  },
  placeholderIcon: {
    width: 32, height: 32, borderRadius: 8, marginRight: 16, backgroundColor: "#ddd",
  },
  cardTitle: {
    fontWeight: '700', fontSize: 16, color: '#222'
  },
  cardSubtitle: {
    fontSize: 13, color: '#888'
  },
  logoutButton: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#ff3c32',
    alignItems: 'center',
    padding: 16,
  },
  logoutText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 16
  }
});