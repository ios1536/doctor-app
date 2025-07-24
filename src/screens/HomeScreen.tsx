import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  Platform,
  Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MDIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getBannerData, getHotNewsData, getSelectedDoctors, getHotDiseases, getScienceArticles, getNavData, getDiseNavData, checkAppVersion } from '../services/api';
import Banner from '../components/Banner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isPersonalizedRecommendationEnabled, filterContentByRecommendation } from '../utils/recommendationUtils';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 30; // 考虑左右padding

// 默认的quickActions，当接口数据加载失败时使用
const defaultQuickActions = [
  { title: '名医视频', icon: 'video-camera', lib: FontAwesome, color: '#4FD1C5' },
  { title: '语音答疑', icon: 'microphone', lib: FontAwesome, color: '#6B7AFE' },
  { title: '专家观点', icon: 'file-text-o', lib: FontAwesome, color: '#4FD1C5' },
  { title: '精选回答', icon: 'question-circle-o', lib: FontAwesome, color: '#6B7AFE' },
  { title: '医患问答', icon: 'plus-circle', lib: FontAwesome, color: '#6B7AFE' },
  { title: '行业头条', icon: 'newspaper-o', lib: FontAwesome, color: '#4FD1C5' },
  { title: '用药指导', icon: 'book', lib: FontAwesome, color: '#FF7F50' },
  { title: '健康资讯', icon: 'book', lib: FontAwesome, color: '#4FD1C5' },
];

