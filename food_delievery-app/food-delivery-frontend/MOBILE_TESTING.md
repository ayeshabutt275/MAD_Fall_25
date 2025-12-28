# Mobile Testing Guide - QR Code Scanning

## 📱 Expo Go vs Development Build

### Option 1: Expo Go (Simple, but Limited)
- **Install**: Download "Expo Go" app from Play Store/App Store
- **Limitation**: Some native modules might not work
- **Best for**: Quick testing, simple apps

### Option 2: Development Build (Recommended for your app)
- **Why**: Your app uses `expo-dev-client` which requires a development build
- **How**: Build APK with development profile

---

## 🔍 QR Code Scanning Issues - Solutions

### Issue 1: Phone and Computer on Different Networks
**Problem**: QR code won't work if phone and computer are on different WiFi networks

**Solution**:
1. ✅ Make sure phone and computer are on **SAME WiFi network**
2. ✅ Check computer's IP address
3. ✅ Use tunnel mode if networks are different

### Issue 2: Firewall Blocking Connection
**Problem**: Windows Firewall blocking Expo server

**Solution**:
1. Allow Expo through Windows Firewall
2. Or temporarily disable firewall for testing

### Issue 3: Expo Go Not Working
**Problem**: Your app uses `expo-dev-client` which doesn't work with Expo Go

**Solution**: Use Development Build instead

---

## 🚀 Step-by-Step: Test on Mobile

### Method 1: Using Expo Go (If Compatible)

1. **Install Expo Go** on your phone
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Start Expo Server**
   ```bash
   cd mad-project/food-delivery-frontend
   npm start
   # or
   npx expo start
   ```

3. **Scan QR Code**
   - Open Expo Go app
   - Tap "Scan QR Code"
   - Scan the QR code from terminal/browser

4. **If QR Code Doesn't Work**:
   ```bash
   # Use tunnel mode
   npx expo start --tunnel
   ```

### Method 2: Development Build (Recommended)

Since your app uses `expo-dev-client`, you need a development build:

1. **Build Development APK**
   ```bash
   eas build --platform android --profile development
   ```

2. **Install APK on Phone**
   - Download APK from Expo dashboard
   - Install on phone

3. **Start Development Server**
   ```bash
   npx expo start --dev-client
   ```

4. **Connect**
   - Open the app on phone
   - It will automatically connect to dev server
   - Or scan QR code from terminal

---

## 🌐 Network Configuration

### Check Computer's IP Address

**Windows**:
```bash
ipconfig
# Look for IPv4 Address (e.g., 192.168.0.126)
```

**Mac/Linux**:
```bash
ifconfig
# or
ip addr
```

### Update API Config for Local Testing

If testing with local backend, update `config/api.ts`:

```typescript
// For Android - use local IP for testing
if (Platform.OS === "android") {
  return `http://192.168.0.126:5000/api`; // Your computer's IP
}
```

---

## 🔧 Troubleshooting

### QR Code Not Scanning?

1. **Check Network**:
   - Phone and computer on same WiFi ✅
   - Firewall not blocking ✅

2. **Try Tunnel Mode**:
   ```bash
   npx expo start --tunnel
   ```
   - Works even on different networks
   - Slower but more reliable

3. **Manual Connection**:
   - In Expo Go, tap "Enter URL manually"
   - Enter: `exp://YOUR_COMPUTER_IP:8081`

### App Not Loading?

1. **Check Backend URL**:
   - For local testing: Use computer's IP
   - For production: Use Vercel URL

2. **Check Backend is Running**:
   ```bash
   # In backend directory
   npm run dev
   ```

3. **Check Console Logs**:
   - Look for error messages
   - Check network requests

---

## 📝 Quick Commands

```bash
# Start with tunnel (works on any network)
npx expo start --tunnel

# Start with local network
npx expo start

# Start for development build
npx expo start --dev-client

# Clear cache and restart
npx expo start -c
```

---

## ⚠️ Important Notes

1. **Expo Go Limitations**:
   - Some native modules don't work
   - Your app uses `expo-dev-client` → needs development build

2. **Development Build Required**:
   - Your `package.json` has `expo-dev-client`
   - Use `eas build --profile development` for testing

3. **Backend Connection**:
   - Local testing: Use computer's IP address
   - Production: Use Vercel URL (already configured)

---

## 🎯 Recommended Workflow

1. **For Quick Testing**: Use Development Build APK
   ```bash
   eas build --platform android --profile development
   ```

2. **For Development**: Use `expo start --dev-client`
   - Install development build APK once
   - Then use dev server for hot reload

3. **For Production**: Use Production APK
   ```bash
   eas build --platform android --profile production
   ```

