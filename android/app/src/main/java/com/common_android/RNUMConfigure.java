package cn.bohe.quanwei.common_android;

import android.util.Log;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build.VERSION_CODES;
import com.umeng.commonsdk.UMConfigure;

/**
 * Created by wangfei on 17/9/14.
 */

public class RNUMConfigure {
    private static final String TAG = "RNUMConfigure";

    public static void init(Context context, String appkey, String channel, int type, String secret) {
        Log.d(TAG, "🚀 RNUMConfigure.init() 开始执行");
        Log.d(TAG, "📋 参数详情:");
        Log.d(TAG, "   - context: " + (context != null ? "有效" : "无效"));
        Log.d(TAG, "   - appkey: " + appkey);
        Log.d(TAG, "   - channel: " + channel);
        Log.d(TAG, "   - type: " + type);
        Log.d(TAG, "   - secret: " + (secret != null ? secret : "null"));

        try {
            Log.d(TAG, "🔧 开始设置React Native包装器类型...");
            initRN("react-native", "2.0");
            Log.d(TAG, "✅ React Native包装器类型设置成功");

            Log.d(TAG, "🔧 开始调用UMConfigure.init()...");
            UMConfigure.init(context, appkey, channel, type, secret);
            Log.d(TAG, "✅ UMConfigure.init() 调用成功");

            Log.d(TAG, "🎉 RNUMConfigure.init() 执行完成");

        } catch (Exception e) {
            Log.e(TAG, "❌ RNUMConfigure.init() 执行失败", e);
            Log.e(TAG, "❌ 错误详情: " + e.getMessage());
            throw e; // 重新抛出异常，让上层处理
        }
    }

    @TargetApi(VERSION_CODES.KITKAT)
    private static void initRN(String v, String t) {
        Log.d(TAG, "🔧 initRN() 开始执行");
        Log.d(TAG, "📋 参数详情:");
        Log.d(TAG, "   - v: " + v);
        Log.d(TAG, "   - t: " + t);

        Method method = null;
        try {
            Log.d(TAG, "🔍 查找UMConfigure类...");
            Class<?> config = Class.forName("com.umeng.commonsdk.UMConfigure");
            Log.d(TAG, "✅ 找到UMConfigure类: " + config.getName());

            Log.d(TAG, "🔍 查找setWraperType方法...");
            method = config.getDeclaredMethod("setWraperType", String.class, String.class);
            Log.d(TAG, "✅ 找到setWraperType方法: " + method.getName());

            Log.d(TAG, "🔧 设置方法可访问...");
            method.setAccessible(true);
            Log.d(TAG, "✅ 方法可访问性设置成功");

            Log.d(TAG, "🔧 调用setWraperType方法...");
            method.invoke(null, v, t);
            Log.d(TAG, "✅ setWraperType方法调用成功");

            Log.d(TAG, "🎉 initRN() 执行完成");

        } catch (NoSuchMethodException e) {
            Log.e(TAG, "❌ 找不到setWraperType方法", e);
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            Log.e(TAG, "❌ 调用setWraperType方法失败", e);
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            Log.e(TAG, "❌ 访问setWraperType方法失败", e);
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            Log.e(TAG, "❌ 找不到UMConfigure类", e);
            e.printStackTrace();
        }
    }
}
