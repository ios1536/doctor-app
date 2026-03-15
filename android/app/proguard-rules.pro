# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:


# AD3核心混淆规则，必加
-keep class com.yd.** {*;}
# 桥接模块不混淆（防止RN找不到）
-keep class cn.bohe.quanwei.ad3.AD3SplashModule {*;}
-keep class cn.bohe.quanwei.ad3.AD3SplashPackage {*;}
-keep class cn.bohe.quanwei.ad3.AD3SplashManager {*;}
