# 🐛 Debug Guide: Link Clicking Issues

## **Current Error**
```
TypeError: Cannot read properties of undefined (reading 'match')
```

## **Potential Causes**

### **1. Undefined sourceUrl**
- Real data service may not be setting `sourceUrl` properly
- AI-generated leads may have malformed URLs

### **2. Type Safety Issues** 
- Lead object structure mismatch
- Missing properties in lead data

### **3. URL Pattern Issues**
- Demo URLs not properly detected
- Invalid URL formats from APIs

## **Debug Steps Added**

### **1. Enhanced Logging**
```typescript
console.log('Attempting to open URL:', { sourceUrl, source, prospectName });
```

### **2. Type Guards**
```typescript
if (!sourceUrl || typeof sourceUrl !== 'string') {
  console.warn('No valid sourceUrl provided:', sourceUrl);
  return;
}
```

### **3. Fallback Values**
```typescript
onClick={() => handleSourceClick(
  lead.sourceUrl || '', 
  lead.source || 'Unknown', 
  lead.prospectName || 'Anonymous'
)}
```

### **4. Demo Pattern Detection**
```typescript
const isDemoPattern = demoUrls.includes(sourceUrl) || 
                     sourceUrl.includes('activity-demo-') ||
                     sourceUrl.includes('realistic-profile') ||
                     !sourceUrl.startsWith('http');
```

## **Expected Behavior**

### **Real Reddit Links**
- Format: `https://reddit.com/r/entrepreneur/comments/abc123/post_title`
- Should open in new tab

### **Real HackerNews Links** 
- Format: `https://news.ycombinator.com/item?id=123456`
- Should open in new tab

### **AI-Enhanced Links**
- Should show friendly message: "This is an enhanced lead..."
- Should NOT attempt to open URL

### **Error Cases**
- Undefined sourceUrl → Show demo message
- Invalid URL → Show error message with details
- Unknown domain → Ask for confirmation

## **Testing URLs**

Try these in browser console:
```javascript
// Test real Reddit URL
window.open('https://reddit.com/r/entrepreneur/comments/abc123/test', '_blank');

// Test real HackerNews URL  
window.open('https://news.ycombinator.com/item?id=123456', '_blank');

// Test invalid URL
try { new URL('invalid-url'); } catch(e) { console.log('Expected error:', e); }
```

## **Next Debug Steps**

1. **Check browser console** for the full error and lead object
2. **Verify sourceUrl format** in real data vs AI data  
3. **Test with different queries** to isolate issue
4. **Check if CORS** is blocking certain domains

The enhanced error handling should now provide better debugging info!