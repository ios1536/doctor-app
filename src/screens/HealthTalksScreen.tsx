import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

interface Article {
  uuid: string;
  title: string;
  description: string;
  wap_url: string;
  litpic: string;
  doctor: {
    zname: string;
    position_name: string;
    default_avatar: string;
    hospital_name?: string;
    cid_name?: string;
  };
}

interface Voice {
  uuid: string;
  title: string;
  description: string;
  wap_url: string;
  litpic: string;
  video_url: string;
  doctor: {
    zname: string;
    position_name: string;
    default_avatar: string;
    hospital_name?: string;
    cid_name?: string;
  };
}

const categories = ['权威文章', '专家语音'];

const HealthTalksScreen = () => {
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // 新增分页相关状态
  const [articlePage, setArticlePage] = useState(1);
  const [articleLoadingMore, setArticleLoadingMore] = useState(false);
  const [articleHasMore, setArticleHasMore] = useState(true);
  const [voicePage, setVoicePage] = useState(1);
  const [voiceLoadingMore, setVoiceLoadingMore] = useState(false);
  const [voiceHasMore, setVoiceHasMore] = useState(true);

  // 获取权威文章数据（支持分页）
  const fetchArticles = useCallback(async (page = 1, uuid = '') => {
    if (page === 1) setLoading(true);
    try {
      const url = `https://bhapp.bohe.cn/article_api/article/list?page=${page}${uuid ? `&uuid=${uuid}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.errno === 0 && data.article_data) {
        if (page === 1) {
          setArticles(data.article_data);
        } else {
          setArticles(prev => [...prev, ...data.article_data]);
        }
        setArticleHasMore(data.article_data.length === 10);
        setArticlePage(page);
      } else {
        if (page === 1) setArticles([]);
        setArticleHasMore(false);
        console.error('获取文章失败:', data.errmsg);
      }
    } catch (error) {
      if (page === 1) setArticles([]);
      setArticleHasMore(false);
      console.error('获取文章失败:', error);
    } finally {
      if (page === 1) setLoading(false);
      setArticleLoadingMore(false);
    }
  }, []);

  // 获取专家语音数据（支持分页）
  const fetchVoices = useCallback(async (page = 1, uuid = '') => {
    if (page === 1) setLoading(true);
    try {
      const url = `https://bhapp.bohe.cn/article_api/voice/list?page=${page}${uuid ? `&uuid=${uuid}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.errno === 0 && data.voice_data) {
        if (page === 1) {
          setVoices(data.voice_data);
        } else {
          setVoices(prev => [...prev, ...data.voice_data]);
        }
        setVoiceHasMore(data.voice_data.length === 10);
        setVoicePage(page);
      } else {
        if (page === 1) setVoices([]);
        setVoiceHasMore(false);
        console.error('获取语音失败:', data.errmsg);
      }
    } catch (error) {
      if (page === 1) setVoices([]);
      setVoiceHasMore(false);
      console.error('获取语音失败:', error);
    } finally {
      if (page === 1) setLoading(false);
      setVoiceLoadingMore(false);
    }
  }, []);

  // 下拉刷新
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activeCategory === '权威文章') {
      setArticlePage(1); setArticleHasMore(true);
      await fetchArticles(1, '');
    } else {
      setVoicePage(1); setVoiceHasMore(true);
      await fetchVoices(1, '');
    }
    setRefreshing(false);
  }, [activeCategory, fetchArticles, fetchVoices]);

  // 切换分类
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    if (category === '权威文章') {
      setArticlePage(1); setArticleHasMore(true);
      fetchArticles(1, '');
    } else {
      setVoicePage(1); setVoiceHasMore(true);
      fetchVoices(1, '');
    }
  }, [fetchArticles, fetchVoices]);

  // 点击文章
  const handleArticlePress = useCallback((article: Article) => {
    (navigation as any).navigate('WebView', { 
      url: article.wap_url,
      title: article.title 
    });
  }, [navigation]);

  // 点击语音
  const handleVoicePress = useCallback((voice: Voice) => {
    (navigation as any).navigate('WebView', { 
      url: voice.wap_url,
      title: voice.title 
    });
  }, [navigation]);

  // 上拉加载更多文章
  const loadMoreArticles = async () => {
    if (articleLoadingMore || !articleHasMore || articles.length === 0) return;
    setArticleLoadingMore(true);
    const lastUuid = articles[articles.length - 1]?.uuid || '';
    await fetchArticles(articlePage + 1, lastUuid);
  };

  // 上拉加载更多语音
  const loadMoreVoices = async () => {
    if (voiceLoadingMore || !voiceHasMore || voices.length === 0) return;
    setVoiceLoadingMore(true);
    const lastUuid = voices[voices.length - 1]?.uuid || '';
    await fetchVoices(voicePage + 1, lastUuid);
  };

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const renderArticle = useCallback(({ item }: { item: Article }) => (
    <TouchableOpacity 
      style={styles.articleCard}
      onPress={() => handleArticlePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.articleTextContainer}>
        <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.articleSummary} numberOfLines={2}>{item.description}</Text>
        <View style={styles.articleMeta}>
          <View style={styles.doctorInfo}>
            <Image 
              source={{ uri: item.doctor.default_avatar }} 
              style={styles.doctorAvatar}
            />
            <View style={styles.doctorText}>
              <Text style={styles.doctorName}>{item.doctor.zname}</Text>
              <Text style={styles.doctorPosition}>{item.doctor.position_name}</Text>
            </View>
          </View>
          {item.doctor.hospital_name && (
            <Text style={styles.hospitalName}>
              {' '}
            </Text>
          )}
        </View>
      </View>
      {item.litpic ? (
        <View style={styles.articleImageContainer}>
          <Image 
            source={{ uri: item.litpic }} 
            style={styles.articleImage}
            resizeMode="cover"
          />
        </View>
      ) : null}
    </TouchableOpacity>
  ), [handleArticlePress]);

  const renderVoice = useCallback(({ item }: { item: Voice }) => (
    <TouchableOpacity 
      style={styles.voiceCard}
      onPress={() => handleVoicePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.voiceTextContainer}>
        <Text style={styles.voiceTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.voiceSummary} numberOfLines={2}>{item.description}</Text>
        <View style={styles.voiceMeta}>
          <View style={styles.doctorInfo}>
            <Image 
              source={{ uri: item.doctor.default_avatar }} 
              style={styles.doctorAvatar}
            />
            <View style={styles.doctorText}>
              <Text style={styles.doctorName}>{item.doctor.zname}</Text>
              <Text style={styles.doctorPosition}>{item.doctor.position_name}</Text>
            </View>
          </View>
          {item.doctor.hospital_name && (
            <Text style={styles.hospitalName}>
              {' '}
            </Text>
          )}
        </View>
      </View>
      {item.litpic ? (
        <View style={styles.voiceImageContainer}>
          <Image 
            source={{ uri: item.litpic }} 
            style={styles.voiceImage}
            resizeMode="cover"
          />
        </View>
      ) : null}
    </TouchableOpacity>
  ), [handleVoicePress]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Icon name="file-document-outline" size={60} color="#CCC" />
      <Text style={styles.emptyText}>暂无相关{activeCategory === '权威文章' ? '文章' : '语音'}</Text>
    </View>
  ), [activeCategory]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category} 
              onPress={() => handleCategoryChange(category)}
              style={styles.categoryButton}
            >
              <Text style={[
                styles.categoryText, 
                activeCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
              {activeCategory === category && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Content List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : activeCategory === '权威文章' ? (
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item, index) => item.uuid + '_' + index}
          onEndReached={loadMoreArticles}
          onEndReachedThreshold={0.3}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            articleLoadingMore ? <Text style={{textAlign:'center',padding:10}}>加载中...</Text> :
            !articleHasMore ? <Text style={{textAlign:'center',padding:10,color:'#aaa'}}>没有更多了</Text> : null
          }
        />
      ) : (
        <FlatList
          data={voices}
          renderItem={renderVoice}
          keyExtractor={(item, index) => item.uuid + '_' + index}
          onEndReached={loadMoreVoices}
          onEndReachedThreshold={0.3}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            voiceLoadingMore ? <Text style={{textAlign:'center',padding:10}}>加载中...</Text> :
            !voiceHasMore ? <Text style={{textAlign:'center',padding:10,color:'#aaa'}}>没有更多了</Text> : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  categoryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingTop: 20,
  },
  categoryScroll: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  categoryButton: {
    marginRight: 40,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  activeIndicator: {
    width: 24,
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginTop: 6,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  articleCard: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  voiceCard: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  articleTextContainer: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'flex-start',
  },
  voiceTextContainer: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'flex-start',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginBottom: 6,
  },
  voiceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginBottom: 6,
  },
  articleSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  voiceSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voiceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  doctorText: {
    flex: 1,
  },
  doctorName: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  doctorPosition: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  hospitalName: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    maxWidth: 120,
    flexShrink: 1,
  },
  playButton: {
    padding: 4,
  },
  articleImageContainer: {
    width: 100,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  voiceImageContainer: {
    width: 100,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  voiceImage: {
    width: '100%',
    height: '100%',
  },

  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});

export default HealthTalksScreen; 