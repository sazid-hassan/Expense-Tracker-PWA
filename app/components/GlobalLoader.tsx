'use client';

import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import Loader from './Loader';

export default function GlobalLoader() {
  const { loading } = useStore();
  const { t } = useTranslation();

  if (!loading.isLoading) {
    return null;
  }

  return (
    <Loader
      variant={loading.variant || 'spinner'}
      message={loading.message || t.loading}
      fullScreen
      size="large"
      backgroundColor="rgba(255, 255, 255, 0.9)"
    />
  );
}
