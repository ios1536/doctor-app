package cn.bohe.quanwei

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.ArrayList

/** 隐私协议同步模块的包注册类 必须实现ReactPackage，将PrivacySyncModule加入RN原生模块列表 */
class PrivacySyncPackage : ReactPackage {
  /** 注册原生模块（核心） */
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    val modules = ArrayList<NativeModule>()
    // 将PrivacySyncModule添加到模块列表
    modules.add(PrivacySyncModule(reactContext))
    return modules
  }

  /** 注册自定义视图（本模块无自定义视图，返回空列表即可） */
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
