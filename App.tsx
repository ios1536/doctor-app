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
import { Alert } from 'react-native';

const App = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);

  useEffect(() => {
    checkPrivacyAgreement();
  }, []);

  const checkPrivacyAgreement = async () => {
    try {
      const privacyAgreed = await AsyncStorage.getItem('privacyAgreed');
      if (privacyAgreed === 'true') {
        // 用户已同意隐私政策，初始化SDK
        initializeSDK();
        setIsPrivacyAgreed(true);
      } else {
        // 用户未同意隐私政策，显示弹窗
        setShowPrivacyModal(true);
      }
    } catch (error) {
      console.error('检查隐私协议状态失败:', error);
      // 出错时也显示隐私弹窗
      setShowPrivacyModal(true);
    }
  };

  const initializeSDK = () => {
    // try {
    //   // 初始化友盟SDK
    //   AnalyticsUtil.init();
    //   console.log('友盟SDK初始化成功');
    // } catch (error) {
    //   console.error('友盟SDK初始化失败:', error);
    // }
  };

  const handlePrivacyAgree = async () => {
    try {
      await AsyncStorage.setItem('privacyAgreed', 'true');
      setShowPrivacyModal(false);
      setIsPrivacyAgreed(true);
      // 用户同意后初始化SDK
      initializeSDK();
    } catch (error) {
      console.error('保存隐私协议状态失败:', error);
    }
  };

  const handlePrivacyDisagree = () => {
    Alert.alert(
      '提示',
      '您需要同意用户协议和隐私政策才能使用本应用',
      [
        {
          text: '退出应用',
          onPress: () => {
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
