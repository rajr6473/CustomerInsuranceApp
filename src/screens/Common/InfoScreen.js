import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // adjust relative path as needed


export default function InfoScreen(){
const auth = useAuth();
const [profile, setProfile] = useState(null);
useEffect(()=>{ api.getProfile(auth.getToken()).then(r=>setProfile(r)).catch(()=>{}) },[]);


return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrap}>
        {profile?.image ? (
          <Image source={{ uri: profile.image }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>🧑‍💼</Text>
          </View>
        )}
        <Text style={styles.userName}>{profile?.name ?? 'User Name'}</Text>
        <Text style={styles.userSubtitle}>Welcome</Text>
      </View>

      <ScrollView style={styles.cardSection}>
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Basic Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{profile?.name ?? '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile?.email ?? '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile</Text>
            <Text style={styles.value}>{profile?.mobile ?? '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{profile?.gender ?? '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{profile?.age ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Birth Date</Text>
            <Text style={styles.value}>{profile?.dob ?? '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>{profile?.city ?? '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>State</Text>
            <Text style={styles.value}>{profile?.state ?? '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{profile?.address ?? '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>PAN</Text>
            <Text style={styles.value}>{profile?.pan ?? '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>GST</Text>
            <Text style={styles.value}>{profile?.gst ?? '-'}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f6f8fb'
  },
  headerWrap: {
    backgroundColor: '#b2dbfa', // Light blue
    alignItems: 'center',
    paddingVertical: 32,
    paddingTop: 40,
    marginBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarWrap: {
    backgroundColor: '#fff',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 3,
  },
  userSubtitle: {
    fontSize: 16,
    color: '#3186ce',
  },
  cardSection: {
    flex: 1,
    paddingHorizontal: 18,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#1e293b',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#346c92',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
  },
  label: {
    fontSize: 15,
    color: '#7b8794',
  },
  value: {
    fontSize: 15,
    color: '#22223b',
    fontWeight: '500',
  },
});