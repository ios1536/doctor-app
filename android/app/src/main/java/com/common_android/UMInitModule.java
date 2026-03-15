package cn.bohe.quanwei.common_android;

import android.content.Context;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.umeng.commonsdk.UMConfigure;
import android.app.Application;

/**
 * 友盟SDK初始化模块
 * 用于在用户同意隐私政策后初始化友盟SDK
 */
public class UMInitModule extends ReactContextBaseJavaModule {
    private static final String TAG = "UMInitModule";
    private ReactApplicationContext context;
   

    public UMInitModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        Log.d(TAG, "🔧 UMInitModule 构造函数被调用，context: " + (context != null ? "有效" : "无效"));
    }

    @Override
    public String getName() {
        Log.d(TAG, "📱 getName() 被调用，返回模块名称: UMInitModule");
        return "UMInitModule";
    }

    /**
     * 初始化友盟SDK
     * 
     * @param appKey     友盟应用Key
     * @param channel    渠道名称
     * @param deviceType 设备类型
     * @param secret     友盟应用Secret
     * @param promise    Promise回调
     */
    @ReactMethod
    public void initUM(String appKey, String channel, int deviceType, String secret, Promise promise) {
        Log.d(TAG, "🚀 initUM() 方法被调用");
        Log.d(TAG, "📋 参数详情:");
        Log.d(TAG, "   - appKey: " + appKey);
        Log.d(TAG, "   - channel: " + channel);
        Log.d(TAG, "   - deviceType: " + deviceType);
        Log.d(TAG, "   - secret: " + (secret != null ? secret : "null"));

        try {
            Log.d(TAG, "🔧 开始调用 RNUMConfigure.init()...");

            // 调用RNUMConfigure进行初始化
            RNUMConfigure.init(context, appKey, channel, deviceType, secret);
            Log.d(TAG, "✅ RNUMConfigure.init() 调用成功");

            // 设置日志加密
            Log.d(TAG, "🔐 设置日志加密...");
            UMConfigure.setEncryptEnabled(true);
            Log.d(TAG, "✅ 日志加密设置成功");

            // 设置日志级别（开发环境）
            Log.d(TAG, "📝 设置日志级别...");
            UMConfigure.setLogEnabled(true);
            Log.d(TAG, "✅ 日志级别设置成功");

            // 返回成功结果
            String successMsg = "友盟SDK初始化成功 - appKey: " + appKey + ", channel: " + channel;
            Log.d(TAG, "🎉 初始化完成: " + successMsg);
            promise.resolve(successMsg);

        } catch (Exception e) {
            Log.e(TAG, "❌ 友盟SDK初始化失败", e);
            Log.e(TAG, "❌ 错误详情: " + e.getMessage());
            Log.e(TAG, "❌ 错误类型: " + e.getClass().getSimpleName());

            // 返回错误信息
            String errorMsg = "友盟SDK初始化失败: " + e.getMessage();
            promise.reject("INIT_ERROR", errorMsg, e);
        }
    }

    /**
     * 简化版初始化方法，使用默认参数
     * 
     * @param appKey  友盟应用Key
     * @param promise Promise回调
     */
    @ReactMethod
    public void initUMWithDefault(String appKey, Promise promise) {
        Log.d(TAG, "🚀 initUMWithDefault() 方法被调用");
        Log.d(TAG, "📋 参数详情:");
        Log.d(TAG, "   - appKey: " + appKey);

        try {
            // 使用默认参数初始化
            String channel = "Umeng";
            int deviceType = UMConfigure.DEVICE_TYPE_PHONE;
            String secret = null;

            Log.d(TAG, "🔧 使用默认参数:");
            Log.d(TAG, "   - channel: " + channel);
            Log.d(TAG, "   - deviceType: " + deviceType);
            Log.d(TAG, "   - secret: " + (secret != null ? secret : "null"));

            Log.d(TAG, "🔧 开始调用 RNUMConfigure.init()...");

            RNUMConfigure.init(context, appKey, channel, deviceType, secret);
            Log.d(TAG, "✅ RNUMConfigure.init() 调用成功");

            // 设置日志加密
            Log.d(TAG, "🔐 设置日志加密...");
            UMConfigure.setEncryptEnabled(true);
            Log.d(TAG, "✅ 日志加密设置成功");

            // 设置日志级别（开发环境）
            Log.d(TAG, "📝 设置日志级别...");
            UMConfigure.setLogEnabled(true);
            Log.d(TAG, "✅ 日志级别设置成功");

            // 验证初始化状态（移除不存在的方法调用）
            Log.d(TAG, "🔍 初始化配置完成，友盟SDK已准备就绪");

            // 返回成功结果
            String successMsg = "友盟SDK初始化成功 - appKey: " + appKey + ", channel: " + channel;
            Log.d(TAG, "🎉 初始化完成: " + successMsg);
            promise.resolve(successMsg);

        } catch (Exception e) {
            Log.e(TAG, "❌ 友盟SDK初始化失败", e);
            Log.e(TAG, "❌ 错误详情: " + e.getMessage());
            Log.e(TAG, "❌ 错误类型: " + e.getClass().getSimpleName());
            Log.e(TAG, "❌ 错误堆栈:", e);

            // 返回错误信息
            String errorMsg = "友盟SDK初始化失败: " + e.getMessage();
            promise.reject("INIT_ERROR", errorMsg, e);
        }
    }
}