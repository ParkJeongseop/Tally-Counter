#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Language mapping for Android (some codes differ)
const androidLocaleMap = {
  'id': 'in',  // Indonesian
  'he': 'iw',  // Hebrew
  'zh': 'zh-rCN',  // Simplified Chinese
  'pt-BR': 'pt-rBR',  // Brazilian Portuguese
  'no': 'nb',  // Norwegian
};

// iOS locale mapping
const iosLocaleMap = {
  'zh': 'zh-Hans',  // Simplified Chinese
  'no': 'nb',  // Norwegian
};

async function loadTranslation(lang) {
  const translationPath = path.join(__dirname, '..', 'src', 'i18n', 'translations', `${lang}.ts`);
  
  if (!fs.existsSync(translationPath)) {
    console.warn(`Translation file not found: ${translationPath}`);
    return null;
  }

  const content = fs.readFileSync(translationPath, 'utf8');
  
  // Extract appTitle using regex
  const match = content.match(/appTitle:\s*['"]([^'"]+)['"]/);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function updateAndroidStrings() {
  console.log('Updating Android strings.xml files...');
  
  const languages = [
    'en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'pt-BR', 'ru', 
    'ar', 'hi', 'it', 'nl', 'tr', 'pl', 'sv', 'vi', 'th', 'id', 
    'ms', 'uk', 'he', 'el', 'cs', 'hu', 'ro', 'sk', 'hr', 'ca', 
    'fi', 'da', 'no', 'bg', 'lt', 'lv', 'et', 'sl', 'is', 'mt', 'sq'
  ];

  for (const lang of languages) {
    const appTitle = await loadTranslation(lang);
    
    if (!appTitle) {
      console.warn(`No translation found for ${lang}`);
      continue;
    }

    // Determine Android locale folder
    let androidLocale = androidLocaleMap[lang] || lang;
    
    // Special handling for Chinese variants
    if (lang === 'zh') {
      // Create both simplified and traditional
      const locales = ['zh-rCN', 'zh-rTW'];
      for (const locale of locales) {
        const dirPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', `values-${locale}`);
        
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        const stringsPath = path.join(dirPath, 'strings.xml');
        const content = `<resources>
    <string name="app_name">${escapeXml(appTitle)}</string>
</resources>`;

        fs.writeFileSync(stringsPath, content, 'utf8');
        console.log(`Updated: values-${locale}/strings.xml`);
      }
      continue;
    }

    const valuesDir = lang === 'en' ? 'values' : `values-${androidLocale}`;
    const dirPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', valuesDir);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const stringsPath = path.join(dirPath, 'strings.xml');
    const content = `<resources>
    <string name="app_name">${escapeXml(appTitle)}</string>
</resources>`;

    fs.writeFileSync(stringsPath, content, 'utf8');
    console.log(`Updated: ${valuesDir}/strings.xml`);
  }
}

function writeIOSLocalizationFile(filePath, appTitle) {
  const content = `/* Localized app name */
"CFBundleDisplayName" = "${appTitle}";`;
  
  // Convert to UTF-16 LE with BOM
  const buffer = Buffer.from(content, 'utf16le');
  const bom = Buffer.from([0xFF, 0xFE]); // UTF-16 LE BOM
  const finalBuffer = Buffer.concat([bom, buffer]);
  
  fs.writeFileSync(filePath, finalBuffer);
}

async function updateIOSLocalizations() {
  console.log('\nCreating iOS localization files...');
  
  const languages = [
    'en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'pt-BR', 'ru', 
    'ar', 'hi', 'it', 'nl', 'tr', 'pl', 'sv', 'vi', 'th', 'id', 
    'ms', 'uk', 'he', 'el', 'cs', 'hu', 'ro', 'sk', 'hr', 'ca', 
    'fi', 'da', 'no', 'bg', 'lt', 'lv', 'et', 'sl', 'is', 'mt', 'sq'
  ];

  for (const lang of languages) {
    const appTitle = await loadTranslation(lang);
    
    if (!appTitle) {
      console.warn(`No translation found for ${lang}`);
      continue;
    }

    // Determine iOS locale folder
    let iosLocale = iosLocaleMap[lang] || lang;
    
    // Handle Portuguese variants
    if (lang === 'pt-BR') {
      iosLocale = 'pt-BR';
    } else if (lang === 'pt') {
      iosLocale = 'pt-PT';
    }

    // Create .lproj directory
    const lprojDir = path.join(__dirname, '..', 'ios', 'TallyCounter', `${iosLocale}.lproj`);
    
    if (!fs.existsSync(lprojDir)) {
      fs.mkdirSync(lprojDir, { recursive: true });
    }

    // Create InfoPlist.strings file with UTF-16 BOM
    const infoPlistPath = path.join(lprojDir, 'InfoPlist.strings');
    writeIOSLocalizationFile(infoPlistPath, appTitle);
    console.log(`Created: ${iosLocale}.lproj/InfoPlist.strings (UTF-16 with BOM)`);

    // Handle Chinese variants
    if (lang === 'zh') {
      // Create Traditional Chinese variant
      const zhHantDir = path.join(__dirname, '..', 'ios', 'TallyCounter', 'zh-Hant.lproj');
      if (!fs.existsSync(zhHantDir)) {
        fs.mkdirSync(zhHantDir, { recursive: true });
      }
      
      const zhHantPath = path.join(zhHantDir, 'InfoPlist.strings');
      writeIOSLocalizationFile(zhHantPath, appTitle);
      console.log(`Created: zh-Hant.lproj/InfoPlist.strings (UTF-16 with BOM)`);
    }
  }
}

async function main() {
  console.log('Syncing app names from translations to native resources...\n');
  
  try {
    await updateAndroidStrings();
    await updateIOSLocalizations();
    
    console.log('\n✅ Sync completed successfully!');
    console.log('\nNote: You may need to rebuild the apps for changes to take effect:');
    console.log('  Android: npm run android');
    console.log('  iOS: cd ios && pod install && cd .. && npm run ios');
  } catch (error) {
    console.error('❌ Error during sync:', error);
    process.exit(1);
  }
}

main();