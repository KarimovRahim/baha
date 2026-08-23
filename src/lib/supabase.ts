// src/lib/supabase.ts
import productsData from '../data/products.json';
import ordersData from '../data/orders.json';
import categoriesData from '../data/categories.json';
import telegramSettingsData from '../data/telegram_settings.json';

const tables: Record<string, any[]> = {
  products: productsData as any[],
  orders: ordersData as any[],
  categories: categoriesData as any[],
  telegram_settings: telegramSettingsData as any[],
};

function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const supabase = {
  from(table: string) {
    let filters: Array<{ column: string; value: any }> = [];
    let orderBy: { column: string; ascending: boolean } | null = null;
    let limitCount: number | null = null;
    let singleMode: 'single' | 'maybeSingle' | null = null;
    let countQuery = false;
    let headMode = false;
    let operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert' = 'select';
    let payloadForOperation: any = null;

    const execute = async (): Promise<any> => {
      if (operation === 'select') {
        let data = tables[table] ? [...tables[table]] : [];

        if (filters.length > 0) {
          data = data.filter(row => filters.every(f => row[f.column] === f.value));
        }

        if (orderBy) {
          data.sort((a, b) => {
            const aVal = a[orderBy!.column];
            const bVal = b[orderBy!.column];
            if (aVal < bVal) return orderBy!.ascending ? -1 : 1;
            if (aVal > bVal) return orderBy!.ascending ? 1 : -1;
            return 0;
          });
        }

        if (limitCount !== null) {
          data = data.slice(0, limitCount);
        }

        if (headMode) {
          return { data: null, count: data.length, error: null };
        }

        if (singleMode === 'single') {
          if (data.length === 0) {
            return { data: null, error: { message: 'Не найдено ни одной записи' } };
          } else if (data.length > 1) {
            return { data: null, error: { message: 'Найдено более одной записи' } };
          } else {
            return { data: data[0], error: null };
          }
        } else if (singleMode === 'maybeSingle') {
          return { data: data.length > 0 ? data[0] : null, error: null };
        }

        if (countQuery) {
          return { data, count: data.length, error: null };
        }
        return { data, error: null };
      } else if (operation === 'insert') {
        const newRecord = { ...payloadForOperation };
        if (!newRecord.id) {
          newRecord.id = generateId();
        }
        return { data: [newRecord], error: null };
      } else if (operation === 'update') {
        return { data: [payloadForOperation], error: null };
      } else if (operation === 'delete') {
        return { data: null, error: null };
      } else if (operation === 'upsert') {
        return { data: null, error: null, success: true };
      }
      return { data: null, error: null };
    };

    const builder: any = {
      select(query = '*', options?: { count?: string; head?: boolean }) {
        if (options?.count === 'exact') countQuery = true;
        if (options?.head === true) headMode = true;
        return builder;
      },
      eq(column: string, value: any) {
        filters.push({ column, value });
        return builder;
      },
      order(column: string, options?: { ascending?: boolean }) {
        orderBy = { column, ascending: options?.ascending ?? true };
        return builder;
      },
      limit(count: number) {
        limitCount = count;
        return builder;
      },
      single() {
        singleMode = 'single';
        return builder.execute();
      },
      maybeSingle() {
        singleMode = 'maybeSingle';
        return builder.execute();
      },
      insert(payload: any) {
        operation = 'insert';
        payloadForOperation = payload;
        return builder;
      },
      update(payload: any) {
        operation = 'update';
        payloadForOperation = payload;
        return builder;
      },
      upsert(payload: any) {
        operation = 'upsert';
        payloadForOperation = payload;
        return builder;
      },
      delete() {
        operation = 'delete';
        return builder;
      },
      execute: () => execute(),
      then(resolve: any, reject: any) {
        return execute().then(resolve, reject);
      },
    };

    return builder;
  },
  storage: {
    from(bucket: string) {
      return {
        getPublicUrl(path: string) {
          return { data: { publicUrl: `/images/${path}` } };
        },
      };
    },
  },
};
