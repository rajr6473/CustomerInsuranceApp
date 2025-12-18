// src/screens/Common/JS/SettingsScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingsScreen({navigation}) {
  const {user, signOut} = useAuth();
  const displayName = user?.username || 'Customer';

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileSubtitle}>Insurance Book</Text>
        </View>
      </View>

      {/* Settings list */}
      <View style={styles.section}>
        <SettingsItem
          label="Info"
          subtitle="View your profile info"
          color="#e5e7eb"
          icon="information-outline"
          onPress={() => navigation.navigate('Info')}
        />

        <SettingsItem
          label="Change Password"
          subtitle="Update your login password"
          color="#facc15"
          icon="lock-reset"
          onPress={() => navigation.navigate('ChangePassword')}
        />

        <SettingsItem
          label="Terms & Conditions"
          subtitle="View app terms and conditions"
          color="#f97316"
          icon="file-document-outline"
          onPress={() => navigation.navigate('Terms')}
        />

        <SettingsItem
          label="Contact Us"
          subtitle="For enquiry and support"
          color="#06b6d4"
          icon="phone-in-talk-outline"
          onPress={() => navigation.navigate('ContactUs')}
        />

        <SettingsItem
          label="Helpdesk"
          subtitle="For queries and feedback"
          color="#22c55e"
          icon="lifebuoy"
          onPress={() => navigation.navigate('HelpDesk')}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="logout" size={18} color="#fff" />
          <Text style={styles.logoutText}>  Logout</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function SettingsItem({label, subtitle, color, icon, onPress}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.placeholderIcon, {backgroundColor: color}]}>
        <Icon name={icon} size={18} color="#fff" />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.cardTitle}>{label}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileSubtitle: {
    fontSize: 13,
    color: '#dcfce7',
    marginTop: 2,
  },
  section: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  placeholderIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
  },
  logoutText: {
    fontWeight: '700',
    color: '#ffffff',
    fontSize: 15,
  },
});
