const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Saptak/Desktop/react_native_journey/Smart-Field-Survey-Inspection-App-React-Native/inspection-app/app/(drawer)/(tabs)';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

const lightColors = {
  bg: ["'#fff'", "'#ffffff'", "'#f8fafc'", "'#f4f4f4'", "'#fafafa'", "'#f1f5f9'", "'#eee'"],
  text: ["'#000'", "'#111'", "'#222'", "'#333'", "'#444'", "'#555'", "'#666'", "'#0f172a'", "'#64748b'"],
  border: ["'#ccc'", "'#ddd'"]
};

const darkColors = {
  bg: ["'#0f172a'", "'#1e293b'", "'#334155'", "'#030712'", "rgba(0,0,0,0.7)"],
  text: ["'#e2e8f0'", "'#cbd5e1'", "'#94a3b8'", "'#f8fafc'", "'#ffffff'", "'#fff'"],
  border: ["'#1e293b'", "'#334155'"]
};

files.forEach(file => {
  if (file === '_layout.tsx' || file === 'explore.tsx') return; // Skip these

  let content = fs.readFileSync(path.join(dir, file), 'utf8');

  // Determine if file is originally dark mode or light mode
  const isOriginallyDark = content.includes("backgroundColor: '#0f172a'") || content.includes("backgroundColor: '#030712'");

  // 1. Add useTheme import if not exists
  if (!content.includes('useTheme')) {
    content = content.replace(/(import React.*?;\n)/, "$1import { useTheme } from '@/context/ThemeContext';\n");
  }

  // 2. Wrap StyleSheet.create
  if (content.includes('const styles = StyleSheet.create({')) {
    content = content.replace(/const styles = StyleSheet\.create\(\{/, 'const getStyles = (isDark) => StyleSheet.create({');
    
    // Inject hook into the default export component
    content = content.replace(/(export default function \w+\(.*?\) \{\n)/, "$1  const { isDark } = useTheme();\n  const styles = getStyles(isDark);\n");
  }

  // 3. Process the getStyles body
  const styleMatch = content.match(/const getStyles = \(isDark\) => StyleSheet\.create\(\{([\s\S]+?)\}\);/);
  if (styleMatch) {
    let styleBody = styleMatch[1];
    let lines = styleBody.split('\n');

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Match properties like backgroundColor: '#fff',
      const propMatch = line.match(/(\s+)(backgroundColor|color|borderColor|borderTopColor|borderBottomColor):\s*('[^']+'|rgba\([^)]+\)),?/);
      if (propMatch) {
        const [full, space, prop, val] = propMatch;
        let newVal = val;

        if (isOriginallyDark) {
          // Dark to Light mapping
          if (prop.toLowerCase().includes('color') && !prop.toLowerCase().includes('background')) {
            // Text or Border
            if (val === "'#ffffff'" || val === "'#fff'") newVal = "isDark ? '#ffffff' : '#0f172a'";
            else if (val === "'#e2e8f0'") newVal = "isDark ? '#e2e8f0' : '#333'";
            else if (val === "'#cbd5e1'") newVal = "isDark ? '#cbd5e1' : '#555'";
            else if (val === "'#94a3b8'") newVal = "isDark ? '#94a3b8' : '#64748b'";
            else if (val === "'#1e293b'") newVal = "isDark ? '#1e293b' : '#ddd'"; // borders
            else if (val === "'#334155'") newVal = "isDark ? '#334155' : '#ccc'"; // borders
          } else if (prop.toLowerCase().includes('background')) {
            if (val === "'#0f172a'") newVal = "isDark ? '#0f172a' : '#f8fafc'";
            else if (val === "'#1e293b'") newVal = "isDark ? '#1e293b' : '#fff'";
            else if (val === "'#334155'") newVal = "isDark ? '#334155' : '#e2e8f0'";
            else if (val === "'#030712'") newVal = "isDark ? '#030712' : '#f4f4f4'";
            else if (val === "'rgba(0,0,0,0.7)'") newVal = "isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'";
          }
        } else {
          // Light to Dark mapping
          if (prop.toLowerCase().includes('color') && !prop.toLowerCase().includes('background')) {
            // Text or Border
            // ONLY map #fff if it's NOT color (because white text on colored buttons shouldn't change)
            // Wait, what if it's borderColor: '#ccc'?
            if (val === "'#000'") newVal = "isDark ? '#f8fafc' : '#000'";
            else if (val === "'#111'") newVal = "isDark ? '#e2e8f0' : '#111'";
            else if (val === "'#333'") newVal = "isDark ? '#cbd5e1' : '#333'";
            else if (val === "'#555'") newVal = "isDark ? '#94a3b8' : '#555'";
            else if (val === "'#666'") newVal = "isDark ? '#94a3b8' : '#666'";
            else if (val === "'#0f172a'") newVal = "isDark ? '#f8fafc' : '#0f172a'";
            else if (val === "'#64748b'") newVal = "isDark ? '#94a3b8' : '#64748b'";
            else if (val === "'#ccc'") newVal = "isDark ? '#334155' : '#ccc'"; // borders
            else if (val === "'#ddd'") newVal = "isDark ? '#334155' : '#ddd'"; // borders
          } else if (prop.toLowerCase().includes('background')) {
            if (val === "'#fff'") newVal = "isDark ? '#1e293b' : '#fff'";
            else if (val === "'#ffffff'") newVal = "isDark ? '#1e293b' : '#ffffff'";
            else if (val === "'#f8fafc'") newVal = "isDark ? '#0f172a' : '#f8fafc'";
            else if (val === "'#f4f4f4'") newVal = "isDark ? '#0f172a' : '#f4f4f4'";
            else if (val === "'#fafafa'") newVal = "isDark ? '#1e293b' : '#fafafa'";
            else if (val === "'#f1f5f9'") newVal = "isDark ? '#334155' : '#f1f5f9'";
            else if (val === "'#eee'") newVal = "isDark ? '#334155' : '#eee'";
          }
        }
        
        if (newVal !== val) {
          lines[i] = line.replace(val, newVal);
        }
      }
    }
    
    const newStyleBody = lines.join('\n');
    content = content.replace(styleBody, newStyleBody);
  }

  fs.writeFileSync(path.join(dir, file), content, 'utf8');
});

console.log('Refactoring complete.');
