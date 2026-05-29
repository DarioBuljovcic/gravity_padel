import { cookies } from 'next/headers';
import { createTranslator } from 'next-intl';

const locales = ['sr', 'en', 'hu'];
const defaultLocale = 'sr';

export async function getLocale() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
  
  if (!locales.includes(locale)) {
    return defaultLocale;
  }
  
  return locale;
}

export async function getMessages(locale: string) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    return (await import(`../messages/${defaultLocale}.json`)).default;
  }
}

export async function getTranslations(namespace?: string) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  return createTranslator({ locale, messages, namespace });
}
