import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sendVerificationCode = async () => {
    if (!phone) {
      Alert.alert('提示', '请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    setIsSendingCode(true);

    try {
      const response = await fetch('https://bhapp.bohe.cn/article_api/user/sendcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
        }),
      });

      const data = await response.json();

      if (data.errno === 0) {
        Alert.alert('成功', '验证码已发送');
        // 开始倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        Alert.alert('发送失败', data.message || '验证码发送失败，请重试');
      }
    } catch (error) {
      Alert.alert('网络错误', '请检查网络连接');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleLogin = async () => {
    if (!phone) {
      Alert.alert('提示', '请输入手机号');
      return;
    }

    if (!verificationCode) {
      Alert.alert('提示', '请输入验证码');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    if (!/^\d{4}$/.test(verificationCode)) {
      Alert.alert('提示', '请输入4位验证码');
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('=== 发送登录请求 ===');
      console.log('手机号:', phone);
      console.log('验证码:', verificationCode);
      console.log('请求URL:', 'https://bhapp.bohe.cn/article_api/user/login');
      
      const response = await fetch('https://bhapp.bohe.cn/article_api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          code: verificationCode,
        }),
      });

      console.log('HTTP状态码:', response.status);
      console.log('响应头:', response.headers);
      
      const data = await response.json();

      console.log('=== 登录响应数据 ===');
      console.log('完整响应:', JSON.stringify(data, null, 2));
      console.log('响应状态码:', data.code);
      console.log('响应消息:', data.message);
      console.log('用户数据:', data.data);
      console.log('==================');
      
      if (data.errno === 0) {
        // 登录成功
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('userToken', data.data?.token || '');
        await AsyncStorage.setItem('userPhone', phone);
        // 返回到上一个页面（ProfileScreen）
        navigation.goBack();
      } else {
        Alert.alert('登录失败', data.message || '验证码错误或已过期');
      }
    } catch (error) {
      Alert.alert('网络错误', '请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>手机号</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入手机号"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>验证码</Text>
            <View style={styles.verificationContainer}>
              <TextInput
                style={styles.verificationInput}
                placeholder="请输入验证码"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity 
                style={[
                  styles.sendCodeButton, 
                  (countdown > 0 || isSendingCode) && styles.sendCodeButtonDisabled
                ]} 
                onPress={sendVerificationCode}
                disabled={countdown > 0 || isSendingCode}
              >
                {isSendingCode ? (
                  <ActivityIndicator size="small" color="#007AFF" />
                ) : (
                  <Text style={[
                    styles.sendCodeText,
                    (countdown > 0 || isSendingCode) && styles.sendCodeTextDisabled
                  ]}>
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>登录</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  form: {
    flex: 1,
    paddingHorizontal: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    marginRight: 12,
  },
  sendCodeButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  sendCodeButtonDisabled: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
  },
  sendCodeText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  sendCodeTextDisabled: {
    color: '#999999',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen; 