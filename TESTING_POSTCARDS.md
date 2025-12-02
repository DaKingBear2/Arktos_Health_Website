# Testing Postcards/Guestbook Functionality

## Prerequisites

### 1. GitHub Token Setup

**For Local Testing:**
1. Create a `.env` file in the project root (if it doesn't exist)
2. Add your GitHub Personal Access Token:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```
3. Make sure the token has `repo` scope permissions

**For Production (Cloudflare Pages):**
1. Go to Cloudflare Dashboard → Workers & Pages → Your Project
2. Click on **Settings** → **Environment Variables**
3. Click **Add variable**
4. **IMPORTANT**: Select **"Secret"** (not "Plain text") for security
5. Variable name: `GITHUB_TOKEN`
6. Variable value: Your GitHub Personal Access Token
7. Make sure it's enabled for **Production** environment (and Preview if you want to test there)
8. Click **Save**
9. **Redeploy your site** after adding the variable (Cloudflare Pages → Deployments → Retry deployment or push a new commit)

### 2. Start Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

---

## Testing Steps

### Step 1: Open the Postcards Page

1. Navigate to: `http://localhost:4321/postcards`
2. You should see:
   - A random dog image
   - A form with "Name (randomized)" field (pre-filled with random name)
   - A "Message" textarea
   - A "Post to Guestbook" button
   - A "Recent Messages" section

### Step 2: Check Browser Console

1. Open Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Look for any errors or warnings:
   - ❌ If you see: `GITHUB_TOKEN not set` → Token is missing
   - ❌ If you see: `GitHub API 401` → Token is invalid/expired
   - ❌ If you see: `GitHub API 403` → Token lacks permissions
   - ✅ If no errors → Good to proceed

### Step 3: Test Reading Messages (GET)

1. The page should automatically load existing messages when it opens
2. Check the **Network** tab in Developer Tools:
   - Look for a request to `/api/guestbook`
   - Status should be `200 OK`
   - Response should be a JSON array (even if empty `[]`)

### Step 4: Test Submitting a Message (POST)

1. Fill in the message field (name is auto-generated)
2. Click "Post to Guestbook"
3. Watch for:
   - Button should change to "Posting..." and be disabled
   - Status message should appear above the form
   - **Success**: Green/blue message "Message posted successfully!"
   - **Error**: Red message with specific error

### Step 5: Verify in Browser Console

After submitting, check the console for:
- ✅ `Attempting to commit guestbook.json to GitHub...`
- ✅ `GitHub commit successful`
- ❌ If you see errors, note the status code and message

### Step 6: Verify Message Appears

1. After successful submission, wait 1-2 seconds
2. The message list should refresh automatically
3. Your new message should appear at the top of the list
4. It should show:
   - Your randomized name
   - Your message text
   - A timestamp

### Step 7: Verify on GitHub

1. Go to your GitHub repository: `https://github.com/DaKingBear2/Arktos_Health_Website`
2. Navigate to: `src/data/guestbook.json`
3. Click on the file to view it
4. You should see your new entry in the JSON array
5. Check the commit history - there should be a new commit with message like "Add guestbook entry by [Name]"

---

## Troubleshooting

### Issue: "Server configuration error"
**Solution**: GitHub token is not set. Add it to `.env` file for local testing.

### Issue: "Authentication failed" (401)
**Solution**: 
- Token is invalid or expired
- Generate a new GitHub Personal Access Token
- Make sure it has `repo` scope

### Issue: "Permission denied" (403)
**Solution**: 
- Token doesn't have write permissions
- Token needs `repo` scope (full control of private repositories)
- Make sure the token has access to the repository

### Issue: "File conflict" (422)
**Solution**: 
- Someone else updated the file at the same time
- Try submitting again

### Issue: Messages don't appear after posting
**Solution**:
1. Check browser console for errors
2. Check Network tab - is the GET request succeeding?
3. Wait a few seconds and refresh the page manually
4. Check if the file was actually updated on GitHub

### Issue: "Network error"
**Solution**:
1. Check your internet connection
2. Make sure the dev server is running
3. Check if GitHub API is accessible

---

## Production Testing

After deploying to Cloudflare Pages:

1. Visit: `https://www.arktoshealth.com/postcards`
2. Follow the same testing steps
3. Check Cloudflare Workers logs:
   - Go to Cloudflare Dashboard → Workers & Pages → Your Project
   - Click on "Logs" or "Real-time Logs"
   - Look for console.log messages from the API route

---

## Expected Behavior

✅ **Working correctly:**
- Messages load on page load
- Form submission shows "Posting..." state
- Success message appears
- New message appears in list within 1-2 seconds
- File is updated on GitHub
- No console errors

❌ **Not working:**
- Error messages in console
- "Failed to post message" status
- Messages don't appear after posting
- File not updated on GitHub
- 401/403/500 errors

---

## Quick Test Checklist

- [ ] Page loads without errors
- [ ] Existing messages display (if any)
- [ ] Form accepts input
- [ ] Submit button works
- [ ] Success message appears
- [ ] New message appears in list
- [ ] File updated on GitHub
- [ ] No console errors
- [ ] Works on production site

