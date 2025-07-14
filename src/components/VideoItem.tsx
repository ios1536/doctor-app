import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import VideoPlayer, { type VideoPlayerRef } from 'react-native-video-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// This is a placeholder for your video data structure
interface VideoItemData {
  id: string;
  uri: string;
  authorName?: string;
  authorTitle?: string;
  description?: string;
}

interface VideoItemProps {
  item: VideoItemData;
  isPlaying: boolean;
  height: number;
}

const VideoItem = ({ item, isPlaying, height }: VideoItemProps) => {
  const [isUserPaused, setIsUserPaused] = useState(false);
  const playerRef = useRef<VideoPlayerRef>(null);

  const togglePause = () => {
    setIsUserPaused(prev => !prev);
    if (playerRef.current) {
      if (isUserPaused) {
        playerRef.current.resume();
      } else {
        playerRef.current.pause();
      }
    }
  };

  // Default values for display
  const authorName = item.authorName ?? 'Dr. John Doe';
  const authorTitle = item.authorTitle ?? 'Cardiologist';
  const description = item.description ?? 'This is a sample video description. Discussing the latest in cardiac health...';

  return (
    <Pressable onPress={togglePause} style={{ height: height }}>
      <View style={styles.videoContainer}>
        <VideoPlayer
          ref={playerRef}
          source={{ uri: item.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          repeat
          paused={!isPlaying || isUserPaused}
          onError={(e) => console.log('Video Error:', e)}
          showDuration={false}
          showControls={false}
          disableFullscreen={true}
          disableSeek={true}
          disableVolume={true}
        />
        {isUserPaused && (
          <View style={styles.playIconContainer}>
            <Icon name="play" size={80} color="rgba(255, 255, 255, 0.7)" />
          </View>
        )}
        <View style={styles.contentOverlay}>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar} />
            <Text style={styles.authorName}>{authorName}</Text>
            <Text style={styles.authorTitle}>{authorTitle}</Text>
          </View>
          <Text style={styles.description} numberOfLines={3}>
            {description}
            <Text style={styles.seeMore}>...查看文字版</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-end',
  },
  contentOverlay: {
    padding: 15,
    paddingBottom: 90, // Standard padding from bottom, assuming tab bar is handled by screen layout
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

export default VideoItem; 