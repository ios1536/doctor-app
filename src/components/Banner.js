import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const Banner = ({ banners = [], onBannerPress }) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.swiper}
        showsPagination
        autoplay
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={styles.pagination}
        loop
      >
        {banners.map((banner, idx) => (
          <TouchableOpacity key={idx} onPress={() => onBannerPress && onBannerPress(banner)} activeOpacity={0.8}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: banner.litpic }}
                style={styles.bannerImage}
                resizeMode="contain"
              />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle} numberOfLines={2}>
                  {banner.title}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginVertical: 10,
  },
  swiper: {
    height: 200,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: width - 30,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    // 不加 borderRadius
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  pagination: {
    bottom: 10,
  },
});

export default Banner; 