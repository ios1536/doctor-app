This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Doctor App

## 深度链接测试

### 支持的链接格式

1. **自定义协议格式**：
   ```
   bohe://open?query=https://example.com
   bohe://open?query=https%3A%2F%2Fm.fh21.com.cn%2Fnews%2Flist%2F7618%2F
   ```

2. **HTTPS域名格式**：
   ```
   https://m.bohe.cn/open?url=https://example.com&title=网页标题
   https://m.fh21.com.cn/open?url=https://example.com&title=网页标题
   https://s.fh21.com.cn/open?url=https://example.com&title=网页标题
   https://g.fh21.com.cn/open?url=https://example.com&title=网页标题
   https://wap.fh21.com.cn/open?url=https://example.com&title=网页标题
   ```

3. **HTTP测试环境格式**：
   ```
   http://m.sandbox.bohe.cn/open?url=https://example.com&title=网页标题
   http://m.sandbox.fh21.com.cn/open?url=https://example.com&title=网页标题
   ```

### 测试方法

#### Android测试

1. **使用adb命令测试**：
   ```bash
   # 测试自定义协议
   adb shell am start -W -a android.intent.action.VIEW -d "bohe://open?query=https://www.baidu.com" cn.bohe.quanwei
   
   # 测试真实URL（URL编码）
   adb shell am start -W -a android.intent.action.VIEW -d "bohe://open?query=https%3A%2F%2Fm.fh21.com.cn%2Fnews%2Flist%2F7618%2F" cn.bohe.quanwei
   
   # 测试HTTPS链接
   adb shell am start -W -a android.intent.action.VIEW -d "https://m.bohe.cn/open?url=https://www.baidu.com&title=百度" cn.bohe.quanwei
   ```

2. **在浏览器中测试**：
   - 在手机浏览器中输入：`bohe://open?query=https://www.baidu.com`
   - 或者输入：`bohe://open?query=https%3A%2F%2Fm.fh21.com.cn%2Fnews%2Flist%2F7618%2F`
   - 或者输入：`https://m.bohe.cn/open?url=https://www.baidu.com&title=百度`

#### iOS测试

1. **使用Safari测试**：
   - 在Safari中输入：`bohe://open?query=https://www.baidu.com`
   - 或者输入：`bohe://open?query=https%3A%2F%2Fm.fh21.com.cn%2Fnews%2Flist%2F7618%2F`
   - 或者输入：`https://m.bohe.cn/open?url=https://www.baidu.com&title=百度`

2. **使用Xcode模拟器测试**：
   ```bash
   # 在Xcode模拟器中打开Safari，输入以下链接：
   bohe://open?query=https://www.baidu.com
   bohe://open?query=https%3A%2F%2Fm.fh21.com.cn%2Fnews%2Flist%2F7618%2F
   https://m.bohe.cn/open?url=https://www.baidu.com&title=百度
   ```

3. **使用xcrun命令测试**（需要真机）：
   ```bash
   xcrun simctl openurl booted "bohe://open?query=https://www.baidu.com"
   xcrun simctl openurl booted "bohe://open?query=https%3A%2F%2Fm.fh21.com.cn%2Fnews%2Flist%2F7618%2F"
   ```

### 功能说明

- 当用户点击支持的链接时，应用会自动打开并跳转到WebView页面
- 对于 `bohe://` 协议，会从 `query` 参数中获取目标URL
- 对于HTTPS/HTTP链接，会从 `url` 参数中获取目标URL，从 `title` 参数中获取页面标题
- 如果应用未安装，会提示用户下载应用

### 调试信息

应用会在控制台输出详细的调试信息：
- 收到的深度链接URL
- 解析的URL信息（协议、主机、路径、查询参数）
- 跳转的目标URL和标题
- 导航状态信息

### iOS Universal Links 配置

对于HTTPS链接（如 `https://m.bohe.cn/open?url=...`），需要在iOS项目中配置Associated Domains：

1. **在Xcode中配置**：
   - 打开项目设置
   - 选择 "Signing & Capabilities"
   - 点击 "+ Capability"
   - 添加 "Associated Domains"
   - 添加域名：`applinks:m.bohe.cn`

2. **在服务器端配置**：
   在 `https://m.bohe.cn/.well-known/apple-app-site-association` 文件中添加：
   ```json
   {
     "applinks": {
       "apps": [],
       "details": [
         {
           "appID": "TEAM_ID.cn.bohe.quanwei",
           "paths": ["/open*"]
         }
       ]
     }
   }
   ```

### 注意事项

1. 确保目标URL是有效的
2. 对于HTTPS链接，需要确保域名已正确配置在AndroidManifest.xml中
3. 对于iOS Universal Links，需要配置Associated Domains和服务器端文件
4. 测试时建议使用简单的URL（如百度首页）进行验证
5. iOS和Android都支持 `bohe://` 自定义协议
