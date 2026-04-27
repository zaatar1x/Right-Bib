# 🐛 Image Upload Debugging Guide

## Issue: Image not showing after upload/URL input

### ✅ Fixes Applied

1. **Fixed v-model binding** - Now properly syncs between parent and child component
2. **Added state management** - Separate tracking for URL input and uploaded images
3. **Added visual feedback** - Green checkmark shows when image is set
4. **Fixed tab switching** - Properly detects if value is URL or base64

---

## How to Test

### Test URL Input:

1. Open Admin → Books → Add Book
2. In Image field, click **URL** tab (should be default)
3. Paste this URL: `https://via.placeholder.com/300x400/2563EB/FFFFFF?text=Test+Book`
4. You should see:
   - ✅ Preview image appears below input
   - ✅ Green text "✓ Image URL set"
5. Submit the form
6. Check if book is created with the image

### Test File Upload:

1. Open Admin → Books → Add Book
2. In Image field, click **Upload** tab
3. Either:
   - **Click** the dropzone and select an image file
   - **Drag** an image file from your computer and drop it
4. You should see:
   - ✅ Preview of uploaded image
   - ✅ Green text "✓ Image uploaded"
   - ✅ Red X button to remove
5. Submit the form
6. Check if book is created with the image

### Test Edit Book:

1. Open Admin → Books
2. Click **Edit** on any book
3. The image field should show:
   - Current image in preview
   - Correct tab selected (URL or Upload)
4. Change the image
5. Submit
6. Verify image updated

---

## Common Issues & Solutions

### Issue: Preview not showing

**Cause:** Invalid URL or broken image link

**Solution:**
- Check the URL is accessible
- Try a different image URL
- Use placeholder: `https://via.placeholder.com/300x400`

### Issue: Upload not working

**Cause:** File too large or wrong format

**Solution:**
- Check file size < 10MB
- Use PNG, JPG, or GIF format
- Check browser console for errors

### Issue: Image not saving

**Cause:** Form validation or API error

**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try submitting again
4. Check for error messages
5. Verify all required fields are filled

### Issue: Base64 image too large

**Cause:** Uploaded file creates very large base64 string

**Solution:**
- Use smaller image files (< 1MB recommended)
- Or use URL method instead
- Consider image compression

---

## Technical Details

### How It Works

**URL Method:**
```
User pastes URL → urlInput updated → emit to parent → form.image = URL
```

**Upload Method:**
```
User drops file → FileReader converts to base64 → uploadedImage updated → emit to parent → form.image = base64
```

### State Management

```typescript
urlInput: string        // Stores URL input
uploadedImage: string   // Stores base64 data
modelValue: string      // Prop from parent (form.image)
```

### Watchers

```typescript
watch(modelValue) {
  if (starts with 'data:') → Upload tab, show preview
  else → URL tab, show in input
}
```

---

## Debugging Steps

### 1. Check Component Binding

Open Vue DevTools:
1. Select ImageUpload component
2. Check props: `modelValue` should have value
3. Check data: `urlInput` or `uploadedImage` should have value

### 2. Check Form Data

In BooksView component:
1. Check `form.image` value
2. Should be either URL string or base64 string
3. Should update when ImageUpload emits

### 3. Check Network Request

When submitting:
1. Open Network tab in DevTools
2. Find POST/PUT request to `/books/new` or `/books/edit/:id`
3. Check request payload
4. Verify `image` field has value

### 4. Check Console Errors

Look for:
- CORS errors
- File size errors
- Validation errors
- Network errors

---

## Expected Behavior

### URL Input:
```
Input: https://example.com/image.jpg
Preview: Shows image
Status: ✓ Image URL set
Form: form.image = "https://example.com/image.jpg"
```

### File Upload:
```
Input: Drop image.jpg (500KB)
Preview: Shows uploaded image
Status: ✓ Image uploaded
Form: form.image = "data:image/jpeg;base64,/9j/4AAQ..."
```

---

## Browser Console Commands

Test the component manually:

```javascript
// Get the form data
const form = document.querySelector('form')
const formData = new FormData(form)
console.log('Image value:', formData.get('image'))

// Check if image is set
const imageUpload = document.querySelector('.image-upload')
console.log('ImageUpload component:', imageUpload)
```

---

## Still Not Working?

### Check These:

1. ✅ Browser supports FileReader API
2. ✅ No ad blockers blocking image loading
3. ✅ CORS headers allow image loading
4. ✅ Backend accepts base64 images
5. ✅ Image URL is publicly accessible
6. ✅ File permissions allow reading

### Get Help:

1. Open browser console (F12)
2. Copy any error messages
3. Check Network tab for failed requests
4. Note which method you're using (URL or Upload)
5. Note the file size/type if uploading

---

## Success Indicators

You'll know it's working when:

- ✅ Preview image appears
- ✅ Green checkmark shows
- ✅ No console errors
- ✅ Form submits successfully
- ✅ Book appears with correct image
- ✅ Image displays in book list

---

**Last Updated:** April 27, 2026