const HomeScreen = ({ navigation }: any) => {
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hotNews, setHotNews] = useState([]);
  const [hotNewsLoading, setHotNewsLoading] = useState(true);
  const [quickActions, setQuickActions] = useState(defaultQuickActions);
  const [quickActionsLoading, setQuickActionsLoading] = useState(true);
  const [departmentActions, setDepartmentActions] = useState([]);
  const [departmentActionsLoading, setDepartmentActionsLoading] = useState(true);
  const [departmentMoreUrl, setDepartmentMoreUrl] = useState('https://m.bohe.cn/dise/list/1_4.html');
  const [isRecommendationEnabled, setIsRecommendationEnabled] = useState(true);

  // 检查个性化推荐设置
  useEffect(() => {
    const checkRecommendationSetting = async () => {
      const enabled = await isPersonalizedRecommendationEnabled();
      setIsRecommendationEnabled(enabled);
    };
    checkRecommendationSetting();
  }, []);

  // 获取 banner 数据
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true);
        const data = await getBannerData();
        // 根据个性化推荐设置过滤banner数据
        const filteredData = filterContentByRecommendation(data, isRecommendationEnabled);
        setBannerData(filteredData);
      } catch (error) {
        console.error('获取banner数据失败:', error);
        Alert.alert('提示', '获取banner数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    fetchBannerData();
  }, [isRecommendationEnabled]);

  // 获取今日热门新闻数据
  useEffect(() => {
    const fetchHotNews = async () => {
      try {
        setHotNewsLoading(true);
        const data = await getHotNewsData();
        setHotNews(data || []);
      } catch (error) {
        console.error('获取今日热门新闻失败:', error);
      } finally {
        setHotNewsLoading(false);
      }
    };
    fetchHotNews();
  }, []);

  // 新增：专家nav和doctor_data
  type ExpertNavItem = { name: string; url: string };
  const [expertNav, setExpertNav] = useState<ExpertNavItem[]>([]); // nav: [{name, url}]
  const [expertDoctors, setExpertDoctors] = useState<any[]>([]); // doctor_data
  const [hotDiseases, setHotDiseases] = useState<any[]>([]); // disease_data
  const [scienceArticles, setScienceArticles] = useState<any[]>([]); // news_data

  // 获取专家nav和doctor_data
  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        const res = await getSelectedDoctors();
        setExpertNav(Array.isArray(res.nav) ? res.nav.map((n: any) => ({ name: n.name, url: n.url })) : []);
        setExpertDoctors(Array.isArray(res.doctor_data) ? res.doctor_data : []);
      } catch (error) {
        console.error('获取专家数据失败:', error);
      }
    };
    fetchExpertData();
  }, []);

  // 获取热门疾病数据
  useEffect(() => {
    const fetchHotDiseases = async () => {
      try {
        const data = await getHotDiseases();
        setHotDiseases(data || []);
      } catch (error) {
        console.error('获取热门疾病失败:', error);
      }
    };
    fetchHotDiseases();
  }, []);

  // 获取科普推荐数据
  useEffect(() => {
    const fetchScienceArticles = async () => {
      try {
        const data = await getScienceArticles();
        setScienceArticles(data || []);
      } catch (error) {
        console.error('获取科普推荐失败:', error);
      }
    };
    fetchScienceArticles();
  }, []);

  // 获取quickActions数据
  useEffect(() => {
    const fetchQuickActions = async () => {
      try {
        setQuickActionsLoading(true);
        const navData = await getNavData();
        
        if (navData && Array.isArray(navData)) {
          // 将接口数据转换为quickActions格式
          const convertedActions = navData.map((item, index) => {
            // 根据title匹配对应的图标和颜色
            const getIconAndColor = (title: string) => {
              switch (title) {
                case '名医视频':
                  return { icon: 'video-camera', color: '#4FD1C5' };
                case '语音答疑':
                  return { icon: 'microphone', color: '#6B7AFE' };
                case '专家观点':
                  return { icon: 'file-text-o', color: '#4FD1C5' };
                case '精选回答':
                  return { icon: 'question-circle-o', color: '#6B7AFE' };
                case '医患问答':
                  return { icon: 'plus-circle', color: '#6B7AFE' };
                case '行业头条':
                  return { icon: 'newspaper-o', color: '#4FD1C5' };
                case '用药指导':
                  return { icon: 'book', color: '#FF7F50' };
                case '健康资讯':
                  return { icon: 'book', color: '#4FD1C5' };
                default:
                  return { icon: 'circle', color: '#4FD1C5' };
              }
            };
            
            const { icon, color } = getIconAndColor(item.title);
            return {
              title: item.title,
              icon: icon,
              lib: FontAwesome,
              color: color,
              url: item.url,
              litpic: item.litpic
            };
          });
          
          setQuickActions(convertedActions);
        }
      } catch (error) {
        console.error('获取quickActions失败:', error);
        // 如果接口失败，使用默认数据
        setQuickActions(defaultQuickActions);
      } finally {
        setQuickActionsLoading(false);
      }
    };
    fetchQuickActions();
  }, []);

  // 获取departmentActions数据
  useEffect(() => {
    const fetchDepartmentActions = async () => {
      try {
        setDepartmentActionsLoading(true);
        const diseNavData = await getDiseNavData();
        
        if (diseNavData && diseNavData.nav && Array.isArray(diseNavData.nav)) {
          // 设置more_url
          if (diseNavData.more_url) {
            setDepartmentMoreUrl(diseNavData.more_url);
          }
          
          // 将接口数据转换为departmentActions格式
          const convertedDepartmentActions = diseNavData.nav.map((item, index) => {
            // 根据title匹配对应的图标
            const getIcon = (title: string) => {
              switch (title) {
                case '外科':
                  return 'scissors-cutting';
                case '内科':
                  return 'stethoscope';
                case '心脑血管':
                  return 'heart-pulse';
                case '整形科':
                  return 'face-recognition';
                case '皮肤科':
                  return 'hand-heart';
                case '妇科':
                  return 'face-woman-outline';
                case '儿科':
                  return 'emoticon-happy-outline';
                case '眼科':
                  return 'eye-outline';
                case '内分泌科':
                  return 'plus-box-outline';
                case '药剂科':
                  return 'beaker-outline';
                default:
                  return 'medical-bag';
              }
            };
            
            return {
              title: item.title,
              icon: getIcon(item.title),
              lib: MDIcon,
              url: item.url,
              litpic: item.litpic
            };
          });
          
          setDepartmentActions(convertedDepartmentActions);
        }
      } catch (error) {
        console.error('获取departmentActions失败:', error);
        // 如果接口失败，使用默认数据
        setDepartmentActions(defaultDepartmentActions);
      } finally {
        setDepartmentActionsLoading(false);
      }
    };
    fetchDepartmentActions();
  }, []);

  // 版本检查
  useEffect(() => {
    const checkVersion = async () => {
      try {
        // 获取当前平台和版本号
        const platform = Platform.OS; // 'ios' 或 'android'
        const currentVersion = '1.0.1'; // 固定版本号
        
        console.log('=== 版本检查信息 ===');
        console.log('平台:', platform);
        console.log('当前版本号:', currentVersion);
        
        const versionData = await checkAppVersion(platform, currentVersion);
        
        console.log('=== 版本接口返回数据 ===');
        console.log('完整响应:', JSON.stringify(versionData, null, 2));
        console.log('最新版本:', versionData?.latest_version);
        console.log('最低要求版本:', versionData?.min_required_version);
        console.log('下载链接:', versionData?.download_url);
        console.log('更新说明:', versionData?.update_log);
        console.log('强制更新:', versionData?.force_update);
        console.log('==================');
        
        if (versionData) {
          const { latest_version, min_required_version, download_url, update_log, force_update } = versionData;
          
          // 检查是否需要更新
          if (latest_version !== currentVersion) {
            // 检查是否强制更新
            if (force_update || versionData.min_required_version > currentVersion) {
              // 强制更新
              Alert.alert(
                '版本更新',
                `发现新版本 ${latest_version}\n\n${update_log || '修复了一些问题，提升用户体验'}`,
                [
                  {
                    text: '立即更新',
                    onPress: async () => {
                      try {
                        if (download_url) {
                          const supported = await Linking.canOpenURL(download_url);
                          if (supported) {
                            await Linking.openURL(download_url);
                          } else {
                            Alert.alert('提示', '无法打开下载链接');
                          }
                        } else {
                          Alert.alert('提示', '下载链接不可用');
                        }
                      } catch (error) {
                        console.error('打开下载链接失败:', error);
                        Alert.alert('提示', '打开下载链接失败');
                      }
                    },
                  },
                ],
                { cancelable: false }
              );
            } else {
              // 检查是否已忽略该版本
              const ignoreVersion = await AsyncStorage.getItem('ignoreVersion');
              if (ignoreVersion === latest_version) {
                // 如果不是强制更新，且已忽略该版本，则不弹窗
                return;
              }
              // 可选更新
              Alert.alert(
                '版本更新',
                `发现新版本 ${latest_version}\n\n${update_log || '修复了一些问题，提升用户体验'}`,
                [
                  {
                    text: '稍后再说',
                    style: 'cancel',
                    onPress: async () => {
                      await AsyncStorage.setItem('ignoreVersion', latest_version);
                    },
                  },
                  {
                    text: '立即更新',
                    onPress: async () => {
                      try {
                        if (download_url) {
                          const supported = await Linking.canOpenURL(download_url);
                          if (supported) {
                            await Linking.openURL(download_url);
                          } else {
                            Alert.alert('提示', '无法打开下载链接');
                          }
                        } else {
                          Alert.alert('提示', '下载链接不可用');
                        }
                      } catch (error) {
                        console.error('打开下载链接失败:', error);
                        Alert.alert('提示', '打开下载链接失败');
                      }
                    },
                  },
                ]
              );
            }
          }
        }
      } catch (error) {
        console.error('版本检查失败:', error);
        // 版本检查失败不影响应用正常使用
      }
    };
    
    // 延迟检查版本，避免影响首页加载
    const timer = setTimeout(() => {
      checkVersion();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Banner 点击处理
  const handleBannerPress = (banner: any) => {
    if (banner.url) {
      navigation.navigate('WebView', { url: banner.url, title: banner.title });
    }
  };
  
  const handleNavigation = (title: string, url: string = 'https://www.pumch.cn/register.html') => {
    navigation.navigate('WebView', { url, title });
  };

  // 处理quickActions点击
  const handleQuickActionPress = (action: any) => {
    if (action.url) {
      navigation.navigate('WebView', { url: action.url, title: action.title });
    } else {
      // 如果没有url，使用默认的handleNavigation
      handleNavigation(action.title);
    }
  };



  // 默认的departmentActions，当接口数据加载失败时使用
  const defaultDepartmentActions = [
    { title: '外科', icon: 'scissors-cutting', lib: MDIcon },
    { title: '内科', icon: 'stethoscope', lib: MDIcon },
    { title: '心脑血管', icon: 'heart-pulse', lib: MDIcon },
    { title: '整形科', icon: 'face-recognition', lib: MDIcon },
    { title: '皮肤科', icon: 'hand-heart', lib: MDIcon },
    { title: '妇科', icon: 'face-woman-outline', lib: MDIcon },
    { title: '儿科', icon: 'emoticon-happy-outline', lib: MDIcon },
    { title: '眼科', icon: 'eye-outline', lib: MDIcon },
    { title: '内分泌科', icon: 'plus-box-outline', lib: MDIcon },
    { title: '药剂科', icon: 'beaker-outline', lib: MDIcon },
  ];



  // 直接使用API返回的医生数据，不需要筛选









  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.paddingContainer}>
          {/* Top Header */}
          <View style={styles.header}>
            <Image 
              source={require('../Asset/home_top_app_hint.png')} 
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>博禾医生</Text>
          </View>

          {/* Banner */}
          {!loading && bannerData.length > 0 && (
            <Banner 
              banners={bannerData} 
              onBannerPress={handleBannerPress}
            />
          )}

          {/* This is the Action Grid you pointed out */}
          <View style={styles.actionGrid}>
            {quickActionsLoading ? (
              // 加载中显示骨架屏
              Array.from({ length: 8 }).map((_, index) => (
                <View key={index} style={styles.actionItem}>
                  <View style={[styles.actionIcon, { backgroundColor: '#E0E0E0' }]} />
                  <View style={styles.actionTextSkeleton} />
                </View>
              ))
            ) : (
              quickActions.map((action, index) => {
                return (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.actionItem}
                    onPress={() => handleQuickActionPress(action)}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                      {action.litpic ? (
                        <Image 
                          source={{ uri: action.litpic }} 
                          style={styles.actionIconImage}
                          defaultSource={require('../Asset/hospital_hint.png')}
                        />
                      ) : (
                        <FontAwesome name={action.icon} size={24} color="#FFF" />
                      )}
                    </View>
                    <Text style={styles.actionText}>{action.title}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Hot Topics - 今日热门新闻 */}
          <View style={styles.topicsContainer}>
            <Text style={styles.topicsTitle}>今日热门</Text>
            {hotNewsLoading ? (
              <Text style={{ color: '#999', paddingVertical: 10 }}>加载中...</Text>
            ) : (
              hotNews.map((item, index) => (
                <TouchableOpacity key={index} style={styles.topicItem} onPress={() => handleNavigation(item.title, item.wap_url)}>
                  <View style={styles.dot} />
                  <Text style={styles.topicText} numberOfLines={1}>{item.title}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Department Actions */}
          <View style={styles.departmentContainer}>
            <View style={styles.departmentHeader}>
              <Text style={styles.topicsTitle}>专科专病</Text>
              <TouchableOpacity onPress={() => handleNavigation('专科专病', departmentMoreUrl)}>
                <Text style={styles.seeMoreText}>查看更多 &gt;</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.departmentGrid}>
              {departmentActionsLoading ? (
                // 加载中显示骨架屏
                Array.from({ length: 10 }).map((_, index) => (
                  <View key={index} style={styles.departmentItem}>
                    <View style={styles.departmentIconContainer}>
                      <View style={styles.departmentIconSkeleton} />
                    </View>
                    <View style={styles.departmentTextSkeleton} />
                  </View>
                ))
              ) : (
                departmentActions.map((action, index) => {
                  return (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.departmentItem} 
                      onPress={() => handleQuickActionPress(action)}
                    >
                      <View style={styles.departmentIconContainer}>
                        {action.litpic ? (
                          <Image 
                            source={{ uri: action.litpic }} 
                            style={styles.departmentIconImage}
                            defaultSource={require('../Asset/hospital_hint.png')}
                          />
                        ) : (
                          <MDIcon name={action.icon} size={30} color="#007AFF" />
                        )}
                      </View>
                      <Text style={styles.departmentText}>{action.title}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>

          {/* Expert Doctors List */}
          <View style={styles.expertContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.expertTabsContainer}
            >
              {/* 固定“严选专家”按钮 */}
              <TouchableOpacity style={styles.expertTab}>
                <Text style={styles.expertTabActive}>严选专家</Text>
              </TouchableOpacity>
              {/* nav按钮，点击跳转web，链接用item.url */}
              {Array.isArray(expertNav) ? expertNav.map((item, idx) => (
                <TouchableOpacity
                  key={item.name + idx}
                  style={styles.expertTab}
                  onPress={() => handleNavigation(item.name, item.url)}
                >
                  <Text style={styles.expertTab}>{item.name}</Text>
                </TouchableOpacity>
              )) : null}
            </ScrollView>

            <View style={styles.doctorList}>
              {(expertDoctors as any[]).map((doctor, index) => (
                <TouchableOpacity 
                  key={doctor.id || index} 
                  style={styles.doctorCard}
                  onPress={() => handleNavigation(doctor.zname || '医生详情', doctor.doctor_wap_url)}
                >
                  <Image 
                    source={{ uri: doctor.default_avatar }} 
                    style={styles.doctorAvatar}
                  />
                  <View style={styles.doctorInfo}>
                    <View>
                      <Text style={styles.doctorName}>{doctor.zname || '医生'}</Text>
                      <Text style={styles.doctorTitle}>{doctor.position_name || '医师'}</Text>
                    </View>
                    <Text style={styles.doctorHospital}>{doctor.hospital_name || ''} {doctor.cid_name || ''}</Text>
                    <Text style={styles.doctorExpertise} numberOfLines={1}>{doctor.goodable || '专业医生'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Hot Diseases */}
          <View style={styles.hotDiseasesContainer}>
            <Text style={styles.sectionTitle}>热门疾病</Text>
            <View style={styles.diseasesBox}>
              {hotDiseases.map((disease, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.diseaseTag}
                  onPress={() => handleNavigation(disease.name, disease.wap_url)}
                >
                  <Text style={styles.diseaseTagText}>{disease.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Science Articles */}
          <View style={styles.articlesSectionContainer}>
            <Text style={styles.sectionTitle}>科普推荐</Text>
            <View style={styles.articlesGrid}>
              {[0, 1].map((colIndex) => (
                <View key={colIndex} style={styles.articlesColumn}>
                  {scienceArticles
                    .filter((_, itemIndex) => itemIndex % 2 === colIndex)
                    .map((article, index) => (
                      <TouchableOpacity 
                        key={article.id || index} 
                        style={styles.articleCard}
                        onPress={() => handleNavigation(article.title, article.wap_url)}
                      >
                        <View style={[styles.articleImage, { height: 150 }]}>
                          <Image 
                            source={{ uri: article.litpic }} 
                            style={{ width: '100%', height: '100%' }}
                          />
                        </View>
                        <Text style={[styles.articleTitle, { marginBottom: 8 }]}>{article.title}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  paddingContainer: {
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingTop: 40,
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bannerScrollView: {
    height: 160,
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    height: 160,
  },
  doctorImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: width * 0.4,
    height: '100%',
    resizeMode: 'contain',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  bannerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  bannerButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  topicsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 15,
    // marginBottom: 20,
  },
  topicsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginRight: 10,
  },
  topicText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  departmentContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 15,
    // marginBottom: 20,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#999',
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  departmentItem: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 20,
  },
  departmentIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
  },
  departmentText: {
    fontSize: 12,
    color: '#333',
  },
  doctorList: {
    // No specific styles needed for the container
  },
  doctorCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F0F0',
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
    width: 0,
  },
  doctorTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  doctorTitle: {
    fontSize: 14,
    color: '#666',
  },
  doctorHospital: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  doctorExpertise: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  doctorActions: {
    flexDirection: 'row',
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  actionLinkText: {
    fontSize: 13,
    color: '#007AFF',
    marginLeft: 4,
  },
  bookButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  expertContainer: {
    marginTop: 15,
  },
  expertTabsContainer: {
    paddingBottom: 15,
  },
  expertTab: {
    fontSize: 16,
    color: '#666',
    marginRight: 12,
  },
  expertTabActive: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  hotDiseasesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  diseasesBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  diseaseTag: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  diseaseTagText: {
    fontSize: 14,
    color: '#333',
  },
  articlesSectionContainer: {
    marginTop: 20,
  },
  articlesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articlesColumn: {
    width: '48.5%', // Slightly less than 50% to create a gap
  },
  articleCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  articleImage: {
    width: '100%',
    backgroundColor: '#F0F0F0', // Placeholder for image
    position: 'relative',
  },
  viewsTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  authorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginRight: 6,
  },
  authorName: {
    fontSize: 12,
    color: '#666',
  },
  authorTitleBadge: {
    borderWidth: 1,
    borderColor: '#A1D5FF',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  authorTitleText: {
    fontSize: 10,
    color: '#007AFF',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFFFFF', 
    borderRadius: 12,
    marginTop: 15,
  },
  actionItem: {
    width: '25%', 
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    color: '#333',
  },
  actionTextSkeleton: {
    width: 40,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginTop: 8,
  },
  actionIconImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  departmentIconSkeleton: {
    width: 30,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
  },
  departmentTextSkeleton: {
    width: 50,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginTop: 8,
  },
  departmentIconImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'contain',
  },
});

export default HomeScreen; 