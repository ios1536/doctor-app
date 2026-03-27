package cn.bohe.quanwei // 必须和你的RN项目包名一致！

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.yd.saas.base.interfaces.AdViewSpreadListener
import com.yd.saas.base.interfaces.SpreadLoadListener
import com.yd.saas.base.interfaces.SpreadLoadListener.SpreadAd
import com.yd.saas.config.exception.YdError
import com.yd.saas.ydsdk.YdSpread

// RN项目中继承AppCompatActivity
class SplashActivity : AppCompatActivity() {
  private var llContainer: FrameLayout? = null
  private var ivLogo: ImageView? = null
  private var ydSpread: YdSpread? = null
  private var canJump = false

  // AD3配置参数（与你项目一致）
  private val SPLASH_AD_KEY = "f8d58b244b5c6e1b"

  private val PRIVACY_PREF_NAME = "app_prefs"
  private val PRIVACY_AGREED_KEY = "privacyAgreed"
  private lateinit var privacySP: SharedPreferences
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_splash)

    // 初始化隐私协议存储（与RN项目共用SharedPreferences，状态同步）
    initPrivacySP()

    // 先判断隐私协议状态
    checkPrivacyAgreement()
  }

  /** 初始化隐私协议存储（与RN项目保持一致，确保状态同步） */
  private fun initPrivacySP() {
    // 与RN的AsyncStorage不同，原生使用SharedPreferences存储，需确保RN端也同步该状态
    privacySP = getSharedPreferences(PRIVACY_PREF_NAME, Context.MODE_PRIVATE)
  }

  /** 核心新增：检查隐私协议状态 */
  private fun checkPrivacyAgreement() {
    val isAgreed = privacySP.getBoolean(PRIVACY_AGREED_KEY, false)
    if (isAgreed) {
      // 已同意隐私协议：检查SDK是否已初始化，然后加载广告
      // Toast.makeText(this, "已同意隐私协议，检查SDK状态并加载开屏广告", Toast.LENGTH_SHORT).show()

      // 初始化视图（适配RN项目的资源引用）
      initView()
    } else {
      doJumpToRN()
    }
  }

  /** 初始化视图：适配RN项目的资源ID引用 */
  private fun initView() {
    // 关键：确保R.id.ll_container和R.id.iv_logo与activity_splash.xml中的ID一致
    llContainer = findViewById<FrameLayout>(R.id.ll_container)
    ivLogo = findViewById<ImageView>(R.id.iv_logo)

    // RN项目中若没有自定义Logo，使用应用图标替代
    ivLogo?.setImageResource(R.mipmap.ic_launcher)
            ?: run { Toast.makeText(this, "Logo视图未找到，不影响广告展示", Toast.LENGTH_SHORT).show() }
    llContainer?.post {
      if (llContainer == null) {
        doJumpToRN() // 跳转到RN的MainActivity
        return@post
      }

      // 检查是否同意隐私协议
      val isAgreed = privacySP.getBoolean(PRIVACY_AGREED_KEY, false)
      if (!isAgreed) {
        doJumpToRN()
        return@post
      }

      // 检查 SDK 是否已在 MainApplication 中初始化
      if (!MainApplication.isAd3SdkInitialized) {
        doJumpToRN()
        return@post
      }

      loadAd()
    }
  }

  /** 加载开屏广告：适配RN项目的广告加载逻辑 */
  private fun loadAd() {
    try {
      ydSpread =
              YdSpread.Builder(this)
                      .setKey(SPLASH_AD_KEY) // 你的开屏广告位ID
                      .setSpreadLoadListener(
                              object : SpreadLoadListener {
                                override fun onADLoaded(spreadAd: SpreadAd) {
                                  // 广告加载成功：显示到容器（RN项目中需判空）
                                  llContainer?.let {
                                    spreadAd.show(it)
                                    ivLogo?.visibility = View.GONE // 隐藏Logo
                                  }
                                          ?: doJumpToRN()
                                }
                              }
                      )
                      .setSpreadListener(
                              object : AdViewSpreadListener {
                                override fun onAdDisplay() {}

                                override fun onAdClose() {
                                  jumpToRNMain() // 跳RN主页面
                                }

                                override fun onAdClick(url: String?) {}

                                override fun onAdFailed(error: YdError?) {
                                  val errorCode = error?.code ?: -1
                                  val errorMsg = error?.msg ?: "未知错误"
                                  val fullError = "广告加载失败 [错误码:$errorCode]: $errorMsg"

                                  Toast.makeText(this@SplashActivity, fullError, Toast.LENGTH_LONG)
                                          .show()

                                  doJumpToRN() // 跳转到RN的MainActivity
                                }
                              }
                      )
                      .build()
      // 发起广告请求
      ydSpread?.requestSpread()
    } catch (e: Exception) {
      e.printStackTrace()
      doJumpToRN()
    }
  }

  /** 跳转RN主页面 RN的MainActivity */
  private fun jumpToRNMain() {
    if (canJump) {
      doJumpToRN()
    } else {
      canJump = true
    }
  }

  /** 执行跳转：RN项目的核心是跳转到MainActivity（RN容器） */
  private fun doJumpToRN() {
    val intent = Intent(this, MainActivity::class.java)
    startActivity(intent)
    finish() // 关闭开屏页
  }

  /** 拦截返回键：RN项目中仅拦截返回键，不拦截Home键 */
  override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
    if (keyCode == KeyEvent.KEYCODE_BACK) {
      return true
    }
    return super.onKeyDown(keyCode, event)
  }

  override fun onPause() {
    super.onPause()
    canJump = false
  }

  override fun onResume() {
    super.onResume()
    if (canJump) {
      doJumpToRN()
    }
    canJump = true
  }

  /** 销毁资源：RN项目中必须清除所有任务，避免内存泄漏 */
  override fun onDestroy() {
    super.onDestroy()
    try {
      ydSpread?.destroy()
    } catch (e: Exception) {
      e.printStackTrace()
    }
    ydSpread = null
  }
}
