package cn.bohe.quanwei

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import cn.bohe.quanwei.common_android.DplusReactPackage
import com.facebook.soloader.SoLoader
import com.umeng.commonsdk.UMConfigure
import com.umeng.commonsdk.UMConfigure.DEVICE_TYPE_PHONE
import cn.bohe.quanwei.common_android.RNUMConfigure

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
              add(DplusReactPackage()) // Example of adding a custom package
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
    loadReactNative(this)
    SoLoader.init(this, /* native exopackage */ false);
    RNUMConfigure.init(this, "6880b713bc47b67d83bb56bc", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,
            null);
    //6880b713bc47b67d83bb56bc
  }
}
