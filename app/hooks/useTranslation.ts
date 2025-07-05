import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Language } from '../types';

// Dynamically import translations
const loadTranslations = async (lang: Language) => {
  switch (lang) {
    case Language.EN:
      return (await import('../locales/en.json')).default;
    case Language.BN:
      return (await import('../locales/bn.json')).default;
    case Language.NL:
      return (await import('../locales/nl.json')).default;
    case Language.ES:
      return (await import('../locales/es.json')).default;
    case Language.PT:
      return (await import('../locales/pt.json')).default;
    case Language.AR:
      return (await import('../locales/ar.json')).default;
    default:
      return (await import('../locales/en.json')).default;
  }
};

export const useTranslation = () => {
  const { settings } = useStore();
  const [t, setT] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (settings.language) {
      setLoading(true);
      loadTranslations(settings.language).then(translations => {
        setT(translations);
        setLoading(false);
      });
    }
  }, [settings.language]);

  return { t, loading };
};
