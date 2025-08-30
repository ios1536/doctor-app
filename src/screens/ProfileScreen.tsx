import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PersonalizedRecommendationSwitch from '../components/PersonalizedRecommendationSwitch';

const ProfileScreen = ({ navigation }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 监听页面焦点变化，当页面重新获得焦点时检查登录状态
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkLoginStatus();
    });

    return unsubscribe;
  }, [navigation]);

  // 使用 useFocusEffect 来管理状态栏样式
  useFocusEffect(
    React.useCallback(() => {
      // 当页面获得焦点时，设置状态栏样式
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('#1E90FF');
      
      return () => {
        // 当页面失去焦点时，恢复默认状态栏样式
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('#ffffff');
      };
    }, [])
  );

  const checkLoginStatus = async () => {
    try {
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      const phone = await AsyncStorage.getItem('userPhone');
      setIsLoggedIn(loginStatus === 'true');
      setUserPhone(phone || '');
    } catch (error) {
      console.error('检查登录状态失败:', error);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleNavigation = (screen: string) => {
    // In a real app, you would navigate to the corresponding screen
    // For now, we'll just log it or show an alert
    console.log(`Navigating to ${screen}`);
    
    let url = 'https://www.pumch.cn/';
    if (screen === '隐私政策') {
      url = 'https://bhapp.bohe.cn/article_api/app/privacy';
    } else if (screen === '服务协议') {
      url = 'https://bhapp.bohe.cn/article_api/app/server';
    }
    
    navigation.navigate('WebView', { url, title: screen });
  };

  const handleLogout = async () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            try {
              // 获取存储的用户信息
              const userPhone = await AsyncStorage.getItem('userPhone');
              const userToken = await AsyncStorage.getItem('userToken');
              
              console.log('=== 退出登录请求 ===');
              console.log('手机号:', userPhone);
              console.log('Token:', userToken);
              
              // 调用退出登录接口
              const response = await fetch('https://bhapp.bohe.cn/article_api/user/loginout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  phone: userPhone,
                  token: userToken,
                }),
              });

              const data = await response.json();
              
              console.log('=== 退出登录响应 ===');
              console.log('完整响应:', JSON.stringify(data, null, 2));
              console.log('响应状态码:', data.code);
              console.log('响应消息:', data.message);
              
              if (data.errno === 0) {
                // 清除登录状态
                await AsyncStorage.removeItem('isLoggedIn');
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userPhone');
                console.log('用户退出登录成功');
                
                // 刷新登录状态，显示未登录界面
                checkLoginStatus();
              } else {
                Alert.alert('退出失败', data.message || '退出登录失败，请重试');
              }
            } catch (error) {
              console.error('退出登录失败:', error);
              Alert.alert('网络错误', '请检查网络连接');
            }
          },
        },
      ]
    );
  };

  const legalItems = [
    { title: '隐私政策' },
    { title: '服务协议' },
  ];

  const handleDeleteAccount = async () => {
    Alert.alert(
      '注销账号',
      '确定要注销账号吗？此操作不可恢复，所有数据将被永久删除。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定注销',
          style: 'destructive',
          onPress: async () => {
            try {
              // 获取存储的用户信息
              const userPhone = await AsyncStorage.getItem('userPhone');
              const userToken = await AsyncStorage.getItem('userToken');
              
              console.log('=== 注销账号请求 ===');
              console.log('手机号:', userPhone);
              console.log('Token:', userToken);
              console.log('Token长度:', userToken?.length);
              console.log('Token是否为空:', !userToken);
              
              // 调用注销账号接口
              console.log('=== 注销账号API调用 ===');
              console.log('请求URL:', 'https://bhapp.bohe.cn/article_api/user/del');
              console.log('请求方法:', 'POST');
              console.log('请求体:', JSON.stringify({
                phone: userPhone,
                token: userToken,
              }, null, 2));
              
              const response = await fetch('https://bhapp.bohe.cn/article_api/user/del', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  phone: userPhone,
                  token: userToken,
                }),
              });

              console.log('=== 注销账号HTTP响应 ===');
              console.log('HTTP状态码:', response.status);
              console.log('响应头:', response.headers);

              const data = await response.json();
              
              console.log('=== 注销账号响应 ===');
              console.log('完整响应:', JSON.stringify(data, null, 2));
              console.log('响应状态码:', data.code);
              console.log('响应消息:', data.message);
              
              if (data.errno === 0) {
                // 清除登录状态
                await AsyncStorage.removeItem('isLoggedIn');
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userPhone');
                console.log('账号注销成功');
                
                Alert.alert('注销成功', '您的账号已成功注销', [
                  {
                    text: '确定',
                    onPress: () => {
                      // 刷新登录状态，显示未登录界面
                      checkLoginStatus();
                    },
                  },
                ]);
              } else {
                Alert.alert('注销失败', data.message || '注销账号失败，请重试');
              }
            } catch (error) {
              console.error('注销账号失败:', error);
              Alert.alert('网络错误', '请检查网络连接');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Icon name="account-circle" size={60} color="#E0E0E0" />
            </View>
            <View style={styles.userTextContainer}>
              {isLoggedIn ? (
                <Text style={styles.userName}>{userPhone ? userPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '用户'}</Text>
              ) : (
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.userName}>未登录</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.mainContent}>
          {/* 隐私政策和服务协议 */}
          <View style={styles.sectionCard}>
            {legalItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.menuItem, 
                  index === legalItems.length - 1 && styles.lastMenuItem
                ]} 
                onPress={() => handleNavigation(item.title)}
              >
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 个性化推荐设置 */}
          <View style={styles.sectionCard}>
            <PersonalizedRecommendationSwitch 
              onToggle={(enabled) => {
                console.log('个性化推荐开关状态:', enabled);
              }}
            />
          </View>

          {/* 医疗信息引用 */}
          <View style={styles.sectionCard}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigation.navigate('MedicalCitation')}
            >
              <Text style={styles.menuItemText}>医疗信息引用</Text>
              <Icon name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>

          {isLoggedIn ? (
            <>
              {/* 注销账号 */}
              <View style={styles.sectionCard}>
                <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
                  <Text style={styles.menuItemText}>注销账号</Text>
                </TouchableOpacity>
              </View>

              {/* 退出登录 */}
              <View style={styles.sectionCard}>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                  <Text style={styles.logoutText}>退出登录</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E90FF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E90FF',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 15,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContent: {
      padding: 15,
  },
  sectionCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
  },
  menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Added to align icon to the right
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
  },
  lastMenuItem: {
      borderBottomWidth: 0,
  },
  menuItemText: {
      flex: 1,
      marginLeft: 15,
      fontSize: 16,
      color: '#333',
  },
  logoutText: {
      flex: 1,
      marginLeft: 15,
      fontSize: 16,
      color: '#FF6B6B',
      fontWeight: '500',
  },
});

export default ProfileScreen; 