/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useRef, useEffect, useState } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { RootStackParamList } from './src/navigation/AppNavigator';
import { AnalyticsUtil, ShareUtil, UMWeb } from 'rn-umeng-module';
import PrivacyModal from './src/components/PrivacyModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import umInitModule from './src/types/UMInitModule';
import { testUMInitModule, testUMInitWithFullParams, checkUMInitModuleStatus } from './src/utils/umInitTest';

const App = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);

  useEffect(() => {
    checkPrivacyAgreement();
    
    // 将测试函数添加到全局对象，方便在DevTools中调用
    if (__DEV__) {
      (global as any).testUMInitModule = testUMInitModule;
      (global as any).testUMInitWithFullParams = testUMInitWithFullParams;
      (global as any).checkUMInitModuleStatus = checkUMInitModuleStatus;
      (global as any).umInitModule = umInitModule;
      
      console.log('🧪 测试函数已添加到全局对象:');
      console.log('   - testUMInitModule() - 测试默认初始化');
      console.log('   - testUMInitWithFullParams() - 测试完整参数初始化');
      console.log('   - checkUMInitModuleStatus() - 检查模块状态');
      console.log('   - umInitModule - 原生模块对象');
    }
  }, []);

  const checkPrivacyAgreement = async () => {
    try {
      const privacyAgreed = await AsyncStorage.getItem('privacyAgreed');
      console.log('🔍 检查隐私协议状态:', privacyAgreed);
      if (privacyAgreed === 'true') {
        // 用户已同意隐私政策，初始化SDK
        console.log('✅ 用户已同意隐私政策，开始初始化SDK');
        initializeSDK();
        initializeAdSDK();
        setIsPrivacyAgreed(true);
      } else {
        // 用户未同意隐私政策，显示弹窗
        console.log('📋 用户未同意隐私政策，显示隐私弹窗');
        setShowPrivacyModal(true);
      }
    } catch (error) {
      console.error('❌ 检查隐私协议状态失败:', error);
      // 出错时也显示隐私弹窗
      setShowPrivacyModal(true);
    }
  };

  // 初始化芒果广告SDK
  const initializeAdSDK = async () => {
    console.log('🚀 开始初始化芒果广告SDK...');
    console.log('📱 当前平台:', Platform.OS);
    try {
      if (Platform.OS === 'android') {
        // Android平台：使用原生模块初始化
        console.log('📱 Android平台：准备调用原生模块初始化芒果广告SDK');
        console.log('🔧 检查原生模块是否存在...');
        
        // 检查原生模块是否可用
        if (umInitModule && typeof umInitModule.initializeADSDK === 'function') {
          console.log('✅ 原生模块检查通过，开始调用...');
          
          const result = await umInitModule.initializeADSDK();
          console.log('✅ 原生模块初始化结果:', result);
          console.log('🎉 原生模块初始化成功！');
        } else {
          console.error('❌ 原生模块不可用或方法不存在');
          console.log('🔍 原生模块对象:', umInitModule);
          throw new Error('原生模块不可用');
        }
      } else {
        // iOS平台：使用JavaScript模块初始化
        console.log('📱 iOS平台：调用JavaScript模块初始化芒果广告SDK');
        //TODO 初始化芒果广告SDK
      }
      console.log('✅ 芒果广告SDK初始化成功');
      
    } catch (error: any) {
      console.error('❌ 芒果广告SDK初始化失败:', error);
      console.error('❌ 错误详情:', error.message);
      console.error('❌ 错误堆栈:', error.stack);
    }
  };



  const initializeSDK = async () => {
    console.log('🚀 开始初始化友盟SDK...');
    console.log('📱 当前平台:', Platform.OS);
    
    try {
      if (Platform.OS === 'android') {
        // Android平台：使用原生模块初始化
        console.log('📱 Android平台：准备调用原生模块初始化友盟SDK');
        console.log('🔧 检查原生模块是否存在...');
        
        // 检查原生模块是否可用
        if (umInitModule && typeof umInitModule.initUMWithDefault === 'function') {
          console.log('✅ 原生模块检查通过，开始调用...');
          console.log('📋 调用参数: appKey = 6880b713bc47b67d83bb56bc');
          
          const result = await umInitModule.initUMWithDefault('6880b713bc47b67d83bb56bc');
          console.log('✅ 原生模块初始化结果:', result);
          console.log('🎉 原生模块初始化成功！');
        } else {
          console.error('❌ 原生模块不可用或方法不存在');
          console.log('🔍 原生模块对象:', umInitModule);
          throw new Error('原生模块不可用');
        }
      } else {
        // iOS平台：使用JavaScript模块初始化
        console.log('📱 iOS平台：调用JavaScript模块初始化友盟SDK');
        console.log('📋 调用参数: deviceType = 1, appKey = 6880b713bc47b67d83bb56bc');
        
        AnalyticsUtil.init(1, '6880b713bc47b67d83bb56bc');
        console.log('✅ JavaScript模块初始化成功');
      }
      console.log('✅ 友盟SDK初始化成功');
      
    } catch (error: any) {
      console.error('❌ 友盟SDK初始化失败:', error);
      console.error('❌ 错误详情:', error.message);
      console.error('❌ 错误堆栈:', error.stack);
      
      // 如果原生模块初始化失败，尝试使用JavaScript模块作为备选方案
      if (Platform.OS === 'android') {
        try {
          console.log('🔄 尝试使用JavaScript模块作为备选方案...');
          console.log('📋 备选方案参数: deviceType = 1, appKey = 6880b713bc47b67d83bb56bc');
          
          AnalyticsUtil.init(1, '6880b713bc47b67d83bb56bc');
          console.log('✅ JavaScript模块备选方案初始化成功');
        } catch (fallbackError: any) {
          console.error('❌ 备选方案也失败了:', fallbackError);
          console.error('❌ 备选方案错误详情:', fallbackError.message);
        }
      }
    }
  };

  const handlePrivacyAgree = async () => {
    console.log('👤 用户点击了"同意并接受"按钮');
    try {
      await AsyncStorage.setItem('privacyAgreed', 'true');
      console.log('💾 已保存用户同意状态到本地存储');
      setShowPrivacyModal(false);
      setIsPrivacyAgreed(true);
      // 用户同意后初始化SDK
      console.log('🔄 准备初始化SDK...');
      await initializeSDK();
      await initializeAdSDK();
    } catch (error) {
      console.error('❌ 保存隐私协议状态失败:', error);
    }
  };

  const handlePrivacyDisagree = () => {
    console.log('👤 用户点击了"不同意"按钮');
    Alert.alert(
      '提示',
      '您需要同意用户协议和隐私政策才能使用本应用',
      [
        {
          text: '退出应用',
          onPress: () => {
            console.log('🚫 用户选择退出应用，不初始化SDK');
            // 在真实应用中，这里应该退出应用
            // 在开发环境中，我们只是隐藏弹窗
            setShowPrivacyModal(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator navigationRef={navigationRef} isPrivacyAgreed={isPrivacyAgreed} />
      </NavigationContainer>
      
      <PrivacyModal
        visible={showPrivacyModal}
        onAgree={handlePrivacyAgree}
        onDisagree={handlePrivacyDisagree}
        navigation={navigationRef.current}
      />
    </>
  );
};

export default App;
