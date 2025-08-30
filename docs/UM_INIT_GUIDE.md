# 友盟SDK初始化指南

## 概述

本项目已经实现了通过 React Native 调用 Android 原生方法来初始化友盟 SDK，这样可以确保初始化更加可靠和稳定。

## 架构说明

### 原生模块 (Android)

1. **UMInitModule.java** - 友盟SDK初始化模块
   - 提供 `initUM()` 方法：完整参数初始化
   - 提供 `initUMWithDefault()` 方法：使用默认参数初始化

2. **RNUMConfigure.java** - 友盟SDK配置工具类
   - 处理React Native特定的配置
   - 设置包装器类型

3. **DplusReactPackage.java** - React Native包注册
   - 注册所有原生模块到React Native

### React Native 模块

1. **UMInitModule.ts** - TypeScript类型定义
   - 定义原生模块的接口
   - 提供类型安全的调用方法

2. **App.tsx** - 主应用文件
   - 在用户同意隐私政策后调用初始化
   - 支持Android和iOS双平台

## 使用方法

### 1. 自动初始化（推荐）

在 `App.tsx` 中，当用户同意隐私政策后，系统会自动调用初始化：

```typescript
const handlePrivacyAgree = async () => {
  // ... 保存用户同意状态
  await initializeSDK(); // 自动调用原生模块初始化
};
```

### 2. 手动初始化

如果需要手动初始化，可以这样调用：

```typescript
import umInitModule from './src/types/UMInitModule';

// 使用默认参数初始化
try {
  const result = await umInitModule.initUMWithDefault('your_app_key');
  console.log('初始化成功:', result);
} catch (error) {
  console.error('初始化失败:', error);
}

// 使用完整参数初始化
try {
  const result = await umInitModule.initUM(
    'your_app_key',
    'your_channel',
    1, // DEVICE_TYPE_PHONE
    'your_secret'
  );
  console.log('初始化成功:', result);
} catch (error) {
  console.error('初始化失败:', error);
}
```

## 平台差异

### Android
- 使用原生模块 `UMInitModule` 进行初始化
- 如果原生模块失败，会自动回退到JavaScript模块
- 支持完整的友盟SDK功能

### iOS
- 继续使用原有的JavaScript模块 `AnalyticsUtil`
- 保持向后兼容性

## 错误处理

系统实现了多层错误处理：

1. **原生模块初始化失败** → 自动回退到JavaScript模块
2. **JavaScript模块也失败** → 记录错误日志，不影响应用运行
3. **网络问题** → 重试机制和错误提示

## 测试

可以使用提供的测试函数来验证模块是否正常工作：

```typescript
import { testUMInitModule, testUMInitWithFullParams } from './src/utils/umInitTest';

// 测试默认初始化
await testUMInitModule();

// 测试完整参数初始化
await testUMInitWithFullParams();
```

## 注意事项

1. **权限要求**：确保应用有网络访问权限
2. **隐私合规**：必须在用户同意隐私政策后才能初始化
3. **网络环境**：某些网络环境可能需要特殊配置
4. **版本兼容**：确保友盟SDK版本与项目兼容

## 故障排除

### 常见问题

1. **模块未找到**
   - 检查 `DplusReactPackage` 是否正确注册
   - 重新构建Android项目

2. **初始化失败**
   - 检查网络连接
   - 验证AppKey是否正确
   - 查看Android日志获取详细错误信息

3. **权限问题**
   - 确保 `AndroidManifest.xml` 包含必要权限
   - 检查运行时权限是否已授予

### 调试步骤

1. 在Android Studio中查看Logcat日志
2. 使用 `adb logcat` 命令查看设备日志
3. 在React Native代码中添加更多日志输出
4. 使用测试函数验证模块功能

## 更新日志

- **v1.0.0** - 初始版本，支持Android原生模块初始化
- **v1.1.0** - 添加错误处理和回退机制
- **v1.2.0** - 支持完整参数初始化方法 