# Android APK Build Guide

Yeh guide aapko Expo app se Android APK banane mein help karega.

## Prerequisites

1. **Expo Account** - [expo.dev](https://expo.dev) par account banayein
2. **EAS CLI** - Expo Application Services CLI install karein
3. **Node.js** - Installed hona chahiye

## Steps

### 1. EAS CLI Install Karein

```bash
npm install -g eas-cli
```

### 2. Expo Account se Login Karein

```bash
eas login
```

### 3. EAS Build Configure Karein

Project root directory mein yeh command run karein:

```bash
eas build:configure
```

Yeh automatically `eas.json` file create karega.

### 4. Android APK Build Karein

#### Option A: Development Build (Testing ke liye)

```bash
eas build --platform android --profile development
```

#### Option B: Production APK (Release ke liye)

```bash
eas build --platform android --profile production
```

### 5. Build Status Check Karein

```bash
eas build:list
```

### 6. APK Download Karein

Build complete hone ke baad:
- Expo dashboard par jayein: https://expo.dev
- Apne project mein jayein
- Builds section mein APK download karein

## Local Build (Advanced)

Agar aap locally build karna chahte hain:

### 1. Android Studio Install Karein

- Android Studio download karein: https://developer.android.com/studio
- Android SDK install karein

### 2. Environment Setup

```bash
# Java JDK install karein (Android Studio ke saath aata hai)
# Android SDK path set karein
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 3. Local Build Command

```bash
eas build --platform android --local
```

## Important Notes

1. **Backend URL Update**: APK banane se pehle `config/api.ts` mein backend URL update karein
   - Production backend URL use karein (Vercel URL)
   - Ya environment variable set karein

2. **App Configuration**: `app.json` mein app details check karein:
   - `name`: App ka naam
   - `slug`: Unique identifier
   - `version`: App version
   - `android.package`: Package name (unique hona chahiye)

3. **Signing**: Production APK ke liye signing key chahiye
   - EAS automatically handle karta hai
   - Ya manually configure kar sakte hain

## Build Profiles (eas.json)

Example configuration:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## Troubleshooting

### Build Fail Ho Raha Hai?

1. Check karein ke sab dependencies install hain:
   ```bash
   npm install
   ```

2. Expo CLI update karein:
   ```bash
   npm install -g expo-cli@latest
   ```

3. EAS CLI update karein:
   ```bash
   npm install -g eas-cli@latest
   ```

### APK Size Zyada Hai?

- Images optimize karein
- Unused dependencies remove karein
- Code splitting use karein

## Quick Commands Summary

```bash
# EAS install
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build APK (Preview)
eas build --platform android --profile preview

# Build APK (Production)
eas build --platform android --profile production

# Build status
eas build:list

# Local build
eas build --platform android --local
```

## Next Steps

1. APK build karein
2. Test karein device par
3. Backend URL verify karein
4. Production deploy karein

## Helpful Links

- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Build Guide](https://docs.expo.dev/build/setup/)
- [Android APK Distribution](https://docs.expo.dev/distribution/app-stores/)

