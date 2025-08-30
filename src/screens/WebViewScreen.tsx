import React from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';

const WebViewScreen = ({ route }: any) => {
  const { url } = route.params;
  
  // 使用 useFocusEffect 来管理状态栏样式
  useFocusEffect(
    React.useCallback(() => {
      // 当页面获得焦点时，设置状态栏样式
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#ffffff');
    }, [])
  );
  
  // 添加platform参数到URL
  const getUrlWithPlatform = (originalUrl: string) => {
    const platform = Platform.OS; // 'ios' 或 'android'
    const separator = originalUrl.includes('?') ? '&' : '?';
    const urlWithPlatform = `${originalUrl}${separator}platform=${platform}`;
    console.log('🌐 WebView URL:', urlWithPlatform);
    console.log('📱 平台:', platform);
    return urlWithPlatform;
  };

  const renderLoading = () => (
    <ActivityIndicator
      color="#007AFF"
      size="large"
      style={styles.loading}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      <WebView
        source={{ uri: getUrlWithPlatform(url) }}
        startInLoadingState={true}
        renderLoading={renderLoading}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen; 