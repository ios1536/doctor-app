import { Platform } from 'react-native';
import umInitModule from '../types/UMInitModule';

/**
 * 测试友盟初始化模块
 * 用于验证原生模块是否正常工作
 */
export const testUMInitModule = async () => {
  console.log('🧪 开始测试友盟初始化模块...');
  console.log('📱 当前平台:', Platform.OS);
  
  if (Platform.OS !== 'android') {
    console.log('⚠️ 此测试仅在Android平台有效');
    return false;
  }

  try {
    console.log('🔍 检查原生模块是否存在...');
    console.log('📋 原生模块对象:', umInitModule);
    
    if (!umInitModule) {
      console.error('❌ 原生模块对象不存在');
      return false;
    }
    
    if (typeof umInitModule.initUMWithDefault !== 'function') {
      console.error('❌ initUMWithDefault 方法不存在');
      console.log('🔍 可用方法:', Object.keys(umInitModule));
      return false;
    }
    
    console.log('✅ 原生模块检查通过，开始测试...');
    
    // 测试默认初始化方法
    const result = await umInitModule.initUMWithDefault('test_app_key');
    console.log('✅ 测试成功:', result);
    
    return true;
  } catch (error: any) {
    console.error('❌ 测试失败:', error);
    console.error('❌ 错误详情:', error.message);
    console.error('❌ 错误堆栈:', error.stack);
    return false;
  }
};

/**
 * 测试完整参数初始化方法
 */
export const testUMInitWithFullParams = async () => {
  console.log('🧪 开始测试完整参数初始化方法...');
  console.log('📱 当前平台:', Platform.OS);
  
  if (Platform.OS !== 'android') {
    console.log('⚠️ 此测试仅在Android平台有效');
    return false;
  }

  try {
    console.log('🔍 检查原生模块是否存在...');
    
    if (!umInitModule || typeof umInitModule.initUM !== 'function') {
      console.error('❌ 原生模块或initUM方法不存在');
      return false;
    }
    
    console.log('✅ 原生模块检查通过，开始测试...');
    
    const result = await umInitModule.initUM(
      'test_app_key',
      'test_channel',
      1, // DEVICE_TYPE_PHONE
      'test_secret'
    );
    console.log('✅ 完整参数测试成功:', result);
    
    return true;
  } catch (error: any) {
    console.error('❌ 完整参数测试失败:', error);
    console.error('❌ 错误详情:', error.message);
    return false;
  }
};

/**
 * 检查原生模块状态
 */
export const checkUMInitModuleStatus = () => {
  console.log('🔍 检查友盟初始化模块状态...');
  console.log('📱 当前平台:', Platform.OS);
  
  if (Platform.OS !== 'android') {
    console.log('⚠️ 此检查仅在Android平台有效');
    return;
  }
  
  console.log('📋 原生模块对象:', umInitModule);
  
  if (umInitModule) {
    console.log('✅ 原生模块对象存在');
    console.log('🔍 可用方法:', Object.keys(umInitModule));
    
    if (typeof umInitModule.initUMWithDefault === 'function') {
      console.log('✅ initUMWithDefault 方法可用');
    } else {
      console.error('❌ initUMWithDefault 方法不可用');
    }
    
    if (typeof umInitModule.initUM === 'function') {
      console.log('✅ initUM 方法可用');
    } else {
      console.error('❌ initUM 方法不可用');
    }
  } else {
    console.error('❌ 原生模块对象不存在');
  }
};

/**
 * 测试模块可用性
 */
export const testModuleAvailability = async () => {
  console.log('🧪 测试模块可用性...');
  console.log('📱 当前平台:', Platform.OS);
  
  try {
    if (umInitModule && typeof umInitModule.isAvailable === 'function') {
      const isAvailable = await umInitModule.isAvailable();
      console.log('✅ 模块可用性测试成功:', isAvailable);
      return isAvailable;
    } else {
      console.error('❌ isAvailable 方法不存在');
      return false;
    }
  } catch (error: any) {
    console.error('❌ 模块可用性测试失败:', error);
    return false;
  }
}; 