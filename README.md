# PocketTrack - Capacitor + GitHub Actions

This repository contains the PocketTrack web app and a GitHub Actions workflow that builds an Android debug APK in the cloud. Android Studio and the Android SDK do not need to be installed on your Windows PC.

## Files
- `index.html`, `style.css`, `app.js`: app source
- `package.json`: Capacitor dependencies
- `capacitor.config.json`: app ID, app name and web folder
- `.github/workflows/build-android.yml`: cloud APK build workflow

## Before you start
1. Create or sign in to a GitHub account.
2. Create a **new repository** named `PocketTrack`.
3. Extract this ZIP on your PC.
4. Upload all extracted files and folders to the repository root. Make sure `.github/workflows/build-android.yml` is included. GitHub's web uploader may hide dot-folders; if it does, use GitHub Desktop or the Git command line to upload the project.

## Build APK in GitHub
1. Open your repository on GitHub.
2. Select the **Actions** tab.
3. Open **Build PocketTrack Android APK**.
4. If needed, click **Run workflow**.
5. Wait for the workflow to finish with a green check.
6. Open the successful workflow run and find **Artifacts** at the bottom.
7. Download `PocketTrack-debug-apk`. Extract the downloaded artifact ZIP; it contains `app-debug.apk`.

The workflow also runs automatically whenever you push to the `main` branch.

## Install on Android
Transfer `app-debug.apk` to your Android phone and open it. Android may ask you to allow installation from that source. Only install APKs you built yourself or trust.

## Important notes
- This is a **debug APK** for testing, not a Play Store release.
- GitHub Actions artifacts are temporary (configured for 14 days). Download and keep your APK.
- This first version stores transactions in LocalStorage on that device. There is no account, cloud sync, or backup yet.
- The Android platform folder is generated inside the GitHub runner during the build; it is intentionally excluded from the repository.
- If you later change the app's HTML/CSS/JS, push the changes to GitHub and the workflow will create a fresh APK.
