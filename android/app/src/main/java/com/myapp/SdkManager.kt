package cn.bohe.quanwei

import android.app.Application
import android.util.Log
import com.theme.thrones.SspApi

/**
 * SDK管理工具类
 * 负责初始化第三方SDK
 */
object SdkManager {
    private const val TAG = "SdkManager"
    private const val CHANNEL_ID = "jd_sdk_acc2" // 请替换为实际的渠道账号

    /**
     * 初始化SDK
     * 应在用户同意隐私政策后调用
     */
    fun init(application: Application) {
        try {
            Log.d(TAG, "开始初始化SDK...")
            
            // 初始化SspApi
            initSspApi(application)
            
            Log.d(TAG, "SDK初始化完成")
        } catch (e: Exception) {
            Log.e(TAG, "SDK初始化失败: ${e.message}", e)
        }
    }

    /**
     * 初始化SspApi
     */
    private fun initSspApi(application: Application) {
        Log.d(TAG, "开始初始化SspApi - 使用sspwlthsdk-1.0.7库")
        try {
            SspApi.getInstance().lm_mid = CHANNEL_ID // 设置渠道账号
            SspApi.getInstance().init(application)// 直接调用init方法，无需手动设置渠道账号
            Log.d(TAG, "SspApi初始化成功")
            
        } catch (e: ClassNotFoundException) {
            Log.e(TAG, "❌ SspApi类未找到，SDK可能未正确集成", e)
            Log.e(TAG, "❌ 请检查libs目录下是否有sspwlthsdk-1.0.7.aar文件")
        } catch (e: NoSuchMethodException) {
            Log.e(TAG, "❌ SspApi方法未找到，SDK版本可能不匹配", e)
            Log.e(TAG, "❌ 请确认SDK版本为1.0.7，并且方法签名正确")
        } catch (e: Exception) {
            Log.e(TAG, "❌ SspApi初始化失败", e)
            Log.e(TAG, "❌ 详细错误: ${e.message}")
            // 记录错误但不抛出异常，避免影响应用启动
        }
    }
}