# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# SDK所需的混淆规则
-keep class com.theme.**{*;}
-keep class ijiami_sdk_enc.**{*;}
-keep class essos.com.**{*;}
-keep class com.a.a.**{*;}
-keep class com.android.**{*;}
-keep class com.huawei.**{*;}
-keep class com.hihonor.**{*;}
-keep class **.R$* {
    *;
}
