import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key not found in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const imageMap: Record<string, string> = {
  'soup': 'src/assets/images/category_soup_1781958674730.jpg',
  'main': 'src/assets/images/category_main_1781958695540.jpg',
  'salad': 'src/assets/images/category_salad_1781958710882.jpg',
  'sides': 'src/assets/images/category_sides_1781958729435.jpg',
  'kebab': 'src/assets/images/category_kebab_1781958745236.jpg',
  'dessert': 'src/assets/images/category_dessert_1781958763079.jpg',
  'drink': 'src/assets/images/category_drink_1781958780751.jpg',
  'bread': 'src/assets/images/category_bread_1781958799946.jpg',
};

const categories = [
  { id: 1, name: 'Первые блюда', imageKey: 'soup', count: 4 },
  { id: 2, name: 'Вторые блюда', imageKey: 'main', count: 3 },
  { id: 3, name: 'Салаты', imageKey: 'salad', count: 2 },
  { id: 4, name: 'Гарниры', imageKey: 'sides', count: 2 },
  { id: 5, name: 'Шашлыки', imageKey: 'kebab', count: 3 },
  { id: 6, name: 'Десерты', imageKey: 'dessert', count: 2 },
  { id: 7, name: 'Напитки', imageKey: 'drink', count: 3 },
  { id: 8, name: 'Хлеб', imageKey: 'bread', count: 2 },
];

const products = [
  // Soups
  { id: 101, category_id: 1, name: 'Борщ Из Говядины', description: 'Сферческая подача со сметаной', price: 280, weight: '350 г', calories: '320 ккал', ingredients: 'Говядина, свёкла, капуста, картофель, морковь, лук, томатная паста, сметана', imageKey: 'soup' },
  { id: 102, category_id: 1, name: 'Традиционная Солянка', description: 'Мясная сборная', price: 320, weight: '380 г', calories: '410 ккал', ingredients: 'Говядина, колбаса копчёная, ветчина, огурцы солёные, маслины, томатная паста, лимон, сметана', imageKey: 'soup' },
  { id: 103, category_id: 1, name: 'Домашний Лагман', description: 'Домашняя лапша с нежной говядиной', price: 290, weight: '400 г', calories: '380 ккал', ingredients: 'Говядина, лапша домашняя, лук, морковь, перец болгарский, томаты, чеснок, зелень', imageKey: 'soup' },
  { id: 104, category_id: 1, name: 'Шурпа по-восточному', description: 'Наваристый бульон с бараниной', price: 310, weight: '450 г', calories: '350 ккал', ingredients: 'Баранина, картофель, морковь, лук, перец болгарский, томаты, зелень, специи', imageKey: 'soup' },
  // Mains
  { id: 201, category_id: 2, name: 'Плов Праздничный', description: 'Классический ташкентский с бараниной', price: 350, weight: '400 г', calories: '520 ккал', ingredients: 'Рис девзира, баранина, морковь, лук, чеснок, зира, барбарис, масло хлопковое', imageKey: 'main' },
  { id: 202, category_id: 2, name: 'Долма в виноградных листьях', description: 'Сочная долма ручной лепки', price: 300, weight: '300 г', calories: '290 ккал', ingredients: 'Фарш говяжий, рис, виноградные листья, лук, зелень, специи, соус сметанный', imageKey: 'main' },
  { id: 203, category_id: 2, name: 'Нежный Бефстроганов', description: 'С нежным картофельным пюре', price: 380, weight: '350 г', calories: '480 ккал', ingredients: 'Говяжья вырезка, сливки, лук, грибы шампиньоны, картофельное пюре, масло сливочное', imageKey: 'main' },
  // Salads
  { id: 301, category_id: 3, name: 'Салат Цезарь', description: 'С куриным филе и чесночными гренками', price: 240, weight: '280 г', calories: '310 ккал', ingredients: 'Куриное филе, салат айсберг, помидоры черри, пармезан, гренки, соус цезарь', imageKey: 'salad' },
  { id: 302, category_id: 3, name: 'Греческий классический', description: 'С фетой и греческими оливками', price: 220, weight: '270 г', calories: '270 ккал', ingredients: 'Помидоры, огурцы, перец болгарский, лук красный, оливки, фета, орегано, масло оливковое', imageKey: 'salad' },
  // Sides
  { id: 401, category_id: 4, name: 'Картофель фри хрустящий', description: 'С золотистой корочкой', price: 150, weight: '200 г', calories: '280 ккал', ingredients: 'Картофель, масло растительное, соль, специи, чеснок, зелень', imageKey: 'sides' },
  { id: 402, category_id: 4, name: 'Рис с овощами', description: 'Ароматный и рассыпчатый гарнир', price: 120, weight: '200 г', calories: '220 ккал', ingredients: 'Рис басмати, морковь, горошек зелёный, кукуруза, лук, масло сливочное', imageKey: 'sides' },
  // Kebabs
  { id: 501, category_id: 5, name: 'Шашлык из баранины', description: 'Сочный, маринованный по традиционному рецепту', price: 420, weight: '250 г', calories: '480 ккал', ingredients: 'Молодая баранина, лук, специи, зелень, соус томатный', imageKey: 'kebab' },
  { id: 502, category_id: 5, name: 'Шашлык из курицы', description: 'Нежное филе на раскаленных углях', price: 340, weight: '220 г', calories: '320 ккал', ingredients: 'Куриное филе, кефир, лук, чеснок, паприка, зелень', imageKey: 'kebab' },
  { id: 503, category_id: 5, name: 'Люля-кебаб из говядины', description: 'Из рубленой фермерской говядины', price: 380, weight: '200 г', calories: '400 ккал', ingredients: 'Говядина рубленая, лук, сало курдючное, зира, кориандр, перец, зелень, лаваш', imageKey: 'kebab' },
  // Desserts
  { id: 601, category_id: 6, name: 'Чизкейк Нью-Йорк', description: 'Классический Нью-Йорк с ягодами', price: 250, weight: '150 г', calories: '390 ккал', ingredients: 'Сыр сливочный креметто, печенье песочное, масло сливочное, яйца, соус ягодный', imageKey: 'dessert' },
  { id: 602, category_id: 6, name: 'Тирамису Кофейный', description: 'С нежным итальянским маскарпоне', price: 280, weight: '140 г', calories: '360 ккал', ingredients: 'Сыр маскарпоне, савоярди, кофе эспрессо, сахар, какао', imageKey: 'dessert' },
  // Drinks
  { id: 701, category_id: 7, name: 'Чай зелёный (чайник)', description: 'Заварной в чайнике 500 мл', price: 50, weight: '500 мл', calories: '5 ккал', ingredients: 'Чай зелёный элитный листовой, вода', imageKey: 'drink' },
  { id: 702, category_id: 7, name: 'Чай чёрный с лимоном (чайник)', description: 'Заварной в чайнике 500 мл', price: 60, weight: '500 мл', calories: '5 ккал', ingredients: 'Чай чёрный листовой, вода, лимон свежий', imageKey: 'drink' },
  { id: 703, category_id: 7, name: 'Фреш апельсиновый', description: 'Свежевыжатый 250 мл', price: 150, weight: '250 мл', calories: '110 ккал', ingredients: 'Отборные апельсины свежие, лёд', imageKey: 'drink' },
  // Bread
  { id: 801, category_id: 8, name: 'Лепёшка тандырная', description: 'Горячая, прямо из угли печи', price: 30, weight: '200 г', calories: '480 ккал', ingredients: 'Мука пшеничная высшего сорта, вода, дрожжи, соль, кунжут', imageKey: 'bread' },
  { id: 802, category_id: 8, name: 'Самса слоеная тандырная', description: 'С сочной рубленой бараниной', price: 80, weight: '120 г', calories: '310 ккал', ingredients: 'Мука, баранина, лук, жир курдючный, зира, перец, соль, кунжут черный', imageKey: 'bread' },
];

