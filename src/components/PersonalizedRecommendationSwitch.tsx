import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PersonalizedRecommendationSwitchProps {
  onToggle?: (enabled: boolean) => void;
  showDescription?: boolean;
}

const PersonalizedRecommendationSwitch: React.FC<PersonalizedRecommendationSwitchProps> = ({
  onToggle,
  showDescription = true,
}) => {
  const [isEnabled, setIsEnabled] = useState(true); // 默认打开

  useEffect(() => {
    loadSwitchState();
  }, []);

  const loadSwitchState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('personalizedRecommendation');
      if (savedState !== null) {
        setIsEnabled(savedState === 'true');
      }
    } catch (error) {
      console.error('加载个性化推荐设置失败:', error);
    }
  };

  const toggleSwitch = async (value: boolean) => {
    try {
      setIsEnabled(value);
      await AsyncStorage.setItem('personalizedRecommendation', value.toString());
      onToggle?.(value);
    } catch (error) {
      console.error('保存个性化推荐设置失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>个性化推荐</Text>
        <Switch
          trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
          thumbColor={isEnabled ? '#FFFFFF' : '#FFFFFF'}
          ios_backgroundColor="#E5E5E5"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      {showDescription && (
        <Text style={styles.description}>
          开启后，我们将根据您的兴趣为您推荐相关内容
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginLeft: 15,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
    lineHeight: 16,
    marginLeft: 15,
  },
});

export default PersonalizedRecommendationSwitch; 