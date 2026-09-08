$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$sdkRoot = "C:\Users\ASUS\android-sdk"
$buildTools = "$sdkRoot\build-tools\34.0.0"
$platformJar = "$sdkRoot\platforms\android-34\android.jar"

$projectDir = "c:\Users\ASUS\OneDrive\Desktop\hackathon project\JH-Safety-AR-Android"
Set-Location $projectDir

Write-Host "=========================================="
Write-Host "BUILDING JH SAFETY AR ANDROID MOBILE APK"
Write-Host "=========================================="

# 1. Clean build directories
$buildDir = "$projectDir\build"
$binDir = "$projectDir\bin"
if (Test-Path $buildDir) { Remove-Item $buildDir -Recurse -Force }
if (Test-Path $binDir) { Remove-Item $binDir -Recurse -Force }
New-Item -ItemType Directory -Path $buildDir -Force | Out-Null
New-Item -ItemType Directory -Path $binDir -Force | Out-Null

# 2. Compile Resources with AAPT2
Write-Host "[1/7] Compiling Android resources..."
& "$buildTools\aapt2.exe" compile --dir "$projectDir\res" -o "$buildDir\compiled_res.zip"
if ($LASTEXITCODE -ne 0) { Write-Error "Resource compilation failed"; exit 1 }

# 3. Link Resources and Generate R.java
Write-Host "[2/7] Linking resources & generating R.java..."
& "$buildTools\aapt2.exe" link `
    -o "$buildDir\base_app.apk" `
    -I $platformJar `
    --manifest "$projectDir\AndroidManifest.xml" `
    "$buildDir\compiled_res.zip" `
    --java "$projectDir\src" `
    -A "$projectDir\assets" `
    --auto-add-overlay
if ($LASTEXITCODE -ne 0) { Write-Error "Resource linking failed"; exit 1 }

# 4. Compile Java Source Code with javac
Write-Host "[3/7] Compiling Java classes..."
$javaFiles = Get-ChildItem -Path "$projectDir\src" -Recurse -Filter "*.java" | ForEach-Object { $_.FullName }
& "C:\Program Files\Java\jdk-21\bin\javac.exe" `
    -source 8 -target 8 `
    -cp "$platformJar" `
    -d "$binDir" `
    $javaFiles
if ($LASTEXITCODE -ne 0) { Write-Error "Java compilation failed"; exit 1 }

# 5. Convert Bytecode to Android DEX with D8
Write-Host "[4/7] Converting to DEX bytecode with D8..."
$classFiles = Get-ChildItem -Path "$binDir" -Recurse -Filter "*.class" | ForEach-Object { $_.FullName }
& "$buildTools\d8.bat" `
    --output "$buildDir" `
    --lib "$platformJar" `
    $classFiles
if ($LASTEXITCODE -ne 0) { Write-Error "D8 DEX compilation failed"; exit 1 }

# 6. Package DEX into base APK
Write-Host "[5/7] Packaging DEX and assets into APK..."
Copy-Item "$buildDir\base_app.apk" "$buildDir\app_with_dex.apk" -Force
& "C:\Program Files\Java\jdk-21\bin\jar.exe" -uf "$buildDir\app_with_dex.apk" -C "$buildDir" classes.dex
if ($LASTEXITCODE -ne 0) { Write-Error "APK packaging failed"; exit 1 }

# 7. ZipAlign APK
Write-Host "[6/7] Aligning APK with zipalign..."
$alignedApk = "$buildDir\JH-Safety-AR-aligned.apk"
& "$buildTools\zipalign.exe" -v -p 4 "$buildDir\app_with_dex.apk" $alignedApk
if ($LASTEXITCODE -ne 0) { Write-Error "ZipAlign failed"; exit 1 }

# 8. Sign APK with apksigner
Write-Host "[7/7] Signing APK with debug certificate..."
$keystore = "$projectDir\debug.keystore"
if (-not (Test-Path $keystore)) {
    & "C:\Program Files\Java\jdk-21\bin\keytool.exe" -genkey -v `
        -keystore $keystore `
        -alias androiddebugkey `
        -storepass android `
        -keypass android `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -dname "CN=Android Debug,O=Android,C=US"
}

$finalApk = "$projectDir\JH-Safety-AR.apk"
& "$buildTools\apksigner.bat" sign `
    --ks $keystore `
    --ks-pass pass:android `
    --key-pass pass:android `
    --out $finalApk `
    $alignedApk
if ($LASTEXITCODE -ne 0) { Write-Error "APK signing failed"; exit 1 }

# Verify APK
Write-Host "Verifying final signed APK..."
& "$buildTools\apksigner.bat" verify -v $finalApk

$apkItem = Get-Item $finalApk
Write-Host ""
Write-Host "========================================================="
Write-Host "SUCCESS! ANDROID MOBILE APK BUILT SUCCESSFULLY"
Write-Host "Deliverable: $finalApk"
Write-Host "Size: $([math]::Round($apkItem.Length / 1MB, 2)) MB ($($apkItem.Length) bytes)"
Write-Host "========================================================="
