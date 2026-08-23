import { useTranslation } from "react-i18next";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../pages/MenuPage';
interface MenuContextProps {
  categories: any[];
  productsData: Record<number, Product[]>;
  loadingData: boolean;
  productsLoading: Record<number, boolean>;
  refreshMenu: () => void;
}
const MenuContext = createContext<MenuContextProps | undefined>(undefined);
export const MenuProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const {
    t
  } = useTranslation();
  const [categories, setCategories] = useState<any[]>([]);
  const [productsData, setProductsData] = useState<Record<number, Product[]>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [productsLoading, setProductsLoading] = useState<Record<number, boolean>>({});
  const fetchData = async () => {
    try {
      const {
        data: catsData,
        error: catsError
      } = await supabase.from('categories').select('*').order('id');
      if (catsError) throw catsError;
      const mappedCategories = (catsData || []).map(c => ({
        id: c.id,
        name: c.name,
        name_en: c.name_en,
        image: c.image_url,
        count: c.item_count
      }));
      const categoryOrder = [t("str_156").toLowerCase(), t("str_157").toLowerCase(), t("str_158").toLowerCase(), t("str_159").toLowerCase(), t("str_160").toLowerCase(), t("str_161").toLowerCase(), t("str_162").toLowerCase(), "напитки", "спиртн"];
      mappedCategories.sort((a, b) => {
        let indexA = categoryOrder.findIndex(name => a.name.toLowerCase().includes(name) || name.includes(a.name.toLowerCase()));
        let indexB = categoryOrder.findIndex(name => b.name.toLowerCase().includes(name) || name.includes(b.name.toLowerCase()));
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        return indexA - indexB;
      });
      setCategories(mappedCategories);
      const initialProductsData: Record<number, Product[]> = {};
      const initialProductsLoading: Record<number, boolean> = {};
      mappedCategories.forEach(c => {
        initialProductsData[c.id] = [];
        initialProductsLoading[c.id] = false;
      });

      const { data: prodsData, error: prodsError } = await supabase.from('products').select('*').order('id');
      if (!prodsError && prodsData) {
        prodsData.forEach(p => {
          if (!initialProductsData[p.category_id]) {
            initialProductsData[p.category_id] = [];
          }
          initialProductsData[p.category_id].push({
            id: p.id,
            category_id: p.category_id,
            name: p.name,
            description: p.description,
            price: p.price,
            weight: p.weight,
            calories: p.calories,
            ingredients: p.ingredients,
            image: p.image_url,
            name_en: p.name_en,
            description_en: p.description_en,
            ingredients_en: p.ingredients_en,
            has_half_portion: p.has_half_portion,
            half_portion_price: p.half_portion_price,
            has_sizes: p.has_sizes,
            size_small_price: p.size_small_price,
            size_medium_price: p.size_medium_price,
            size_large_price: p.size_large_price,
            container_type: p.container_type
          });
        });
      }

      setProductsData(initialProductsData);
      setProductsLoading(initialProductsLoading);
      setLoadingData(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoadingData(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return <MenuContext.Provider value={{
    categories,
    productsData,
    loadingData,
    productsLoading,
    refreshMenu: fetchData
  }}>
      {children}
    </MenuContext.Provider>;
};
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
