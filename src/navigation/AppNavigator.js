// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; // yarn add react-native-vector-icons
import { useAuth } from '../context/AuthContext';

// Auth
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
// User screens...
import UserDashboard from '../screens/User/UserDashboard';
import MyInsuranceScreen from '../screens/User/MyInsuranceScreen';
import UpcomingInstallmentScreen from '../screens/User/UpcomingInstallmentScreen';
import UpcomingRenewalScreen from '../screens/User/UpcomingRenewalScreen';
import NewPolicyScreen from '../screens/User/NewPolicyScreen';
// Agent screens...
import AgentDashboard from '../screens/Agent/AgentDashboard';
import AddCustomerScreen from '../screens/Agent/AddCustomerScreen';
import AddPolicyScreen from '../screens/Agent/AddPolicyScreen';
import AllCustomersScreen from '../screens/Agent/AllCustomersScreen';
import AllPoliciesScreen from '../screens/Agent/AllPoliciesScreen';
import AddPolicyForm from '../screens/Agent/Forms/AddPolicyForm';
import AddLeadForm from '../screens/Agent/Forms/AddLeadForm';
// Common
import SettingsScreen from '../screens/Common/SettingsScreen';
import NotificationsScreen from '../screens/Common/NotificationsScreen';
import InfoScreen from '../screens/Common/InfoScreen';
import ChangePasswordScreen from '../screens/Common/ChangePasswordScreen';
import TermsScreen from '../screens/Common/TermsScreen';
import ContactUsScreen from '../screens/Common/ContactUsScreen';
import HelpDeskScreen from '../screens/Common/HelpDeskScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// central place for colors so you can tweak branding easily
const PRIMARY = '#0D6EFD';
const INACTIVE = '#8e8e93';
const TAB_BG = '#ffffff';

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopWidth: 0.5,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardHome') {
            // policies / home
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else {
            iconName = 'ellipse'; // fallback
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="DashboardHome"
        component={UserDashboard}
        options={{ title: 'Policies' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Alerts' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function AgentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopWidth: 0.5,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'AgentHome') {
            // agent dashboard
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="AgentHome"
        component={AgentDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Alerts' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  if (user.role === 'agent' || user.role === 'sub_agent') {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="AgentMain"
          component={AgentTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
        <Stack.Screen name="AddPolicy" component={AddPolicyScreen} />
        <Stack.Screen name="AllCustomers" component={AllCustomersScreen} />
        <Stack.Screen name="AllPolicies" component={AllPoliciesScreen} />
        <Stack.Screen name="AddPolicyForm" component={AddPolicyForm} />
        <Stack.Screen name="AddLeadForm" component={AddLeadForm} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="HelpDesk" component={HelpDeskScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserMain"
        component={UserTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MyInsurance" component={MyInsuranceScreen} />
      <Stack.Screen
        name="UpcomingInstallment"
        component={UpcomingInstallmentScreen}
      />
      <Stack.Screen
        name="UpcomingRenewal"
        component={UpcomingRenewalScreen}
      />
      <Stack.Screen name="NewPolicy" component={NewPolicyScreen} />
      <Stack.Screen name="Info" component={InfoScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="HelpDesk" component={HelpDeskScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
