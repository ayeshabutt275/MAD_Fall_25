# EAS Build Stuck - Troubleshooting Guide

## 🔍 Why Build Gets Stuck?

### 1. **Waiting for User Input (Most Common)**
Build process might be waiting for:
- Keystore selection
- Credentials confirmation
- Build configuration confirmation

**Solution**: Check terminal - might be waiting for input. Press Enter or answer prompts.

### 2. **Network Issues**
Slow or unstable internet connection.

**Solution**: 
- Check internet connection
- Try again later
- Use stable WiFi

### 3. **EAS Not Logged In**
EAS CLI not authenticated.

**Solution**:
```bash
eas login
```

### 4. **Build Queue**
EAS servers might be busy.

**Solution**: Wait 5-10 minutes, or check build status:
```bash
eas build:list
```

### 5. **Firewall/Antivirus Blocking**
Windows Firewall blocking EAS connection.

**Solution**: Temporarily disable firewall or allow EAS through firewall.

---

## 🚀 Quick Fixes

### Step 1: Cancel Current Build
Press `Ctrl + C` to cancel stuck build.

### Step 2: Check EAS Login
```bash
eas whoami
```
If not logged in:
```bash
eas login
```

### Step 3: Try Build Again with Verbose Output
```bash
eas build --platform android --profile production --non-interactive
```

### Step 4: Check Build Status
```bash
eas build:list
```
This shows all builds and their status.

---

## 🔧 Alternative: Use Non-Interactive Mode

If build keeps getting stuck, use non-interactive mode:

```bash
eas build --platform android --profile production --non-interactive
```

This will:
- Use default credentials
- Skip prompts
- Start build immediately

---

## 📝 Recommended Build Command

```bash
# Navigate to project
cd mad-project/food-delivery-frontend

# Login to EAS (if not logged in)
eas login

# Build with non-interactive mode
eas build --platform android --profile production --non-interactive
```

---

## ⚠️ If Still Stuck

1. **Cancel**: Press `Ctrl + C`
2. **Check Status**: `eas build:list`
3. **Retry**: Use `--non-interactive` flag
4. **Check Internet**: Ensure stable connection
5. **Wait**: Sometimes EAS servers are slow (10-20 min is normal)

---

## 💡 Pro Tips

1. **Use `--non-interactive`**: Prevents getting stuck on prompts
2. **Check Build List**: `eas build:list` shows all builds
3. **Monitor Dashboard**: Check https://expo.dev for build status
4. **Be Patient**: First build takes 15-20 minutes

---

## 🎯 Quick Command Reference

```bash
# Login
eas login

# Check login status
eas whoami

# Build (non-interactive)
eas build --platform android --profile production --non-interactive

# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]
```

