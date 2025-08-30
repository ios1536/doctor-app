import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

const diseaseData = [
  {
    category: '头部',
    symptoms: [
      { name: '发烧', lastSelected: true },
      { name: '头痛' },
      { name: '偏头痛' },
      { name: '眼干' },
      { name: '眼疲劳' },
      { name: '鼻窦炎' },
      { name: '口腔溃疡' },
      { name: '头部疾病' },
    ],
  },
  {
    category: '全身',
    symptoms: [{ name: '乏力' }, { name: '发冷' }, { name: '多汗' }],
  },
  {
    category: '胸部',
    symptoms: [{ name: '胸痛' }, { name: '心悸' }, { name: '气短' }],
  },
  {
    category: '四肢',
    symptoms: [{ name: '关节痛' }, { name: '肌肉酸痛' }],
  },
    {
    category: '背部',
    symptoms: [{ name: '背痛' }],
  },
  {
    category: '骨',
    symptoms: [{ name: '骨折' }, { name: '骨质疏松' }],
  },
  {
    category: '臀部',
    symptoms: [{ name: '臀部疼痛' }],
  },
  {
    category: '手部',
    symptoms: [{ name: '手麻' }, { name: '手指疼痛' }],
  },
  {
    category: '脚部',
    symptoms: [{ name: '脚踝扭伤' }, { name: '足底筋膜炎' }],
  },
];

const DiseaseSelectionScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState(diseaseData[0].category);
  const selectedSymptoms = diseaseData.find(d => d.category === activeCategory)?.symptoms || [];

  // 使用 useFocusEffect 来管理状态栏样式
  useFocusEffect(
    React.useCallback(() => {
      // 当页面获得焦点时，设置状态栏样式
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#ffffff');
    }, [])
  );

  const handleSymptomPress = (symptomName: string) => {
    Alert.alert('页面跳转提示', `即将为您查找关于"${symptomName}"的信息`, [
      {
        text: '确定',
        onPress: () => navigation.navigate('WebView', { 
          title: symptomName, 
          url: `https://m.dxy.com/search/article?keyword=${encodeURIComponent(symptomName)}` 
        }),
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>疾病选择</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#999" style={styles.searchIcon} />
          <TextInput placeholder="搜索疾病名称" style={styles.searchInput} />
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView style={styles.leftPanel} showsVerticalScrollIndicator={false}>
          {diseaseData.map((item) => (
            <TouchableOpacity 
              key={item.category} 
              style={styles.categoryItem}
              onPress={() => setActiveCategory(item.category)}
            >
              {activeCategory === item.category && <View style={styles.activeIndicator} />}
              <Text style={[styles.categoryText, activeCategory === item.category && styles.categoryTextActive]}>
                {item.category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
          {selectedSymptoms.map((symptom) => (
            <TouchableOpacity 
              key={symptom.name} 
              style={styles.symptomItem}
              onPress={() => handleSymptomPress(symptom.name)}
            >
              <View style={styles.symptomNameContainer}>
                <Text style={styles.symptomText}>{symptom.name}</Text>
                {symptom.lastSelected && (
                  <View style={styles.lastSelectedTag}>
                    <Text style={styles.lastSelectedText}>上次选过</Text>
                  </View>
                )}
              </View>
              <Icon name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchSection: {
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: '30%',
    backgroundColor: '#F8F8F8',
  },
  categoryItem: {
    paddingVertical: 18,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIndicator: {
    width: 4,
    height: 20,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginRight: 11,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  categoryTextActive: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  rightPanel: {
    width: '65%',
    paddingLeft: '5%',
  },
  symptomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  symptomNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symptomText: {
    fontSize: 16,
    color: '#333',
  },
  lastSelectedTag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 10,
  },
  lastSelectedText: {
    fontSize: 12,
    color: '#999',
  },
});

export default DiseaseSelectionScreen; 