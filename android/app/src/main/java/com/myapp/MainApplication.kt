package cn.bohe.quanwei

import android.app.Application
import android.content.Context
import android.util.Log
import cn.bohe.quanwei.common_android.DplusReactPackage
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.yd.saas.ydsdk.manager.YdConfig

class MainApplication : Application(), ReactApplication {
  companion object {
    private const val TAG = "MainApplication"
    private const val PRIVACY_PREF_NAME = "app_prefs"
    private const val PRIVACY_AGREED_KEY = "privacyAgreed"
    private const val AD3_APP_ID = "d26728eb3b9cff9e"

    // SDK 初始化状态标记
    @JvmStatic
    var isAd3SdkInitialized = false
      private set
  }

  override val reactNativeHost: ReactNativeHost =
          object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> {
              Log.d(TAG, "🔧 getPackages() 被调用，开始获取包列表...")

              val packages =
                      PackageList(this).packages.apply {
                        // Packages that cannot be autolinked yet can be added manually here, for
                        // example:
                        // add(MyReactNativePackage())
                        Log.d(TAG, "📦 自动链接的包数量: ${this.size}")

                        Log.d(TAG, "🔧 添加自定义包 DplusReactPackage...")
                        add(DplusReactPackage()) // Example of adding a custom package
                        Log.d(TAG, "✅ DplusReactPackage 添加成功")

                        Log.d(TAG, "🔧 添加隐私协议同步包 PrivacySyncPackage...")
                        add(PrivacySyncPackage()) // 添加隐私协议同步包
                        Log.d(TAG, "✅ PrivacySyncPackage 添加成功")
                      }

              Log.d(TAG, "📦 最终包列表大小: ${packages.size}")
              return packages
            }

            override fun getJSMainModuleName(): String = "index"

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
          }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    Log.d(TAG, "🚀 MainApplication.onCreate() 开始执行")

    Log.d(TAG, "🔧 加载React Native...")
    loadReactNative(this)
    Log.d(TAG, "✅ React Native 加载完成")

    Log.d(TAG, "🔧 初始化SoLoader...")
    SoLoader.init(this, /* native exopackage */ false)
    Log.d(TAG, "✅ SoLoader 初始化完成")

    // 检查隐私协议状态，如果已同意则初始化AD3 SDK
    checkPrivacyAndInitSdk()

    Log.d(TAG, "📝 注意：友盟SDK将在用户同意隐私政策后通过React Native模块初始化")
    Log.d(TAG, "🎉 MainApplication.onCreate() 执行完成")

    // 移除直接初始化友盟SDK的代码，改为在用户同意隐私政策后调用
    // RNUMConfigure.init(this, "6880b713bc47b67d83bb56bc", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,
    // null);
  }

  /** 检查隐私协议状态并初始化AD3 SDK */
  private fun checkPrivacyAndInitSdk() {
    val privacySP = getSharedPreferences(PRIVACY_PREF_NAME, Context.MODE_PRIVATE)
    val isAgreed = privacySP.getBoolean(PRIVACY_AGREED_KEY, false)

    if (isAgreed) {
      Log.d(TAG, "✅ 用户已同意隐私协议，开始初始化AD3 SDK...")
      initAD3Sdk()
    } else {
      Log.d(TAG, "📝 用户未同意隐私协议，跳过AD3 SDK初始化")
      isAd3SdkInitialized = false
    }
  }

  /** 初始化AD3 SDK */
  private fun initAD3Sdk() {
    try {
      YdConfig.getInstance().init(this, AD3_APP_ID, "default", true)
      isAd3SdkInitialized = true
      Log.d(TAG, "✅ AD3 SDK 初始化成功")
    } catch (e: Exception) {
      Log.e(TAG, "❌ AD3 SDK 初始化失败", e)
      isAd3SdkInitialized = false
    }
  }
}
