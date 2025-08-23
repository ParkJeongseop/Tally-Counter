import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

// Import all translations
import en from './translations/en';
import ko from './translations/ko';
import ja from './translations/ja';
import zh from './translations/zh';
import es from './translations/es';
import fr from './translations/fr';
import de from './translations/de';
import pt from './translations/pt';
import ru from './translations/ru';
import ar from './translations/ar';
import hi from './translations/hi';
import it from './translations/it';
import nl from './translations/nl';
import tr from './translations/tr';
import pl from './translations/pl';
import sv from './translations/sv';
import vi from './translations/vi';
import th from './translations/th';
import id from './translations/id';
import ms from './translations/ms';
import uk from './translations/uk';
import he from './translations/he';
import el from './translations/el';
import cs from './translations/cs';
import hu from './translations/hu';
import ro from './translations/ro';
import sk from './translations/sk';
import hr from './translations/hr';
import ca from './translations/ca';
import fi from './translations/fi';
import da from './translations/da';
import no from './translations/no';
import bg from './translations/bg';
import lt from './translations/lt';
import lv from './translations/lv';
import et from './translations/et';
import sl from './translations/sl';
import is from './translations/is';
import mt from './translations/mt';
import sq from './translations/sq';

// Create i18n instance
const i18n = new I18n({
  en,
  ko,
  ja,
  zh,
  'zh-Hans': zh, // Simplified Chinese
  'zh-Hant': zh, // Traditional Chinese (using simplified for now)
  es,
  fr,
  de,
  pt,
  'pt-BR': pt, // Brazilian Portuguese
  ru,
  ar,
  hi,
  it,
  nl,
  tr,
  pl,
  sv,
  vi,
  th,
  id,
  ms,
  uk,
  he,
  el,
  cs,
  hu,
  ro,
  sk,
  hr,
  ca,
  fi,
  da,
  no,
  bg,
  lt,
  lv,
  et,
  sl,
  is,
  mt,
  sq,
});

// Set default locale to English
i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.enableFallback = true;

// Function to set locale based on device settings
export const setI18nConfig = () => {
  const fallback = { languageTag: 'en', isRTL: false };
  
  const { languageTag, isRTL } = 
    RNLocalize.findBestLanguageTag(Object.keys(i18n.translations)) || fallback;
  
  i18n.locale = languageTag;
  
  // Return RTL status for layout adjustments if needed
  return isRTL;
};

// Initialize on app start
setI18nConfig();

export default i18n;
export const t = (key: string, options?: any) => i18n.t(key, options);