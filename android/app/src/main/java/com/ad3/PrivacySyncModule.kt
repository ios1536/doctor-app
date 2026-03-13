package cn.bohe.quanwei

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/** RN与原生隐私协议状态同步模块 提供RN端调用的方法，将隐私协议状态同步到原生SharedPreferences 与SplashActivity使用相同的SP存储，确保状态一致 */
class PrivacySyncModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {
  // 与SplashActivity一致的SP配置（必须完全相同）
  private val PRIVACY_PREF_NAME = "app_prefs"
  private val PRIVACY_AGREED_KEY = "privacyAgreed"
  private lateinit var privacySP: SharedPreferences

  init {
    // 初始化SharedPreferences
    privacySP = reactContext.getSharedPreferences(PRIVACY_PREF_NAME, Context.MODE_PRIVATE)
  }

  /** 模块名称：RN端通过NativeModules.PrivacySyncModule调用，必须与这里一致 */
  override fun getName(): String {
    return "PrivacySyncModule"
  }

  /**
   * RN端调用的方法：设置隐私协议同意状态
   * @param isAgreed 是否同意（Boolean）
   * @param promise 回调RN端执行结果
   */
  @ReactMethod
  fun setPrivacyAgreed(isAgreed: Boolean, promise: Promise) {
    try {
      // 将状态写入SP
      privacySP.edit().putBoolean(PRIVACY_AGREED_KEY, isAgreed).apply()
      // 回调RN端成功，返回状态
      promise.resolve("隐私协议状态同步成功，当前状态：$isAgreed")
    } catch (e: Exception) {
      // 回调RN端失败，返回错误信息
      promise.reject("SYNC_ERROR", "隐私协议状态同步失败：${e.message}")
    }
  }

  /**
   * 可选：RN端调用的方法，获取原生当前的隐私协议状态 用于RN端校验状态是否同步成功
   * @param promise 回调RN端当前状态
   */
  @ReactMethod
  fun getPrivacyAgreed(promise: Promise) {
    try {
      val isAgreed = privacySP.getBoolean(PRIVACY_AGREED_KEY, false)
      promise.resolve(isAgreed)
    } catch (e: Exception) {
      promise.reject("GET_ERROR", "获取隐私协议状态失败：${e.message}")
    }
  }
}
