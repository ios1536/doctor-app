import React, { useState, useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainerRef } from '@react-navigation/native';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import WebViewScreen from '../screens/WebViewScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import HealthTalksScreen from '../screens/HealthTalksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DiseaseSelectionScreen from '../screens/DiseaseSelectionScreen';
import MedicalCitationScreen from '../screens/MedicalCitationScreen';
import { Linking } from 'react-native';
import { Alert } from 'react-native';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined; // This will be the Tab Navigator
  WebView: { title: string; url: string };
  DiseaseSelection: undefined;
  MedicalCitation: undefined;
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

interface AppNavigatorProps {
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>;
  isPrivacyAgreed?: boolean;
}

const AppNavigator = ({ navigationRef, isPrivacyAgreed = true }: AppNavigatorProps) => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

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
    const handleUrl = (url: string) => {
      console.log('收到深度链接:', url);
      
      try {
        // 解析URL
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const searchParams = urlObj.searchParams;
        
        console.log('解析的URL信息:');
        console.log('完整URL:', url);
        console.log('协议:', urlObj.protocol);
        console.log('主机:', urlObj.host);
        console.log('路径:', path);
        console.log('查询参数:', Object.fromEntries(searchParams.entries()));
        console.log('query参数值:', searchParams.get('query'));
        
        // 检查条件
        console.log('协议检查:', urlObj.protocol === 'bohe:');
        console.log('路径检查:', path === '/open' || path === 'open' || path.includes('open'));
        console.log('条件结果:', urlObj.protocol === 'bohe:' && (path === '/open' || path === 'open' || path.includes('open')));
        
        // 处理 bohe://open?query=url 格式的链接
        if (urlObj.protocol === 'bohe:' && (path === '/open' || path === 'open' || path.includes('open'))) {
          // 获取query参数中的url（需要解码）
          const queryUrl = searchParams.get('query');
          
          if (queryUrl) {
            // 解码URL
            const decodedUrl = decodeURIComponent(queryUrl);
            console.log('原始query参数:', queryUrl);
            console.log('解码后的URL:', decodedUrl);
            
            // 确保navigation已经准备好
            if (navigationRef.current) {
              // 先导航到Main页面（如果不在的话）
              navigationRef.current.navigate('Main');
              
              // 然后跳转到WebView
              setTimeout(() => {
                navigationRef.current?.navigate('WebView', {
                  url: decodedUrl,
                  title: '网页'
                });
              }, 100);
            } else {
              console.log('Navigation ref 还未准备好');
              Alert.alert('提示', '应用正在加载中，请稍后再试');
            }
          } else {
            console.log('未找到query参数');
            Alert.alert('提示', '链接格式不正确，缺少query参数');
          }
        }
        // 处理 https://domain/open?url=targetUrl 格式的链接
        else if (path.startsWith('/open')) {
          // 获取目标URL参数
          const targetUrl = searchParams.get('url');
          const title = searchParams.get('title') || '网页';
          
          if (targetUrl) {
            console.log('跳转到WebView:', targetUrl);
            
            // 确保navigation已经准备好
            if (navigationRef.current) {
              // 先导航到Main页面（如果不在的话）
              navigationRef.current.navigate('Main');
              
              // 然后跳转到WebView
              setTimeout(() => {
                navigationRef.current?.navigate('WebView', {
                  url: targetUrl,
                  title: title
                });
              }, 100);
            } else {
              console.log('Navigation ref 还未准备好');
              Alert.alert('提示', '应用正在加载中，请稍后再试');
            }
          } else {
            console.log('未找到目标URL参数');
            Alert.alert('提示', '链接格式不正确，缺少目标URL参数');
          }
        } else {
          // 备用检查：直接检查URL字符串
          if (url.includes('bohe://open') && url.includes('query=')) {
            console.log('使用备用方法解析URL');
            const queryIndex = url.indexOf('query=');
            const queryValue = url.substring(queryIndex + 6); // 'query=' 长度为6
            const decodedUrl = decodeURIComponent(queryValue);
            console.log('备用方法解码后的URL:', decodedUrl);
            
            // 确保navigation已经准备好
            if (navigationRef.current) {
              // 先导航到Main页面（如果不在的话）
              navigationRef.current.navigate('Main');
              
              // 然后跳转到WebView
              setTimeout(() => {
                navigationRef.current?.navigate('WebView', {
                  url: decodedUrl,
                  title: '网页'
                });
              }, 100);
            } else {
              console.log('Navigation ref 还未准备好');
              Alert.alert('提示', '应用正在加载中，请稍后再试');
            }
          } else {
            console.log('未知的路径:', path);
            console.log('协议:', urlObj.protocol);
            console.log('完整URL:', url);
            Alert.alert('提示', `不支持的链接格式: ${url}`);
          }
        }
      } catch (error: any) {
        console.error('解析URL失败:', error);
        Alert.alert('错误', '无法解析链接');
      }
    };

    // 处理应用启动时的深度链接
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('应用启动时的深度链接:', url);
        handleUrl(url);
      }
    });

    // 监听深度链接事件
    const sub = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => sub.remove();
  }, []);

  if (initialRoute === null || !isPrivacyAgreed) {
    return null; // 等待隐私政策同意或加载中
  }

  return (
    <Stack.Navigator 
      initialRouteName={initialRoute || 'Main'} 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="DiseaseSelection" component={DiseaseSelectionScreen} />
      <Stack.Screen name="MedicalCitation" component={MedicalCitationScreen} />
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