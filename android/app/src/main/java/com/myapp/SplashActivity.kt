package cn.bohe.quanwei // 必须和你的RN项目包名一致！

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
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
import com.yd.saas.ydsdk.manager.YdConfig

// RN项目中继承AppCompatActivity
class SplashActivity : AppCompatActivity() {
  private var llContainer: FrameLayout? = null
  private var ivLogo: ImageView? = null
  private var ydSpread: YdSpread? = null
  private var canJump = false
  private val mainHandler = Handler(Looper.getMainLooper())
  private val AD_TIMEOUT_MS = 3000L // 广告超时时间3秒

  // AD3配置参数（与你项目一致）
  private val SPLASH_AD_KEY = "9f525ca64292750c"
  private val AD3_APP_ID = "c1309807af3901ff"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // 1. 绑定布局：RN项目中必须确保layout/activity_splash.xml存在
    setContentView(R.layout.activity_splash)

    // 3. 初始化AD3 SDK（RN项目中需提前初始化）
    initAD3Sdk()

    // 4. 初始化视图（适配RN项目的资源引用）
    initView()

    // 5. 延迟加载广告（避免布局未绘制完成）
    loadAdWithDelay()

    // 6. 设置广告超时跳转
    setAdTimeoutJump()
  }

  /** 初始化AD3 SDK（RN项目中需手动初始化，无BaseActivity的自动初始化） */
  private fun initAD3Sdk() {
    try {
      // 替换为AD3 SDK的实际初始化方法（根据你的AD3文档调整）
      YdConfig.getInstance().init(this, AD3_APP_ID)
      Toast.makeText(this, "AD3 SDK初始化成功", Toast.LENGTH_SHORT).show()
    } catch (e: Exception) {
      e.printStackTrace()
      Toast.makeText(this, "AD3 SDK初始化失败：${e.message}", Toast.LENGTH_SHORT).show()
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
  }

  /** 延迟加载广告：适配RN项目的布局绘制时序 */
  private fun loadAdWithDelay() {
    mainHandler.postDelayed(
            {
              if (llContainer == null) {
                Toast.makeText(this, "广告容器未找到，直接跳RN主页面", Toast.LENGTH_SHORT).show()
                jumpToRNMain() // 跳转到RN的MainActivity
                return@postDelayed
              }
              loadAd()
            },
            50
    )
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
                                          ?: jumpToRNMain()
                                }
                              }
                      )
                      .setSpreadListener(
                              object : AdViewSpreadListener {
                                override fun onAdDisplay() {
                                  Toast.makeText(this@SplashActivity, "广告展示成功", Toast.LENGTH_SHORT)
                                          .show()
                                }

                                override fun onAdClose() {
                                  Toast.makeText(this@SplashActivity, "广告关闭", Toast.LENGTH_SHORT)
                                          .show()
                                  doJumpToRN() // 跳RN主页面
                                }

                                override fun onAdClick(url: String?) {
                                  Toast.makeText(this@SplashActivity, "广告点击", Toast.LENGTH_SHORT)
                                          .show()
                                }

                                override fun onAdFailed(error: YdError?) {
                                  val errorMsg = error?.msg ?: "未知错误"
                                  Toast.makeText(
                                                  this@SplashActivity,
                                                  "广告加载失败：$errorMsg",
                                                  Toast.LENGTH_SHORT
                                          )
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
      Toast.makeText(this, "广告初始化异常：${e.message}", Toast.LENGTH_SHORT).show()
      jumpToRNMain()
    }
  }

  /** 设置广告超时跳转：RN项目中必须确保超时后跳转到MainActivity */
  private fun setAdTimeoutJump() {
    mainHandler.postDelayed(
            {
              if (!canJump) {
                jumpToRNMain()
              }
            },
            AD_TIMEOUT_MS
    )
  }

  /** 跳转RN主页面 RN的MainActivity */
  private fun jumpToRNMain() {
    if (canJump) return
    canJump = true
    doJumpToRN()
  }

  /** 执行跳转：RN项目的核心是跳转到MainActivity（RN容器） */
  private fun doJumpToRN() {
    mainHandler.removeCallbacksAndMessages(null)
    // 关键：跳转到RN的MainActivity（而非原生的AdsIndexActivity）
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
    mainHandler.removeCallbacksAndMessages(null)
    try {
      ydSpread?.destroy()
    } catch (e: Exception) {
      e.printStackTrace()
    }
    ydSpread = null
  }
}
