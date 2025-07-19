// 崩溃的

import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useFocusEffect} from '@react-navigation/native';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video, {VideoRef} from 'react-native-video';
import {getVideoList} from '../services/api';

interface VideoInfo {
  uuid: string;
  title: string;
  description: string;
  wap_url: string;
  litpic: string;
  video_url: string;
  doctor: Doctor;
}

interface Doctor {
  zname: string;
  position_name: string;
  default_avatar: string;
}

// 获取屏幕宽度
const {width: screenWidth} = Dimensions.get('window');
const videoHeight = (screenWidth * 9) / 16;

type VideoComProps = {
  item: VideoInfo;
  _bottomPadding: number;
  componentHeight: number;
  itemIndex: number;
  curIndex: number;
};

const VideoItem: FC<VideoComProps> = ({item, _bottomPadding, componentHeight, curIndex, itemIndex}) => {
  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // const show = useMemo(() => {
  //   // 始终显示视频，但只在当前视频时播放
  //   console.log(`VideoItem ${itemIndex}: show=true, curIndex=${curIndex}, isPlaying=${isPlaying}`);
  //   return true;
  // }, [curIndex, itemIndex, isPlaying]);
  const show = useMemo(() => {
    return Math.abs(itemIndex - curIndex) < 2;
  }, [curIndex, itemIndex]);

  useEffect(() => {
        if (show) {
    if (curIndex === itemIndex && curIndex !== -1) {
      // 只有在没有手动暂停的情况下才自动播放
      if (!isManuallyPaused) {
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(false);
      if (curIndex !== itemIndex) {
        setIsManuallyPaused(false); // 切换视频时重置手动暂停状态
      }
    }}
  }, [curIndex, itemIndex, isManuallyPaused, show]);

  return (
    <View
      style={{
        width: '100%',
        height: componentHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <Pressable
        onPress={() => {
          const newPlayingState = !isPlaying;
          setIsPlaying(newPlayingState);
          // 如果手动暂停，记录状态
          if (!newPlayingState) {
            setIsManuallyPaused(true);
          } else {
            setIsManuallyPaused(false);
          }
        }}
        style={{
          width: screenWidth,
          height: videoHeight,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {show ? (
          <View style={{width: '100%', height: '100%', position: 'relative'}}>
            <Video
              ref={videoRef}
              source={{uri: item.video_url}}
              style={{width: '100%', height: '100%'}}
              resizeMode="cover"
              paused={!isPlaying}
              repeat
            />
            {/* 透明蒙版层，用于捕获点击事件 */}
            <Pressable
              onPress={() => {
                const newPlayingState = !isPlaying;
                setIsPlaying(newPlayingState);
                // 如果手动暂停，记录状态
                if (!newPlayingState) {
                  setIsManuallyPaused(true);
                } else {
                  setIsManuallyPaused(false);
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'transparent',
              }}
            />
          </View>
        ) : null}

        {!isPlaying && (
          <View style={styles.playIconContainer}>
            <Icon name="play" size={80} color="rgba(255, 255, 255, 0.7)" />
          </View>
        )}
      </Pressable>
      
      {/* 文本区域，独立于视频点击区域 */}
      <View style={[styles.contentOverlay, {width: screenWidth}]}>
        <View style={styles.authorInfo}>
          <Image
            source={{ uri: item.doctor?.default_avatar }}
            style={styles.authorAvatar}
            defaultSource={require('../Asset/hospital_hint.png')}
          />
          <Text style={styles.authorName}>{item.doctor?.zname || '医生'}</Text>
          <Text style={styles.authorTitle}>{item.doctor?.position_name || '医师'}</Text>
        </View>
        <Text 
          style={styles.description} 
          numberOfLines={isTextExpanded ? undefined : 3}
          onPress={() => {
            console.log('点击了描述文本，切换展开状态');
            setIsTextExpanded(!isTextExpanded);
          }}
        >
          {item.description}
          {!isTextExpanded && (
            <Text
              style={styles.seeMore}
              onPress={e => {
                e.stopPropagation(); // 阻止冒泡，不影响播放/暂停
                console.log('点击了展开按钮');
                setIsTextExpanded(true);
              }}
            >
              ...展开
            </Text>
          )}
          {isTextExpanded && (
            <Text
              style={styles.seeMore}
              onPress={e => {
                e.stopPropagation(); // 阻止冒泡，不影响播放/暂停
                console.log('点击了收起按钮');
                setIsTextExpanded(false);
              }}
            >
              {'\n'}收起
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
};

const DoctorsScreen: FC = () => {
  const [videoData, setVideoData] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // 新增
  const [loadingMore, setLoadingMore] = useState(false); // 新增
  const [hasMore, setHasMore] = useState(true); // 新增
  const [listHeight, setListHeight] = useState(0);
  const tabBarHeight = useBottomTabBarHeight();
  const [curIndex, setCurIndex] = useState(-1);

  // 获取视频数据（首页/刷新）
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const data = await getVideoList(1, ''); // 首页 page=1, uuid空
        
        console.log('=== 获取到的视频数据 ===');
        console.log('数据总数:', data?.length);
        if (data && data.length > 0) {
          data.forEach((item: VideoInfo, index: number) => {
            console.log(`\n--- 第${index + 1}个视频 ---`);
            console.log('标题:', item.title);
            console.log('描述:', item.description);
            console.log('描述长度:', item.description?.length);
            console.log('医生姓名:', item.doctor?.zname);
            console.log('医生职位:', item.doctor?.position_name);
            console.log('视频URL:', item.video_url);
            console.log('网页URL:', item.wap_url);
          });
        }
        console.log('==================');
        
        setVideoData(data);
        setPage(1);
        setHasMore(data && data.length === 10);
        if (data.length > 0) {
          setCurIndex(0);
        }
      } catch (error) {
        console.error('获取视频数据失败:', error);
        Alert.alert('提示', '获取视频数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, []);

  // 加载更多
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const lastUuid = videoData.length > 0 ? videoData[videoData.length - 1].uuid : '';
      const moreData = await getVideoList(nextPage, lastUuid);
      
      console.log('=== 加载更多视频数据 ===');
      console.log('加载更多数据总数:', moreData?.length);
      if (moreData && moreData.length > 0) {
        moreData.forEach((item: VideoInfo, index: number) => {
          console.log(`\n--- 加载更多第${index + 1}个视频 ---`);
          console.log('标题:', item.title);
          console.log('描述:', item.description);
          console.log('描述长度:', item.description?.length);
          console.log('医生姓名:', item.doctor?.zname);
          console.log('医生职位:', item.doctor?.position_name);
        });
      }
      console.log('==================');
      
      setVideoData(prev => [...prev, ...(moreData || [])]);
      setPage(nextPage);
      setHasMore(moreData && moreData.length === 10);
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
    console.log('当前可见的视频项:', viewableItems);

    if (viewableItems.length == 1) {
      const curItem = viewableItems[0];
      setCurIndex(curItem.index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // 监听页面焦点变化，当离开页面时暂停所有视频
  useFocusEffect(
    useCallback(() => {
      // 页面获得焦点时，不自动播放，保持暂停状态
      if (videoData.length > 0) {
        setCurIndex(-1); // 设置为-1，表示没有当前播放的视频
      }
      return () => {
        // 页面失去焦点时暂停所有视频
        setCurIndex(-1);
      };
    }, [videoData])
  );

  const handleHeaderPress = (buttonName: string) => {
    Alert.alert(`点击了 "${buttonName}"`, '将来这里会跳转到对应的WebView页面。', [{text: '好的'}]);
  };

  const onLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    if (height > 0 && listHeight !== height) {
      setListHeight(height);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer} onLayout={onLayout}>
        <FlatList
          data={videoData}
          renderItem={({item, index}) => (
            <VideoItem
              curIndex={curIndex}
              itemIndex={index}
              item={item}
              _bottomPadding={tabBarHeight + 10}
              componentHeight={listHeight}
            />
          )}
          keyExtractor={(item, index) => `${item.uuid}_${index}`}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          numColumns={1}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <Text style={{color: '#fff', textAlign: 'center', padding: 10}}>加载中...</Text>
            ) : !hasMore ? (
              <Text style={{color: '#aaa', textAlign: 'center', padding: 10}}>没有更多了</Text>
            ) : null
          }
        />
      </View>

      {/* 隐藏头部区域 */}
      {/* <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleHeaderPress('有来')}>
            <Text style={styles.headerText}>有来</Text>
          </TouchableOpacity>
          <View style={{flex: 1}} />
          <TouchableOpacity onPress={() => handleHeaderPress('更多选项')}>
            <Icon name="dots-horizontal" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  listContainer: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'flex-end',
  },
  contentOverlay: {
    padding: 15,
    // paddingBottom: 90,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTabs: {
    flexDirection: 'row',
  },
  headerTabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginHorizontal: 10,
  },
  headerTabTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCC',
    marginRight: 10,
  },
  authorName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  authorTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  description: {
    color: 'white',
    fontSize: 15,
    lineHeight: 22,
  },
  seeMore: {
    color: '#A0D9FF',
    fontWeight: 'bold',
  },
  playIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DoctorsScreen;

