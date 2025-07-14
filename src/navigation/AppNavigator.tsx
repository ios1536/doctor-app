import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import WebViewScreen from '../screens/WebViewScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import HealthTalksScreen from '../screens/HealthTalksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DiseaseSelectionScreen from '../screens/DiseaseSelectionScreen';
import { Linking } from 'react-native';
import { Alert } from 'react-native';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined; // This will be the Tab Navigator
  WebView: { title: string; url: string };
  DiseaseSelection: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Doctors: undefined;
  HealthTalks: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Doctors') {
            iconName = focused ? 'doctor' : 'doctor';
          } else if (route.name === 'HealthTalks') {
            iconName = focused ? 'message-text' : 'message-text-outline';
          } else { // Profile
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
      <Tab.Screen 
        name="Doctors" 
        component={DoctorsScreen} 
        options={{ 
          title: '名医',
        }} 
      />
      <Tab.Screen name="HealthTalks" component={HealthTalksScreen} options={{ title: '医说' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
        if (alreadyLaunched === null) {
          AsyncStorage.setItem('alreadyLaunched', 'true');
          setInitialRoute('Onboarding');
        } else {
          // 直接进入首页，不需要登录
          setInitialRoute('Main');
        }
      } catch (e) {
        setInitialRoute('Main'); // Default to main on error
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
  const handleDeepLink = (event: { url: string }) => {
    const url = event.url;
    // 处理 URL，例如跳转到某个页面
    Alert.alert('App opened with URL:', url);
  };

  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink({ url });
  });

  const listener = Linking.addEventListener('url', handleDeepLink);

  return () => {
    listener.remove();
  };
}, []);

  if (initialRoute === null) {
    return null; // or a loading screen
  }

  return (
    <Stack.Navigator 
      initialRouteName={initialRoute} 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="DiseaseSelection" component={DiseaseSelectionScreen} />
      <Stack.Screen
        name="WebView"
        component={WebViewScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 