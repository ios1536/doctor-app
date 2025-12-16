import { NativeModules } from 'react-native';

interface UMInitModuleInterface {
  /**
   * 初始化友盟SDK（完整参数）
   * @param appKey 友盟应用Key
   * @param channel 渠道名称
   * @param deviceType 设备类型
   * @param secret 友盟应用Secret
   * @returns Promise<string> 初始化结果
   */
  initUM(appKey: string, channel: string, deviceType: number, secret: string | null): Promise<string>;

  /**
   * 初始化友盟SDK（使用默认参数）
   * @param appKey 友盟应用Key
   * @returns Promise<string> 初始化结果
   */
  initUMWithDefault(appKey: string): Promise<string>;
  
  /**
   * 初始化芒果广告SDK TODO 优化时单独拿出来写一个单独的模块文件
   * @returns Promise<string> 初始化结果
   */
  initializeADSDK(): Promise<string>;
}

// 获取原生模块
const { UMInitModule } = NativeModules;

// 类型断言确保模块存在
const umInitModule = UMInitModule as UMInitModuleInterface;

export default umInitModule;
export type { UMInitModuleInterface };