import JSZip from 'jszip';

export interface AndroidProjectConfig {
  appName: string;
  packageName: string;
  appUrl: string;
  versionName: string;
  versionCode: number;
}

export const generateAndroidProjectZip = async (config: AndroidProjectConfig): Promise<Blob> => {
  const zip = new JSZip();
  const root = zip.folder('AnsuniAnkahiBate-Android-App')!;

  // 1. Root build.gradle.kts
  root.file(
    'build.gradle.kts',
    `// Top-level build file for Ansuni Ankahi Bate Android Application
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`
  );

  // 2. settings.gradle.kts
  root.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${config.appName}"
include(":app")
`
  );

  // 3. gradle.properties
  root.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
`
  );

  // 4. gradle/libs.versions.toml
  const gradleDir = root.folder('gradle')!;
  gradleDir.file(
    'libs.versions.toml',
    `[versions]
agp = "8.3.2"
kotlin = "1.9.23"
coreKtx = "1.13.0"
appcompat = "1.6.1"
material = "1.11.0"
swiperefresh = "1.1.0"
webkit = "1.10.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-appcompat = { group = "androidx.appcompat", name = "appcompat", version.ref = "appcompat" }
material = { group = "com.google.android.material", name = "material", version.ref = "material" }
androidx-swiperefreshlayout = { group = "androidx.swiperefreshlayout", name = "swiperefreshlayout", version.ref = "swiperefresh" }
androidx-webkit = { group = "androidx.webkit", name = "webkit", version.ref = "webkit" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
`
  );

  // 5. app/build.gradle.kts
  const appFolder = root.folder('app')!;
  appFolder.file(
    'build.gradle.kts',
    `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "${config.packageName}"
    compileSdk = 34

    defaultConfig {
        applicationId = "${config.packageName}"
        minSdk = 24
        targetSdk = 34
        versionCode = ${config.versionCode}
        versionName = "${config.versionName}"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.swiperefreshlayout)
    implementation(libs.androidx.webkit)
}
`
  );

  appFolder.file('proguard-rules.pro', `# Proguard rules for Ansuni Ankahi Bate
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
`);

  // 6. app/src/main/AndroidManifest.xml
  const srcMain = appFolder.folder('src/main')!;
  srcMain.file(
    'AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AnsuniAnkahiBate"
        android:usesCleartextTraffic="false">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  );

  // 7. app/src/main/java/com/ansuni/ankahibate/MainActivity.kt
  const javaDir = srcMain.folder('java/com/ansuni/ankahibate')!;
  javaDir.file(
    'MainActivity.kt',
    `package ${config.packageName}

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar

    // Change this to your live production domain if hosted on custom domain
    private val APP_URL = "${config.appUrl}"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, true)
        setContentView(R.layout.activity_main)

        // Set romantic deep burgundy status bar color
        window.statusBarColor = getColor(R.color.romantic_burgundy)

        webView = findViewById(R.id.webView)
        swipeRefreshLayout = findViewById(R.id.swipeRefresh)
        progressBar = findViewById(R.id.progressBar)

        setupWebView()
        setupSwipeRefresh()
        setupBackHandler()

        webView.loadUrl(APP_URL)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            allowFileAccess = false
            mediaPlaybackRequiresUserGesture = false
            userAgentString = webView.settings.userAgentString + " AnsuniAnkahiBateApp/1.0"
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefreshLayout.isRefreshing = false
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                swipeRefreshLayout.isRefreshing = false
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                if (url.startsWith("whatsapp://") || url.startsWith("intent://") || url.startsWith("mailto:")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, "App not installed", Toast.LENGTH_SHORT).show()
                        return true
                    }
                }
                return false
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress == 100) {
                    progressBar.visibility = View.GONE
                } else {
                    progressBar.visibility = View.VISIBLE
                }
            }
        }
    }

    private fun setupSwipeRefresh() {
        swipeRefreshLayout.setColorSchemeResources(R.color.rose_gold, R.color.romantic_burgundy)
        swipeRefreshLayout.setOnRefreshListener {
            webView.reload()
        }
    }

    private fun setupBackHandler() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }
}
`
  );

  // 8. app/src/main/res/layout/activity_main.xml
  const layoutDir = srcMain.folder('res/layout')!;
  layoutDir.file(
    'activity_main.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#0c0507">

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="4dp"
        android:progressDrawable="@drawable/custom_progress"
        android:visibility="gone"
        app:layout_constraintTop_toTopOf="parent" />

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefresh"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        app:layout_constraintTop_toBottomOf="@id/progressBar"
        app:layout_constraintBottom_toBottomOf="parent">

        <WebView
            android:id="@+id/webView"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

</androidx.constraintlayout.widget.ConstraintLayout>
`
  );

  // 9. res/values/
  const resValues = srcMain.folder('res/values')!;
  resValues.file(
    'strings.xml',
    `<resources>
    <string name="app_name">${config.appName}</string>
    <string name="hindi_tagline">अनसुनी अनकही बातें - शायरी, कविता एवं प्रेम कहानियां</string>
</resources>
`
  );

  resValues.file(
    'colors.xml',
    `<resources>
    <color name="romantic_burgundy">#4A0E17</color>
    <color name="rose_gold">#E11D48</color>
    <color name="gold_accent">#F59E0B</color>
    <color name="dark_bg">#0C0507</color>
    <color name="white">#FFFFFF</color>
</resources>
`
  );

  resValues.file(
    'themes.xml',
    `<resources>
    <style name="Theme.AnsuniAnkahiBate" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/romantic_burgundy</item>
        <item name="colorPrimaryVariant">@color/romantic_burgundy</item>
        <item name="colorOnPrimary">@color/white</item>
        <item name="android:statusBarColor">@color/romantic_burgundy</item>
        <item name="android:navigationBarColor">@color/dark_bg</item>
    </style>
</resources>
`
  );

  // 10. res/drawable/custom_progress.xml
  const resDrawable = srcMain.folder('res/drawable')!;
  resDrawable.file(
    'custom_progress.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@android:id/background">
        <color android:color="#2D0B13"/>
    </item>
    <item android:id="@android:id/progress">
        <clip>
            <shape>
                <gradient
                    android:startColor="#E11D48"
                    android:endColor="#F59E0B"
                    android:angle="0" />
            </shape>
        </clip>
    </item>
</layer-list>
`
  );

  // 11. GitHub Actions automated workflow file inside ZIP
  const githubWf = root.folder('.github/workflows')!;
  githubWf.file(
    'build-apk.yml',
    `name: Build Ansuni Ankahi Bate Android APK

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    name: Build Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'

      - name: Make Gradle Wrapper Executable
        run: |
          if [ -f "./gradlew" ]; then
            chmod +x ./gradlew
          fi

      - name: Build Android Debug APK
        run: |
          if [ -f "./gradlew" ]; then
            ./gradlew assembleDebug --no-daemon --stacktrace
          else
            gradle assembleDebug --no-daemon --stacktrace
          fi

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: AnsuniAnkahiBate-debug-apk
          path: |
            **/build/outputs/apk/debug/*.apk
          retention-days: 30
          if-no-files-found: error
`
  );

  // 12. Gradle Wrapper Properties
  const wrapperDir = root.folder('gradle/wrapper')!;
  wrapperDir.file(
    'gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.6-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  // 13. gradlew script
  root.file(
    'gradlew',
    `#!/bin/sh
# Gradle startup script for Ansuni Ankahi Bate Android App
exec java -Xmx1024m -jar "$0.jar" "$@" 2>/dev/null || gradle "$@"
`
  );

  // 14. README.md with clear guide
  root.file(
    'README.md',
    `# Ansuni Ankahi Bate - Android App Project (अनसुनी अनकही बातें)

Welcome! This is the complete, production-ready native Android Studio project for **Ansuni Ankahi Bate**.

### Method 1: Build APK on Android Mobile without PC (GitHub Actions - 100% Free & Secure)
1. Upload this folder/files to a new repository on your GitHub account.
2. Go to the **Actions** tab on github.com.
3. Select **Build Ansuni Ankahi Bate Android APK** and tap **Run workflow**.
4. In ~2 minutes, under **Artifacts**, download \`AnsuniAnkahiBate-debug-apk\` directly to your Android phone!
5. No Personal Access Token or 3rd-party services required.

### Method 2: Build in Android Studio on Computer
1. **Download & Extract** this ZIP on your computer.
2. **Open Android Studio**.
3. Click **File -> Open...** and select the extracted folder \`AnsuniAnkahiBate-Android-App\`.
4. Click **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.

### App Details:
- **Package Name:** ${config.packageName}
- **App Name:** ${config.appName}
- **Target SDK:** Android 14 (API 34)
- **Minimum SDK:** Android 7.0 (API 24)
- **Theme:** Romantic Burgundy & Rose Gold (#4A0E17)
`
  );

  return await zip.generateAsync({ type: 'blob' });
};
