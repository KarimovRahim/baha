// src/lib/supabase.ts
import productsData from '../data/products.json';
import ordersData from '../data/orders.json';
import categoriesData from '../data/categories.json';
import telegramSettingsData from '../data/telegram_settings.json';

// Приводим импортированные JSON к типу any[], чтобы не конфликтовать с типами Supabase
const tables: Record<string, any[]> = {
  products: productsData as any[],
  orders: ordersData as any[],
  categories: categoriesData as any[],
  telegram_settings: telegramSettingsData as any[],
};

// Создаём объект, имитирующий клиент Supabase (только нужные методы)
export const supabase = {
  from(table: string) {
    return {
      select(_query: string = '*') {
        const data = tables[table] || [];
        // Имитируем асинхронное выполнение, как у Supabase
        return Promise.resolve({ data, error: null });
      },
      // Заглушки для операций записи (если они используются)
      insert(_payload: any) {
        console.warn('Локальный режим: insert не поддерживается');
        return Promise.resolve({ data: null, error: { message: 'Недоступно' } });
      },
      update(_payload: any) {
        console.warn('Локальный режим: update не поддерживается');
        return Promise.resolve({ data: null, error: { message: 'Недоступно' } });
      },
      delete() {
        console.warn('Локальный режим: delete не поддерживается');
        return Promise.resolve({ data: null, error: { message: 'Недоступно' } });
      },
      // Если использовался .eq(), .single() и т.д. — добавим позже при необходимости
    };
  },
  // Если в коде есть supabase.storage.from('images')...
  storage: {
    from(bucket: string) {
      return {
        getPublicUrl(path: string) {
          // Предполагаем, что изображения лежат в /public/images/
          return { data: { publicUrl: `/images/${path}` } };
        },
        // Остальные методы storage, если нужны, можно добавить
      };
    },
  },
};