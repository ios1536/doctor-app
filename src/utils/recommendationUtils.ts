import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 检查个性化推荐是否开启
 * @returns Promise<boolean> 是否开启个性化推荐
 */
export const isPersonalizedRecommendationEnabled = async (): Promise<boolean> => {
  try {
    const savedState = await AsyncStorage.getItem('personalizedRecommendation');
    // 默认开启，如果未设置则返回true
    return savedState === null ? true : savedState === 'true';
  } catch (error) {
    console.error('检查个性化推荐设置失败:', error);
    return true; // 出错时默认开启
  }
};

/**
 * 设置个性化推荐开关状态
 * @param enabled 是否开启
 */
export const setPersonalizedRecommendation = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem('personalizedRecommendation', enabled.toString());
  } catch (error) {
    console.error('保存个性化推荐设置失败:', error);
  }
};

/**
 * 根据个性化推荐设置过滤内容
 * @param content 原始内容
 * @param isEnabled 是否开启个性化推荐
 * @returns 过滤后的内容
 */
export const filterContentByRecommendation = (content: any[], isEnabled: boolean) => {
  if (isEnabled) {
    return content; // 开启时返回全部内容
  } else {
    // 关闭时过滤掉推荐内容，只显示基础内容
    return content.filter(item => !item.isRecommendation);
  }
}; 