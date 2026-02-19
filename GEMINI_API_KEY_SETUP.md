# 🔑 Google Gemini API Key - Quick Setup Guide

## 📋 Step-by-Step Instructions

### **Step 1: Get Your Free API Key**

1. **Open Google AI Studio:**
   - Click this link: https://makersuite.google.com/app/apikey
   - Or go to: https://aistudio.google.com/app/apikey

2. **Sign in:**
   - Use your Google account (Gmail)
   - If you don't have one, create a free Google account

3. **Create API Key:**
   - Click the blue button: **"Create API Key"**
   - Select: **"Create API key in new project"**
   - Wait a few seconds
   - Your API key will appear (starts with `AIza...`)

4. **Copy the API Key:**
   - Click the copy icon
   - Save it somewhere safe (you'll need it in the next step)

---

### **Step 2: Add API Key to Your Project**

1. **Open your project folder:**
   ```
   c:\Jothi.J\chennai-blueprint-showcase
   ```

2. **Create a new file named `.env`** (if it doesn't exist)
   - Right-click in the folder
   - New → Text Document
   - Name it exactly: `.env` (no .txt extension)

3. **Open `.env` file in Notepad**

4. **Add this line:**
   ```
   VITE_GEMINI_API_KEY=AIzaSy...paste_your_actual_key_here
   ```
   
   **Example:**
   ```
   VITE_GEMINI_API_KEY=AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
   ```

5. **Save the file**

---

### **Step 3: Restart Your Application**

1. **Stop the development server:**
   - Go to the terminal/command prompt
   - Press `Ctrl + C`

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Wait for it to start:**
   - You should see: "Local: http://localhost:5000"

---

### **Step 4: Test It!**

1. **Open your browser:**
   - Go to: http://localhost:5000/smart-home

2. **Click the pink heart button** (bottom-right)

3. **Type:** "Hi, this is Lakshmi"

4. **You should see:**
   - "Saroja is thinking with love..." (with brain icon)
   - Then a personalized, empathetic response from Saroja AI

---

## ✅ Verification Checklist

- [ ] I have a Google account
- [ ] I created an API key from Google AI Studio
- [ ] I copied the API key (starts with `AIza`)
- [ ] I created `.env` file in the project root
- [ ] I added `VITE_GEMINI_API_KEY=...` to the file
- [ ] I saved the `.env` file
- [ ] I restarted the development server
- [ ] I tested the Family Chat
- [ ] I see AI-powered responses

---

## 🚨 Common Issues

### **Issue: "API key not found"**

**Solution:**
1. Make sure `.env` file is in the **root** directory (not in `client` folder)
2. Make sure the line starts with `VITE_GEMINI_API_KEY=`
3. No spaces around the `=` sign
4. Restart the server after creating `.env`

---

### **Issue: "Invalid API key"**

**Solution:**
1. Go back to Google AI Studio
2. Delete the old key
3. Create a new API key
4. Copy the new key
5. Update `.env` file
6. Restart server

---

### **Issue: "Quota exceeded"**

**Solution:**
- Free tier: 60 requests/minute
- Wait 1 minute and try again
- Or upgrade to paid tier (not needed for personal use)

---

## 💰 Pricing (FREE!)

**Google Gemini Free Tier:**
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ **100% FREE forever**

**For your use case:**
- You'll use ~10-50 requests per day
- **Cost: ₹0 (FREE)**

---

## 🔒 Security Tips

1. **Never share your API key publicly**
2. **Don't commit `.env` to GitHub** (it's already in `.gitignore`)
3. **If key is exposed, delete it and create a new one**
4. **Keep `.env` file private**

---

## 📞 Need Help?

If you're stuck, send me:
1. Screenshot of Google AI Studio page
2. Screenshot of your `.env` file (hide the actual key)
3. Error message from browser console (F12)

---

## 🎉 You're Ready!

Once you see AI-powered responses in the Family Chat, you're all set!

**Saroja AI will now:**
- Remember all conversations
- Show emotional intelligence
- Provide personalized responses
- Be aware of family situations
- Offer comfort and support

**Enjoy your AI-powered family chat!** 💕


