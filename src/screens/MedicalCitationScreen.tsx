import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MedicalCitationScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>医疗信息引用</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 重要声明 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ 重要声明</Text>
          <Text style={styles.disclaimerText}>
            本应用提供的所有医疗健康信息仅供参考，不能替代专业医生的诊断、治疗或医疗建议。如果您有健康问题或疑虑，请及时咨询专业医生。
          </Text>
        </View>

        {/* 信息来源 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 信息来源</Text>
          <Text style={styles.contentText}>
            本应用中的医疗健康信息来源于：
          </Text>
          <View style={styles.sourceList}>
            <Text style={styles.sourceItem}>• 权威医疗机构发布的健康指南</Text>
            <Text style={styles.sourceItem}>• 专业医生撰写的健康科普文章</Text>
            <Text style={styles.sourceItem}>• 经过验证的医学研究资料</Text>
            <Text style={styles.sourceItem}>• 国家卫生健康委员会发布的信息</Text>
          </View>
        </View>

        {/* 引用标准 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 引用标准</Text>
          <Text style={styles.contentText}>
            为确保信息的准确性和可靠性，我们遵循以下标准：
          </Text>
          <View style={styles.standardList}>
            <Text style={styles.standardItem}>• 优先采用权威医疗机构发布的信息</Text>
            <Text style={styles.standardItem}>• 所有医疗建议都有明确的来源标注</Text>
            <Text style={styles.standardItem}>• 定期更新和验证信息内容</Text>
            <Text style={styles.standardItem}>• 标注信息发布的时间和来源</Text>
          </View>
        </View>

        {/* 免责声明 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 免责声明</Text>
          <Text style={styles.contentText}>
            使用本应用时，请注意：
          </Text>
          <View style={styles.disclaimerList}>
            <Text style={styles.disclaimerItem}>• 本应用不提供医疗诊断服务</Text>
            <Text style={styles.disclaimerItem}>• 信息仅供参考，不能替代专业医疗建议</Text>
            <Text style={styles.disclaimerItem}>• 如有紧急情况，请立即就医</Text>
            <Text style={styles.disclaimerItem}>• 我们不对因使用信息而产生的后果承担责任</Text>
          </View>
        </View>

        {/* 官方备案信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>官方备案信息</Text>
          <View style={styles.citationItem}>
            <Text style={styles.citationLabel}>企业名称：</Text>
            <Text style={styles.citationText}>北京复禾健康科技有限公司</Text>
          </View>
          <View style={styles.citationItem}>
            <Text style={styles.citationLabel}>备案编号：</Text>
            <Text style={styles.citationText}>(京)网药械信息备字（2024）第00306号</Text>
          </View>
          <View style={styles.citationItem}>
            <Text style={styles.citationLabel}>备案机关：</Text>
            <Text style={styles.citationText}>北京市药品监督管理局</Text>
          </View>
          <View style={styles.citationItem}>
            <Text style={styles.citationLabel}>备案日期：</Text>
            <Text style={styles.citationText}>2024-07-11</Text>
          </View>
          <View style={styles.citationItem}>
            <Text style={styles.citationLabel}>官方查询：</Text>
            <Text style={styles.citationText}>北京市药品监督管理局官方网站</Text>
          </View>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => {
              const officialUrl = 'https://xxcx.yjj.beijing.gov.cn/eportal/ui?pageId=783953&exampleId=f7d9e33a41e64e09be5f490e86a0c9a4';
              Linking.canOpenURL(officialUrl).then(supported => {
                if (supported) {
                  Linking.openURL(officialUrl);
                } else {
                  Alert.alert('提示', '无法打开链接，请检查网络连接');
                }
              }).catch(err => {
                Alert.alert('错误', '打开链接失败');
              });
            }}
          >
            <Text style={styles.linkText}>查看官方备案信息</Text>
          </TouchableOpacity>
        </View>

        {/* 联系方式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 联系我们</Text>
          <Text style={styles.contentText}>
            如果您对本应用中的医疗信息有任何疑问或建议，请联系我们：
          </Text>
          <Text style={styles.contactText}>
            邮箱：suggest@fh21.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 15 : 15,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#E65100',
    lineHeight: 20,
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  sourceList: {
    marginLeft: 10,
  },
  sourceItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
  standardList: {
    marginLeft: 10,
  },
  standardItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
  disclaimerList: {
    marginLeft: 10,
  },
  disclaimerItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
  contactText: {
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 20,
    marginTop: 5,
  },
  citationItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  citationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    width: 100,
  },
  citationText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  linkButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MedicalCitationScreen; 