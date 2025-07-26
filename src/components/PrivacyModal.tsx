import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface PrivacyModalProps {
  visible: boolean;
  onAgree: () => void;
  onDisagree: () => void;
  navigation?: any;
}

const { width: screenWidth } = Dimensions.get('window');

const PrivacyModal: React.FC<PrivacyModalProps> = ({ visible, onAgree, onDisagree, navigation }) => {
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [webViewTitle, setWebViewTitle] = useState('');

  const handleUserAgreement = () => {
    // 打开用户协议页面
    setWebViewUrl('https://bhapp.bohe.cn/article_api/app/server');
    setWebViewTitle('用户协议');
    setShowWebView(true);
  };

  const handlePrivacyPolicy = () => {
    // 打开隐私政策页面
    setWebViewUrl('https://bhapp.bohe.cn/article_api/app/privacy');
    setWebViewTitle('隐私协议');
    setShowWebView(true);
  };

  const handleCloseWebView = () => {
    setShowWebView(false);
    setWebViewUrl('');
    setWebViewTitle('');
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>用户协议和隐私政策</Text>
            
            <Text style={styles.content}>
              请你务必审慎阅读、充分理解"用户协议"和"隐私政策"各条款，包括但不限于：为了更好的向你提供服务，我们需要收集你的设备标识、操作日志等信息用于分析、优化应用性能。你可阅读
              <Text style={styles.link} onPress={handleUserAgreement}>
                《用户协议》
              </Text>
              和
              <Text style={styles.link} onPress={handlePrivacyPolicy}>
                《隐私政策》
              </Text>
              了解详细信息。如果你同意，请点击下面按钮开始接受我们的服务。
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.agreeButton} onPress={onAgree}>
                <Text style={styles.agreeButtonText}>同意并接受</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.disagreeButton} onPress={onDisagree}>
                <Text style={styles.disagreeButtonText}>不同意</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* WebView 弹框 */}
      <Modal
        visible={showWebView}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
      >
        <View style={styles.webViewOverlay}>
          <View style={styles.webViewContainer}>
            {/* 头部 */}
            <View style={styles.webViewHeader}>
              <TouchableOpacity onPress={handleCloseWebView} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>关闭</Text>
              </TouchableOpacity>
              <Text style={styles.webViewTitle}>{webViewTitle}</Text>
              <View style={styles.placeholder} />
            </View>
            
            {/* WebView 内容 */}
            <WebView
              source={{ uri: webViewUrl }}
              style={styles.webView}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    maxWidth: screenWidth - 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    textAlign: 'left',
    marginBottom: 20,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  agreeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  agreeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disagreeButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  disagreeButtonText: {
    color: '#666',
    fontSize: 16,
  },
  // WebView 弹框样式
  webViewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 100, // 从上方留出空间，实现从下往上弹出的效果
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 50, // 与关闭按钮宽度相同，保持标题居中
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default PrivacyModal; 