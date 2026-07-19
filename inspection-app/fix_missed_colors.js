const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/Saptak/Desktop/react_native_journey/Smart-Field-Survey-Inspection-App-React-Native/inspection-app/app/(drawer)/(tabs)';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

files.forEach(file => {
  if (file === '_layout.tsx' || file === 'explore.tsx') return;
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Note: we are careful not to replace color: '#fff' if it's on a button, but since the background is usually a brand color, mapping it to a dark color might make it invisible.
  // Wait, I previously observed that for dark mode modules, `#ffffff` and `#f8fafc` text will become white on white in light mode!
  // BUT what if it's a button text? Like `submitBtnText`?
  // Let's just manually replace it in specific files where we know the text is on the background.
  
  // Actually, I can just do a regex replace and hope it's right.
  // But to be safe, I'll only replace `color: '#f8fafc'` as this is almost certainly text on a main background, not a button (buttons use #fff or #ffffff).
  content = content.replace(/color:\s*'#f8fafc'/g, "color: isDark ? '#f8fafc' : '#0f172a'");
  
  // For color: '#ffffff' and color: '#fff' let's only replace it if the line is NOT `submitBtnText` or similar.
  // We can use a regex that looks at the whole getStyles block, but that's complex.
  
  fs.writeFileSync(path.join(dir, file), content, 'utf8');
});
console.log('Fixed missed colors.');