async function runMigration() {
  console.log('Starting migration...');

  // 1. Upload Images
  const uploadedUrls: Record<string, string> = {};
  for (const [key, imagePath] of Object.entries(imageMap)) {
    const fullPath = path.resolve(__dirname, '..', imagePath);
    if (fs.existsSync(fullPath)) {
      console.log(`Uploading ${key}...`);
      const buffer = fs.readFileSync(fullPath);
      const fileName = path.basename(imagePath);
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });
        
      if (error) {
        console.error(`Error uploading ${key}:`, error.message);
      } else {
        const { data: publicData } = supabase.storage.from('images').getPublicUrl(fileName);
        uploadedUrls[key] = publicData.publicUrl;
        console.log(`Uploaded ${key} -> ${publicData.publicUrl}`);
      }
    } else {
      console.log(`File not found: ${fullPath}`);
    }
  }

  // 2. Insert Categories
  console.log('Inserting categories...');
  for (const cat of categories) {
    const imageUrl = uploadedUrls[cat.imageKey] || '';
    const { error } = await supabase.from('categories').upsert({
      id: cat.id,
      name: cat.name,
      item_count: cat.count,
      image_url: imageUrl,
    });
    if (error) {
      console.error(`Error inserting category ${cat.name}:`, error.message);
    }
  }

  // 3. Insert Products
  console.log('Inserting products...');
  for (const prod of products) {
    const imageUrl = uploadedUrls[prod.imageKey] || '';
    const { error } = await supabase.from('products').upsert({
      id: prod.id,
      category_id: prod.category_id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      weight: prod.weight,
      calories: prod.calories,
      ingredients: prod.ingredients,
      image_url: imageUrl,
    });
    if (error) {
       console.error(`Error inserting product ${prod.name}:`, error.message);
    }
  }

  console.log('Migration completed successfully!');
}

runMigration().catch(console.error);
