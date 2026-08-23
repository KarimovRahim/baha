import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useRef } from 'react';
import { Phone, MapPin, Search, Sun, Moon, Clock, Star, ChevronRight, ChevronLeft, Plus, Minus, ShoppingBag, X, Heart, Info, Trash2, Box, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus as FiPlusIcon, FiMinus as FiMinusIcon, FiShoppingCart, FiCheck, FiClock as FiClockIcon, FiHeart as FiHeartIcon, FiInfo as FiInfoIcon } from 'react-icons/fi';
import { FaFire, FaLeaf, FaStar } from 'react-icons/fa';
import { GiChefToque } from 'react-icons/gi';
import { useTheme } from '../contexts/ThemeContext'
import { LangToggle } from '../components/LangToggle';;
import { useMenu } from '../contexts/MenuContext';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sendOrderNotification } from '../lib/telegram';
const LOGO_PATH = '/logo.webp';
export interface Product {
  id: number;
  category_id: number;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  price: number;
  weight?: string;
  calories?: string;
  ingredients?: string;
  ingredients_en?: string;
  image: string;
  has_half_portion?: boolean;
  half_portion_price?: number;
  has_sizes?: boolean;
  size_small_price?: number;
  size_medium_price?: number;
  size_large_price?: number;
  container_type?: string;
  selectedPortion?: 'full' | 'half' | 'small' | 'medium' | 'large';
}
const MenuPage = () => {
  const { t, i18n } = useTranslation();
  const {
    categories: allCategories,
    productsData,
    loadingData,
    productsLoading
  } = useMenu();
  const categories = allCategories.filter(c => !c.name.toLowerCase().includes('спиртн') && !(c.name_en && c.name_en.toLowerCase().includes('alcohol')) && !c.name.toLowerCase().includes(t("str_1").toLowerCase()));
  const alcoholCategory = allCategories.find(c => c.name.toLowerCase().includes('спиртн') || (c.name_en && c.name_en.toLowerCase().includes('alcohol')) || c.name.toLowerCase().includes(t("str_1").toLowerCase()));
  const [showAlcoholModal, setShowAlcoholModal] = useState(false);
  const {
    theme,
    toggleTheme
  } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const lastTapTime = React.useRef(0);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  useEffect(() => {
    if (categories.length > 0 && activeCategory === null) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);
  useEffect(() => {
    if (activeCategory) {
      const navBtns = document.querySelectorAll(`[id^="nav-category-header-${activeCategory}"]`);
      navBtns.forEach(btn => {
        btn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      });
    }
  }, [activeCategory]);
  useEffect(() => {
    const handleScroll = () => {
      let currentActive: number | null = null;
      const offset = 140; // where the sticky nav ends approximately

      for (const cat of categories) {
        const mobileEl = document.getElementById(`mobile-category-${cat.id}`);
        const desktopEl = document.getElementById(`desktop-category-${cat.id}`);
        const isDesktop = window.innerWidth >= 1024;
        const el = isDesktop ? desktopEl : mobileEl;
        if (el && el.offsetParent) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset + 100 && rect.bottom > offset) {
            currentActive = cat.id;
            break;
          }
        }
      }
      if (currentActive && currentActive !== activeCategory) {
        setActiveCategory(currentActive);
      }

      // Auto-update to the first category if we scroll all the way up
      if (window.scrollY < 100 && categories.length > 0) {
        setActiveCategory(categories[0].id);
      }
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, activeCategory]);
  const scrollToCategory = (categoryId: number) => {
    const mobileEl = document.getElementById(`mobile-category-${categoryId}`);
    const desktopEl = document.getElementById(`desktop-category-${categoryId}`);
    const isDesktop = window.innerWidth >= 1024;
    const element = isDesktop ? desktopEl : mobileEl;
    if (element && element.offsetParent) {
      const offset = 140; // Adjust for sticky header + category nav
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
      setActiveCategory(categoryId);
    }
  };
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('baxtiyor_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const topRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setIsVisible(true);
    setIsRendering(true);
  }, []);
  useEffect(() => {
    localStorage.setItem('baxtiyor_favorites', JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('baxtiyor_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        const migrated: Record<string, number> = {};
        Object.entries(parsed).forEach(([k, v]) => {
          if (!k.includes('_')) {
            migrated[`${k}_full`] = v as number;
          } else {
            migrated[k] = v as number;
          }
        });
        setCart(migrated);
      }
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem('baxtiyor_cart', JSON.stringify(cart));
  }, [cart]);
  const addToCart = (productId: number, portion: Product['selectedPortion'] = 'full') => {
    const key = `${productId}_${portion}`;
    setCart(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
  };
  const removeFromCart = (productId: number, portion: Product['selectedPortion'] = 'full') => {
    const key = `${productId}_${portion}`;
    setCart(prev => {
      const newCart = {
        ...prev
      };
      if (newCart[key] > 1) {
        newCart[key]--;
      } else {
        delete newCart[key];
      }
      return newCart;
    });
  };
  const removeItemCompletely = (cartKey: string) => {
    setCart(prev => {
      const newCart = {
        ...prev
      };
      delete newCart[cartKey];
      return newCart;
    });
  };
  const toggleFavorite = (productId: number) => {
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };
  const getCartCount = (productId: number, portion: Product['selectedPortion'] = 'full') => cart[`${productId}_${portion}`] || 0;
  const getTotalItems = () => Object.values(cart).reduce((sum: number, count: any) => sum + (count as number), 0);

  // Helper: определяем, является ли категория салатами
  const isSaladCategory = (category: any) => {
    const name = category.name?.toLowerCase() || '';
    const nameEn = category.name_en?.toLowerCase() || '';
    return name.includes('салат') || nameEn.includes('salad');
  };

  const getContainers = () => {
    let totalKebabs = 0;
    let totalSmall = 0;
    let totalLargeBox = 0;

    const largeBoxNames = [
      'ташкентское блюдо [1кг]',
      'блюдо от шефа',
      'блюдо "регистан"',
      'баран-лопатка',
      'ассорти новинка',
      'ассорти бахтиёр',
      'ассорти бахтиёр plus',
      'ташкентское блюдо',
      'регистан',
      'баран лопатка'
    ];

    Object.entries(cart).forEach(([cartKey, count]) => {
      const [idStr] = cartKey.split('_');
      const productId = parseInt(idStr);
      const product = Object.values(productsData).flat().find((p: any) => p.id === productId) as any;
      if (!product) return;
      
      const category = allCategories.find(c => c.id === product.category_id);
      if (!category) return;
      
      const catName = category.name.toLowerCase();
      const catNameEn = category.name_en ? category.name_en.toLowerCase() : '';
      const prodName = product.name.toLowerCase();

      // Сначала проверяем поле container_type из базы данных Supabase
      if (product.container_type === 'large_box') {
        totalLargeBox += (count as number);
      } else if (product.container_type === 'small') {
        totalSmall += (count as number);
      } else if (product.container_type === 'kebab') {
        totalKebabs += (count as number);
      } else {
        // Резервная логика (fallback), если container_type в БД еще не заполнен
        if (product.category_id === 2) {
          if (largeBoxNames.some(name => prodName.includes(name))) {
            totalLargeBox += (count as number);
          } else {
            totalSmall += (count as number);
          }
        } else if (catName.includes('шашлык') || catNameEn.includes('kebab')) {
          totalKebabs += (count as number);
        } else if (catName.includes('перв') || catNameEn.includes('soup') || catName.includes('салат') || catNameEn.includes('salad') || catName.includes('гарнир') || catNameEn.includes('side')) {
          totalSmall += (count as number);
        }
      }
    });

    const containers: { name: string; price: number; count: number }[] = [];

    if (totalLargeBox > 0) {
      containers.push({ name: i18n.resolvedLanguage === 'en' ? 'Large signature box' : 'Фирменная упаковка большая', price: 10, count: totalLargeBox });
    }

    if (totalSmall > 0) {
      containers.push({ name: i18n.resolvedLanguage === 'en' ? 'Small signature container' : 'Фирменный ланчик маленький', price: 2, count: totalSmall });
    }

    if (totalKebabs > 0) {
      const largeCount = Math.floor(totalKebabs / 10) + (totalKebabs % 10 > 6 ? 1 : 0);
      const kebabCount = (totalKebabs % 10 > 0 && totalKebabs % 10 <= 6) ? 1 : 0;
      
      if (largeCount > 0) {
        containers.push({ name: i18n.resolvedLanguage === 'en' ? 'Large container' : 'Ланчик большой', price: 5, count: largeCount });
      }
      if (kebabCount > 0) {
        containers.push({ name: i18n.resolvedLanguage === 'en' ? 'Kebab container' : 'Ланчик для шашлыка', price: 2, count: kebabCount });
      }
    }

    return containers;
  };

  const getTotalPrice = () => {
    let sum = Object.entries(cart).reduce((sum, [cartKey, count]) => {
      const [idStr, portion] = cartKey.split('_');
      const productId = parseInt(idStr);
      const product = Object.values(productsData).flat().find((p: any) => p.id === productId) as any;
      let itemPrice = product?.price || 0;
      if (portion === 'half' && product?.has_half_portion) itemPrice = product.half_portion_price || 0;else if (portion === 'small' && product?.has_sizes) itemPrice = product.size_small_price || 0;else if (portion === 'medium' && product?.has_sizes) itemPrice = product.size_medium_price || 0;else if (portion === 'large' && product?.has_sizes) itemPrice = product.size_large_price || 0;      return sum + itemPrice * (count as number);
    }, 0);
    
    const containers = getContainers();
    containers.forEach(c => sum += c.price * c.count);
    return sum;
  };
  const handleProductClick = (product: any) => {
    const defaultPortion = product.has_sizes ? 'small' : 'full';
    setSelectedProduct({
      ...product,
      selectedPortion: defaultPortion
    });
    setShowProductModal(true);
  };
  const handleCheckoutSuccess = async (customerName: string, customerPhone: string, customerAddress: string, branch: string = t("str_2"), paymentMethod: string = 'cash', paymentBank: string = '') => {
    const total = getTotalPrice();
    const orderedItems = Object.entries(cart).map(([cartKey, count]) => {
      const [idStr, portion] = cartKey.split('_');
      const productId = parseInt(idStr);
      const product = Object.values(productsData).flat().find((p: any) => p.id === productId) as any;
      let nameSuffix = '';
      if (portion === 'half') nameSuffix = t("str_3");else if (portion === 'small') nameSuffix = t("str_4");else if (portion === 'medium') nameSuffix = t("str_5");else if (portion === 'large') nameSuffix = t("str_6");
      let itemPrice = product?.price || 0;
      if (portion === 'half' && product?.has_half_portion) itemPrice = product.half_portion_price;else if (portion === 'small' && product?.has_sizes) itemPrice = product.size_small_price;else if (portion === 'medium' && product?.has_sizes) itemPrice = product.size_medium_price;else if (portion === 'large' && product?.has_sizes) itemPrice = product.size_large_price;
      return {
        product_id: productId,
        name: `${product?.name}${nameSuffix}`,
        price: itemPrice,
        quantity: count as number
      };
    });



    const containers = getContainers();
    containers.forEach(c => {
      orderedItems.push({
        product_id: 0,
        name: c.name,
        price: c.price,
        quantity: c.count
      });
    });

    // Fetch next sequential order number
    let orderNum = 1;
    try {
      const {
        count
      } = await supabase.from('orders').select('*', {
        count: 'exact',
        head: true
      });
      orderNum = (count || 0) + 1;
    } catch (e) {
      console.warn('Could not fetch order count for sequential numbering, defaulting to 1:', e);
    }

    // Prepare address with payment method in case the table doesn't have custom columns yet
    const paymentLabel = paymentMethod === 'bank' ? `Банк (${paymentBank})` : t("str_8");
    const addressWithPayment = `${customerAddress} [Оплата: ${paymentLabel}]`;
    try {
      // Try saving order with the new structured columns
      const {
        data,
        error
      } = await supabase.from('orders').insert({
        total_price: total,
        items: orderedItems,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: addressWithPayment,
        branch: branch,
        status: 'pending',
        order_number: orderNum,
        payment_method: paymentMethod,
        payment_bank: paymentBank
      }).select();
      if (error) {
        console.warn('Initial insert failed, attempting fallback (without new columns):', error);
        // Fallback for when the columns do not exist yet in Supabase or caused a connection drop
        const {
          data: fallbackData,
          error: fallbackError
        } = await supabase.from('orders').insert({
          total_price: total,
          items: orderedItems,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: addressWithPayment,
          branch: branch,
          status: 'pending'
        }).select();
        if (fallbackError) {
          console.error('Fallback save error:', fallbackError);
          // Send to Telegram anyway so the restaurant doesn't lose the order!
          const offlineOrder = {
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_address: addressWithPayment + t("str_10"),
            total_price: total,
            branch: branch,
            items: orderedItems,
            status: 'pending',
            order_number: orderNum,
            payment_method: paymentMethod,
            payment_bank: paymentBank
          };
          sendOrderNotification(offlineOrder).catch(err => {
            console.error('Error sending Telegram notification offline:', err);
          });
        } else {
          const savedOrder = fallbackData && fallbackData[0] ? fallbackData[0] : {
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_address: addressWithPayment,
            total_price: total,
            branch: branch,
            items: orderedItems,
            status: 'pending'
          };
          // Augment with computed properties for formatting the Telegram alert
          savedOrder.order_number = orderNum;
          savedOrder.payment_method = paymentMethod;
          savedOrder.payment_bank = paymentBank;
          sendOrderNotification(savedOrder).then(async tgRes => {
            if (tgRes && tgRes.success && tgRes.message_id && tgRes.chat_id && savedOrder.id) {
              const updatedAddress = `${addressWithPayment} tg_msg_id:${tgRes.message_id} tg_chat_id:${tgRes.chat_id}`;
              await supabase.from('orders').update({
                customer_address: updatedAddress
              }).eq('id', savedOrder.id);
            }
          }).catch(err => {
            console.error('Error sending Telegram notification:', err);
          });
        }
      } else {
        // Successful save with full columns!
        const savedOrder = data && data[0] ? data[0] : null;
        if (savedOrder) {
          sendOrderNotification(savedOrder).then(async tgRes => {
            if (tgRes && tgRes.success && tgRes.message_id && tgRes.chat_id) {
              // Store Telegram message reference in the database to edit it later on status change
              await supabase.from('orders').update({
                telegram_message_id: tgRes.message_id,
                telegram_chat_id: tgRes.chat_id
              }).eq('id', savedOrder.id);
            }
          }).catch(err => {
            console.error('Error sending Telegram notification:', err);
          });
        }
      }
    } catch (err) {
      console.error('Exception saving order:', err);
    }
    setOrderTotal(total);
    setShowOrderSuccess(true);
    setShowCart(false);
    setCart({});
  };
  const restaurantInfo = {
    fullName: t("str_11"),
    description: t("str_12"),
    hours: '9:00 - 22:00',
    locations: [{
      address: t("str_13"),
      phone: '93 888 24 24'
    }, {
      address: t("str_14"),
      phone: '99 300 57 57'
    }]
  };
  return <div className='min-h-screen transition-all duration-500 overflow-x-hidden' style={{
    background: 'var(--bg-page-gradient)'
  }}>
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        {[...Array(15)].map((_, i) => <div key={i} className='absolute rounded-full' style={{
        width: `${50 + Math.random() * 120}px`,
        height: `${50 + Math.random() * 120}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        background: i % 2 === 0 ? 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)' : 'radial-gradient(circle, var(--accent-gold-light) 0%, transparent 70%)',
        opacity: theme === 'dark' ? 0.03 + Math.random() * 0.04 : 0.02 + Math.random() * 0.03,
        animation: `float ${12 + Math.random() * 20}s ease-in-out infinite ${Math.random() * 5}s`,
        filter: `blur(${15 + Math.random() * 15}px)`
      }} />)}
      </div>

      <div className='relative z-10' ref={topRef}>
        <div className='fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl transition-all' style={{
        background: 'color-mix(in srgb, var(--bg-card) 60%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--border-color) 30%, transparent)',
        boxShadow: 'var(--shadow-sm)'
      }}>
          <div className='max-w-7xl mx-auto px-4 py-3'>
            <div className='flex items-center justify-between'>
              <Link to='/' className='flex items-center gap-3 group'>
                <div className='w-10 h-10 rounded-xl overflow-hidden shrink-0 transition-all duration-500 group-hover:scale-105' style={{
                boxShadow: 'var(--shadow-gold)',
                border: '1.5px solid var(--accent-gold)'
              }}>
                  <img src={LOGO_PATH} alt={t("str_15")} className='w-full h-full object-cover' />
                </div>
                <div className='hidden sm:block'>
                  <h2 className='text-sm font-serif font-bold' style={{
                  color: 'var(--text-primary)'
                }}>
                    BAXTIYOR
                  </h2>
                  <p className='text-[9px] tracking-wider' style={{
                  color: 'var(--accent-gold)'
                }}>{t("str_16")}</p>
                </div>
              </Link>

              <div className='absolute left-1/2 -translate-x-1/2 flex items-center justify-center'>
                <h1 className='text-lg sm:text-xl font-serif font-bold leading-tight' style={{
                color: 'var(--text-primary)'
              }}>{t("str_17")}</h1>
              </div>

              <div className='flex items-center gap-3 sm:gap-4'>
                <button onClick={() => setShowCart(true)} className='relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105' style={{
                backgroundColor: 'var(--toggle-bg)',
                color: 'var(--toggle-text)',
                border: '1px solid var(--border-color)'
              }}>
                  <ShoppingBag size={18} />
                  {getTotalItems() as number > 0 && <span className='absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white' style={{
                  background: 'var(--accent-gold)'
                }}>
                      {getTotalItems()}
                    </span>}
                </button>

                <button onClick={toggleTheme} className='w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105' style={{
                backgroundColor: 'var(--toggle-bg)',
                color: 'var(--toggle-text)',
                border: '1px solid var(--border-color)'
              }}>
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <LangToggle />
              </div>
            </div>

            {/* Global Category Nav in Header */}
            {categories.length > 0 && <div className='flex gap-2 overflow-x-auto mt-4 pb-1 no-scrollbar'>
                {categories.map(cat => <button key={cat.id} id={`nav-category-header-${cat.id}`} onClick={e => {
              const catName = i18n.resolvedLanguage === 'en' && cat.name_en ? cat.name_en : cat.name;
              
              
              
              scrollToCategory(cat.id);
            }} className='flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full whitespace-nowrap transition-all duration-300 hover:scale-105 touch-manipulation' style={{
              background: activeCategory === cat.id ? 'var(--accent-gold)' : 'color-mix(in srgb, var(--bg-card) 50%, transparent)',
              color: activeCategory === cat.id ? 'white' : 'var(--text-secondary)',
              border: activeCategory === cat.id ? '1px solid var(--accent-gold)' : '1px solid color-mix(in srgb, var(--border-color) 40%, transparent)',
              boxShadow: activeCategory === cat.id ? 'var(--shadow-gold)' : 'none'
            }}>
                    <span className='text-sm sm:text-base font-medium'>{i18n.resolvedLanguage === 'en' && cat.name_en ? cat.name_en : t(cat.name)}</span>
                    <span className='text-xs sm:text-sm opacity-60'>({cat.count})</span>
                  </button>)}
              </div>}
          </div>
        </div>

        <div className='lg:hidden pt-[140px]'>
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className='px-4 pt-4 animate-slide-left' style={{
            animationFillMode: 'forwards'
          }}>
              <h2 className='text-2xl font-serif font-bold mb-3' style={{
              color: 'var(--text-primary)'
            }}>
                {restaurantInfo.fullName}
              </h2>

              <div className='space-y-2 mb-4'>
                {restaurantInfo.locations.map((loc, idx) => <div key={idx} className='space-y-1'>
                    <div className='flex items-center gap-2 text-sm' style={{
                  color: 'var(--text-muted)'
                }}>
                      <MapPin size={14} />
                      <span>{loc.address}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm' style={{
                  color: 'var(--accent-gold)'
                }}>
                      <Phone size={14} />
                      <span className='font-medium'>{loc.phone}</span>
                    </div>
                  </div>)}
                <div className='flex items-center gap-2 text-sm mt-1' style={{
                color: 'var(--text-muted)'
              }}>
                  <Clock size={14} />
                  <span>{restaurantInfo.hours}</span>
                </div>
              </div>

              <div className='mb-5 p-4 rounded-xl' style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} style={{
                    color: 'var(--accent-gold)'
                  }} fill='var(--accent-gold)' />)}
                  </div>
                  <span className='font-semibold text-sm' style={{
                  color: 'var(--text-primary)'
                }}>{t("str_19")}</span>
                </div>
                <p className='text-sm leading-relaxed' style={{
                color: 'var(--text-secondary)'
              }}>
                  {restaurantInfo.description}
                </p>
                <div className='mt-3 text-xs italic opacity-60' style={{
                color: 'var(--text-muted)'
              }}>
                  <p>{t("str_20")}</p>
                  <p>{t("str_21")}</p>
                </div>
              </div>

              <div className='mb-2'>
                <div className='relative'>
                  <Search size={18} className='absolute left-3 top-1/2 -translate-y-1/2' style={{
                  color: 'var(--text-muted)'
                }} />
                  <input type='text' placeholder={t("str_22")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className='w-full pl-10 pr-4 py-3 rounded-xl outline-none' style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }} />
                </div>
              </div>
            </div>

            {/* Categories and Products */}
            <div className='px-4 pb-6 mt-4 space-y-10'>
{!isRendering ? <div className='flex justify-center p-8'><div className='w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin'></div></div> : <>
              {categories.map(category => {
              const isLoading = productsLoading[category.id];
              const products = productsData[category.id] || [];
              const sortedProducts = isSaladCategory(category) ? [...products].reverse() : products;
              const filteredProducts = searchQuery ? sortedProducts.filter(p => {
                const nameMatch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.name_en || '').toLowerCase().includes(searchQuery.toLowerCase());
                const descMatch = (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.description_en || '').toLowerCase().includes(searchQuery.toLowerCase());
                return nameMatch || descMatch;
              }) : sortedProducts;
              if (!isLoading && filteredProducts.length === 0) return null;
              return <div key={category.id} id={`mobile-category-${category.id}`} className='scroll-mt-36'>
                    <h3 className='text-xl font-serif font-bold mb-4' style={{
                  color: 'var(--text-primary)'
                }}>
                      {i18n.resolvedLanguage === 'en' && category.name_en ? category.name_en : t(category.name)}
                    </h3>
                    <div className='grid grid-cols-2 gap-3'>
                      {isLoading ? [...Array(4)].map((_, idx) => <div key={idx} className="animate-pulse rounded-2xl overflow-hidden" style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)'
                  }}>
                            <div className="h-32 sm:h-48 bg-gray-200 dark:bg-gray-700/50"></div>
                            <div className="p-2.5 sm:p-4 space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700/50 rounded w-1/2"></div>
                              <div className="pt-2"><div className="h-6 bg-gray-200 dark:bg-gray-700/50 rounded w-1/3"></div></div>
                            </div>
                          </div>) : filteredProducts.map((product, idx) => <ProductCard key={product.id} product={product} index={idx} getCartCount={getCartCount} onAdd={addToCart} onRemove={removeFromCart} isFavorite={favorites.includes(product.id)} onToggleFavorite={toggleFavorite} onClick={() => handleProductClick(product)} />)}
                    </div>
                  </div>;
            })}
            </>}
            {alcoholCategory && (
              <div className="flex justify-center mt-6 pb-4">
                <button 
                  onClick={() => setShowAlcoholModal(true)} 
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105" 
                  style={{ 
                    background: 'color-mix(in srgb, var(--accent-gold) 10%, transparent)', 
                    border: '1px solid var(--accent-gold)', 
                    boxShadow: 'var(--shadow-sm)' 
                  }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-gold)', color: 'white' }}>
                    <FaFire size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-medium opacity-80" style={{ color: 'var(--text-secondary)' }}>
                      {i18n.resolvedLanguage === 'en' ? 'Also available' : 'Также в наличии'}
                    </span>
                    <span className="block text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {i18n.resolvedLanguage === 'en' && alcoholCategory.name_en ? alcoholCategory.name_en : t(alcoholCategory.name)} 18+
                    </span>
                  </div>
                  <div className="ml-2">
                    <ChevronRight size={24} style={{ color: 'var(--accent-gold)' }} />
                  </div>
                </button>
              </div>
            )}
            </div>
          </div>
        </div>

        <div className='hidden lg:block pt-[140px]'>
          <div className={`max-w-7xl mx-auto px-6 py-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className='animate-slide-left' style={{
            animationFillMode: 'forwards'
          }}>
              <div className='grid grid-cols-2 gap-6 mb-8'>
                <div className='relative p-6 rounded-2xl overflow-hidden group' style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)'
              }}>
                  <h2 className='text-3xl font-serif font-bold mb-4' style={{
                  color: 'var(--text-primary)'
                }}>
                    {restaurantInfo.fullName}
                  </h2>
                  <div className='space-y-3 mb-4'>
                    {restaurantInfo.locations.map((loc, idx) => <div key={idx} className='space-y-1'>
                        <div className='flex items-center gap-2' style={{
                      color: 'var(--text-muted)'
                    }}>
                          <MapPin size={16} />
                          <span>{loc.address}</span>
                        </div>
                        <div className='flex items-center gap-2' style={{
                      color: 'var(--accent-gold)'
                    }}>
                          <Phone size={16} />
                          <span className='font-medium'>{loc.phone}</span>
                        </div>
                      </div>)}
                    <div className='flex items-center gap-2 pt-1' style={{
                    color: 'var(--text-muted)'
                  }}>
                      <Clock size={16} />
                      <span>{restaurantInfo.hours}</span>
                    </div>
                  </div>
                </div>

                <div className='relative p-6 rounded-2xl group' style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)'
              }}>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='flex'>
                      {[...Array(5)].map((_, i) => <Star key={i} size={20} style={{
                      color: 'var(--accent-gold)'
                    }} fill='var(--accent-gold)' />)}
                    </div>
                    <span className='font-bold text-lg' style={{
                    color: 'var(--text-primary)'
                  }}>{t("str_19")}</span>
                  </div>
                  <p className='text-base leading-relaxed mb-4' style={{
                  color: 'var(--text-secondary)'
                }}>
                    {restaurantInfo.description}
                  </p>
                  <div className='text-sm italic opacity-60' style={{
                  color: 'var(--text-muted)'
                }}>
                    <p>{t("str_20")}</p>
                    <p>{t("str_21")}</p>
                  </div>
                </div>
              </div>

              <div className='mb-6'>
                <div className='max-w-md relative'>
                  <Search size={20} className='absolute left-4 top-1/2 -translate-y-1/2' style={{
                  color: 'var(--text-muted)'
                }} />
                  <input type='text' placeholder={t("str_22")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className='w-full pl-12 pr-5 py-3.5 rounded-xl outline-none text-base' style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }} />
                </div>
              </div>
            </div>

            {/* Categories and Products */}
            <div className='space-y-12 pb-8'>
{!isRendering ? <div className='flex justify-center p-8'><div className='w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin'></div></div> : <>
              {categories.map(category => {
              const isLoading = productsLoading[category.id];
              const products = productsData[category.id] || [];
              const sortedProducts = isSaladCategory(category) ? [...products].reverse() : products;
              const filteredProducts = searchQuery ? sortedProducts.filter(p => {
                const nameMatch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.name_en || '').toLowerCase().includes(searchQuery.toLowerCase());
                const descMatch = (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.description_en || '').toLowerCase().includes(searchQuery.toLowerCase());
                return nameMatch || descMatch;
              }) : sortedProducts;
              if (!isLoading && filteredProducts.length === 0) return null;
              return <div key={category.id} id={`desktop-category-${category.id}`} className='scroll-mt-36'>
                    <h2 className='text-2xl font-serif font-bold mb-6' style={{
                  color: 'var(--text-primary)'
                }}>
                      {i18n.resolvedLanguage === 'en' && category.name_en ? category.name_en : t(category.name)}
                    </h2>
                    <div className='grid grid-cols-3 gap-5'>
                      {isLoading ? [...Array(3)].map((_, idx) => <div key={idx} className="animate-pulse rounded-2xl overflow-hidden flex flex-col h-full" style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)'
                  }}>
                            <div className="h-56 bg-gray-200 dark:bg-gray-700/50"></div>
                            <div className="p-6 flex-1 flex flex-col space-y-3">
                              <div className="h-5 bg-gray-200 dark:bg-gray-700/50 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-full"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-1/2 mb-auto"></div>
                              <div className="pt-4 flex items-center justify-between mt-auto">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700/50 rounded w-1/4"></div>
                                <div className="h-10 bg-gray-200 dark:bg-gray-700/50 rounded w-1/3 rounded-full"></div>
                              </div>
                            </div>
                          </div>) : filteredProducts.map((product, idx) => <DesktopProductCard key={product.id} product={product} index={idx} getCartCount={getCartCount} onAdd={addToCart} onRemove={removeFromCart} isFavorite={favorites.includes(product.id)} onToggleFavorite={toggleFavorite} onClick={() => handleProductClick(product)} />)}
                    </div>
                  </div>;
            })}
            </>}
            {alcoholCategory && (
              <div className="flex justify-center mt-6 pb-4">
                <button 
                  onClick={() => setShowAlcoholModal(true)} 
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105" 
                  style={{ 
                    background: 'color-mix(in srgb, var(--accent-gold) 10%, transparent)', 
                    border: '1px solid var(--accent-gold)', 
                    boxShadow: 'var(--shadow-sm)' 
                  }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-gold)', color: 'white' }}>
                    <FaFire size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-medium opacity-80" style={{ color: 'var(--text-secondary)' }}>
                      {i18n.resolvedLanguage === 'en' ? 'Also available' : 'Также в наличии'}
                    </span>
                    <span className="block text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {i18n.resolvedLanguage === 'en' && alcoholCategory.name_en ? alcoholCategory.name_en : t(alcoholCategory.name)} 18+
                    </span>
                  </div>
                  <div className="ml-2">
                    <ChevronRight size={24} style={{ color: 'var(--accent-gold)' }} />
                  </div>
                </button>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Footer Mention */}
        <div className="w-full flex justify-center pb-24 lg:pb-12 pt-8 relative z-10">
          <a href="https://www.learn-it-academy.site/" target="_blank" rel="noopener noreferrer" className="relative flex items-center gap-4 px-3 py-3 pr-6 rounded-2xl backdrop-blur-xl transition-all duration-300 group overflow-hidden bg-[var(--bg-card)] hover:bg-[var(--hover-bg)] hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]" style={{
          border: '1px solid var(--border-color)'
        }}>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-rose-500/20 group-hover:border-rose-500/50 group-hover:scale-110 transition-all duration-300 relative z-10 bg-[var(--hover-bg)]">
              <Box className="w-5 h-5 text-rose-500 group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] transition-all" />
            </div>
            <div className="flex flex-col relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold mb-0.5 text-[var(--text-muted)] leading-none">{t("str_23")}</span>
              <span className="text-base font-bold transition-colors drop-shadow-md text-[var(--text-primary)] group-hover:text-rose-500 tracking-tight leading-none">Learn IT</span>
            </div>
          </a>
        </div>
      </div>

      
      
      <CartDrawer containers={getContainers()} showCart={showCart} setShowCart={setShowCart} cart={cart} setCart={setCart} productsData={productsData} onAdd={addToCart} onRemove={removeFromCart} onRemoveCompletely={removeItemCompletely} getTotalPrice={getTotalPrice} onCheckoutSuccess={handleCheckoutSuccess} />

      <OrderSuccessModal show={showOrderSuccess} onClose={() => setShowOrderSuccess(false)} totalPrice={orderTotal} />

      {showProductModal && selectedProduct && <ProductModal product={selectedProduct} onClose={() => setShowProductModal(false)} cartCount={getCartCount(selectedProduct.id)} onAdd={addToCart} isFavorite={favorites.includes(selectedProduct.id)} onToggleFavorite={toggleFavorite} />}
      {showAlcoholModal && alcoholCategory && <AlcoholModal category={alcoholCategory} products={productsData[alcoholCategory.id] || []} onClose={() => setShowAlcoholModal(false)} cart={cart} onProductClick={product => {
      handleProductClick(product);
    }} />}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); filter: hue-rotate(0deg); }
          33% { transform: translate(20px, -25px) scale(1.05) rotate(2deg); filter: hue-rotate(15deg); }
          66% { transform: translate(-15px, -15px) scale(0.95) rotate(-1deg); filter: hue-rotate(-15deg); }
        }
        
        @keyframes revealCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.9); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-40px); filter: blur(5px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }

        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(40px); filter: blur(5px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        
        @keyframes headerReveal {
          0% { opacity: 0; transform: translateY(-20px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .animate-reveal-card {
          animation: revealCard 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .animate-slide-left {
          animation: slideInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .animate-slide-right {
          animation: slideInRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        .animate-fade {
          animation: headerReveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>;
};
const CartDrawer = ({
  showCart,
  setShowCart,
  cart,
  setCart,
  productsData,
  onAdd,
  onRemove,
  onRemoveCompletely,
  getTotalPrice,
  onCheckoutSuccess,
  containers = []
}: any) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [branch, setBranch] = useState<'Кобул-тачик' | 'Сырдаринский'>(t("str_2"));
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('cash');
  const [paymentBank, setPaymentBank] = useState<string>('Alif');
  const cartItems = Object.entries(cart).map(([cartKey, count]) => {
    const [idStr, portion] = cartKey.split('_');
    const productId = parseInt(idStr);
    const product = Object.values(productsData).flat().find((p: any) => p.id === productId) as any;
    let nameSuffix = '';
    if (portion === 'half') nameSuffix = t("str_3");else if (portion === 'small') nameSuffix = t("str_4");else if (portion === 'medium') nameSuffix = t("str_5");else if (portion === 'large') nameSuffix = t("str_6");
    let itemPrice = product?.price || 0;
    if (portion === 'half' && product?.has_half_portion) itemPrice = product.half_portion_price;else if (portion === 'small' && product?.has_sizes) itemPrice = product.size_small_price;else if (portion === 'medium' && product?.has_sizes) itemPrice = product.size_medium_price;else if (portion === 'large' && product?.has_sizes) itemPrice = product.size_large_price;
    return {
      product,
      count,
      cartKey,
      productId,
      portion,
      nameSuffix,
      itemPrice
    };
  }).filter(item => item.product);
  const totalItems = cartItems.reduce((sum, item) => sum + (item.count as number), 0);
  const totalPrice = getTotalPrice();
  const handleCheckout = () => {
    setStep('checkout');
  };
  const submitOrder = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      alert(t("str_25"));
      return;
    }
    onCheckoutSuccess(customerName, customerPhone, customerAddress, branch, paymentMethod, paymentBank);
    setStep('cart'); // Reset
  };
  useEffect(() => {
    if (!showCart) {
      setTimeout(() => setStep('cart'), 300);
    }
  }, [showCart]);
  return <>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${showCart ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowCart(false)} />

      <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 z-[110] transition-transform duration-300 ease-out ${showCart ? 'translate-x-0' : 'translate-x-full'}`} style={{
      background: 'var(--bg-card)'
    }}>
        <div className='flex items-center justify-between p-4 border-b' style={{
        borderColor: 'var(--border-color)'
      }}>
          <div className='flex items-center gap-2'>
            {step === 'checkout' ? <button onClick={() => setStep('cart')} className='p-1 rounded-lg transition-all hover:scale-105' style={{
            color: 'var(--text-muted)'
          }}>
                <ChevronLeft size={20} />
              </button> : <ShoppingBag size={20} style={{
            color: 'var(--accent-gold)'
          }} />}
            <h3 className='text-lg font-serif font-bold' style={{
            color: 'var(--text-primary)'
          }}>
              {step === 'checkout' ? t("str_26") : t("str_27")}
            </h3>
            {totalItems > 0 && step === 'cart' && <span className='px-2 py-0.5 rounded-full text-xs font-bold text-white' style={{
            background: 'var(--accent-gold)'
          }}>
                {totalItems}
              </span>}
          </div>
          <button onClick={() => setShowCart(false)} className='p-2 rounded-lg transition-all hover:scale-105' style={{
          background: 'var(--toggle-bg)'
        }}>
            <X size={18} style={{
            color: 'var(--text-muted)'
          }} />
          </button>
        </div>

        <div className='flex flex-col h-[calc(100%-64px)]'>
          {cartItems.length === 0 ? <div className='flex-1 flex flex-col items-center justify-center p-8'>
              <ShoppingBag size={48} style={{
            color: 'var(--text-muted)',
            opacity: 0.3
          }} />
              <p className='mt-4 text-lg' style={{
            color: 'var(--text-muted)'
          }}>{t("str_28")}</p>
              <button onClick={() => setShowCart(false)} className='mt-4 px-6 py-2 rounded-xl font-medium transition-all hover:scale-105' style={{
            background: 'var(--accent-gold)',
            color: 'white'
          }}>{t("str_29")}</button>
            </div> : step === 'cart' ? <>
              <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                {cartItems.map(({
              product,
              count,
              cartKey,
              productId,
              portion,
              nameSuffix,
              itemPrice
            }: any) => <div key={cartKey} className='flex gap-3 p-3 rounded-xl' style={{
              background: 'var(--hover-bg)'
            }}>
                    <img src={product.image} alt={i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)} className='w-16 h-16 rounded-lg object-cover' />
                    <div className='flex-1'>
                      <h4 className='font-medium text-sm' style={{
                  color: 'var(--text-primary)'
                }}>
                        {i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)} {nameSuffix && <span className="text-xs opacity-70">{nameSuffix}</span>}
                      </h4>
                      <p className='text-sm font-bold mt-1' style={{
                  color: 'var(--accent-gold)'
                }}>
                        {itemPrice}{t("str_30")}</p>
                    </div>
                    <div className='flex flex-col items-end justify-between'>
                      <button onClick={() => onRemoveCompletely(cartKey)} className='p-1 rounded-lg transition-all hover:scale-105' style={{
                  color: 'var(--text-muted)'
                }}>
                        <Trash2 size={14} />
                      </button>
                      <div className='flex items-center gap-2'>
                        <button onClick={() => onRemove(productId, portion)} className='w-7 h-7 rounded-lg flex items-center justify-center' style={{
                    background: 'var(--bg-card)'
                  }}>
                          <Minus size={14} style={{
                      color: 'var(--text-muted)'
                    }} />
                        </button>
                        <span className='font-bold w-5 text-center text-sm' style={{
                    color: 'var(--text-primary)'
                  }}>
                          {count as number}
                        </span>
                        <button onClick={() => onAdd(productId, portion)} className='w-7 h-7 rounded-lg flex items-center justify-center' style={{
                    background: 'var(--accent-gold)'
                  }}>
                          <Plus size={14} style={{
                      color: 'white'
                    }} />
                        </button>
                      </div>
                    </div>
                  </div>)}

                {containers.map((c: any, idx: number) => (
                  <div key={`container-${idx}`} className='flex gap-3 p-3 rounded-xl' style={{ background: 'var(--hover-bg)' }}>
                    <div className='w-16 h-16 rounded-lg bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border-color)]'>
                      <Box size={24} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium text-sm' style={{ color: 'var(--text-primary)' }}>
                        {c.name}
                      </h4>
                      <p className='text-sm font-bold mt-1' style={{ color: 'var(--accent-gold)' }}>
                        {c.price}{t("str_30")}
                      </p>
                    </div>
                    <div className='flex flex-col items-end justify-center pr-2'>
                      <span className='font-bold text-lg' style={{ color: 'var(--text-primary)' }}>
                        x{c.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className='p-4 border-t' style={{
            borderColor: 'var(--border-color)'
          }}>
                <div className='flex justify-between items-center mb-4'>
                  <span className='text-base font-bold' style={{
                color: 'var(--text-primary)'
              }}>{t("str_31")}</span>
                  <span className='text-xl font-bold' style={{
                color: 'var(--accent-gold)'
              }}>
                    {totalPrice}{t("str_30")}</span>
                </div>
                <button onClick={handleCheckout} className='w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]' style={{
              background: 'var(--accent-gold)'
            }}>{t("str_32")}</button>
                <button onClick={() => setCart({})} className='w-full mt-2 py-2 rounded-xl text-sm transition-all hover:opacity-80' style={{
              color: 'var(--text-muted)'
            }}>{t("str_33")}</button>
              </div>
            </> : <div className='flex-1 overflow-y-auto p-4 flex flex-col'>
              <div className='space-y-4 flex-1'>
                <div>
                  <label className='block text-sm font-medium mb-1' style={{
                color: 'var(--text-primary)'
              }}>{t("str_34")}</label>
                  <input type='text' value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder={t("str_35")} className='w-full p-3 rounded-lg border outline-none' style={{
                background: 'var(--hover-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }} />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1' style={{
                color: 'var(--text-primary)'
              }}>{t("str_36")}</label>
                  <input type='tel' value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder='+992 XX XXX XX XX' className='w-full p-3 rounded-lg border outline-none' style={{
                background: 'var(--hover-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }} />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1' style={{
                color: 'var(--text-primary)'
              }}>{t("str_37")}</label>
                  <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder={t("str_38")} className='w-full p-3 rounded-lg border outline-none resize-none' rows={3} style={{
                background: 'var(--hover-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }} />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2' style={{
                color: 'var(--text-primary)'
              }}>{t("str_39")}</label>
                  <div className='grid grid-cols-2 gap-2'>
                    <button type='button' onClick={() => setBranch(t("str_2"))} className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${branch === t("str_2") ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-extrabold' : 'border-[var(--border-color)] bg-transparent text-[var(--text-muted)] hover:border-gray-500'}`} style={branch === t("str_2") ? {
                  borderColor: 'var(--accent-gold)'
                } : {}}>{t("str_2")}</button>
                    <button type='button' onClick={() => setBranch(t("str_24"))} className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${branch === t("str_24") ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-extrabold' : 'border-[var(--border-color)] bg-transparent text-[var(--text-muted)] hover:border-gray-500'}`} style={branch === t("str_24") ? {
                  borderColor: 'var(--accent-gold)'
                } : {}}>{t("str_24")}</button>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2' style={{
                color: 'var(--text-primary)'
              }}>{t("str_40")}</label>
                  <div className='grid grid-cols-2 gap-2 mb-3'>
                    <button type='button' onClick={() => setPaymentMethod('cash')} className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${paymentMethod === 'cash' ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-extrabold' : 'border-[var(--border-color)] bg-transparent text-[var(--text-muted)] hover:border-gray-500'}`} style={paymentMethod === 'cash' ? {
                  borderColor: 'var(--accent-gold)'
                } : {}}>{t("str_41")}</button>
                    <button type='button' onClick={() => setPaymentMethod('bank')} className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${paymentMethod === 'bank' ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-extrabold' : 'border-[var(--border-color)] bg-transparent text-[var(--text-muted)] hover:border-gray-500'}`} style={paymentMethod === 'bank' ? {
                  borderColor: 'var(--accent-gold)'
                } : {}}>{t("str_42")}</button>
                  </div>

                  {paymentMethod === 'bank' && <div className="animate-reveal-card">
                      <label className='block text-xs font-semibold text-gray-400 mb-1'>{t("str_43")}</label>
                      <select value={paymentBank} onChange={e => setPaymentBank(e.target.value)} className='w-full p-2.5 rounded-lg border outline-none text-xs font-semibold' style={{
                  background: 'var(--hover-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}>
                        <option value="DCity">{t("str_44")}</option>
                        <option value="Alif">{t("str_45")}</option>
                        <option value={t("str_46")}>{t("str_47")}</option>
                        <option value={t("str_48")}>{t("str_49")}</option>
                        <option value={t("str_50")}>{t("str_50")}</option>
                        <option value={t("str_51")}>{t("str_52")}</option>
                      </select>
                    </div>}
                </div>
              </div>
              <div className='pt-6 border-t mt-4' style={{
            borderColor: 'var(--border-color)'
          }}>
                <div className='flex justify-between items-center mb-4'>
                  <span className='text-base font-bold' style={{
                color: 'var(--text-primary)'
              }}>{t("str_53")}</span>
                  <span className='text-xl font-bold' style={{
                color: 'var(--accent-gold)'
              }}>
                    {totalPrice}{t("str_30")}</span>
                </div>
                <button onClick={submitOrder} className='w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]' style={{
              background: 'var(--accent-gold)'
            }}>{t("str_54")}</button>
              </div>
            </div>}
        </div>
      </div>
    </>;
};
const AlcoholModal = ({
  category,
  products,
  onClose,
  cart,
  updateQuantity,
  favorites,
  toggleFavorite,
  onProductClick
}: any) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  return <AnimatePresence>
      <div className='fixed inset-0 z-[110] flex flex-col'>
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.5
      }} className='absolute inset-0 bg-black/90 backdrop-blur-xl' onClick={onClose} />
        <motion.div initial={{
        opacity: 0,
        scale: 0.8,
        filter: 'blur(10px)'
      }} animate={{
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)'
      }} exit={{
        opacity: 0,
        scale: 0.9,
        filter: 'blur(10px)'
      }} transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100
      }} className='relative w-full h-full flex flex-col overflow-hidden text-white' style={{
        pointerEvents: 'none'
      }}>
          <div className='flex items-center justify-between p-4 sm:p-6 z-10 pointer-events-auto'>
            <h2 className='text-3xl sm:text-5xl font-serif font-bold text-amber-500 tracking-widest uppercase drop-shadow-2xl opacity-90'>{i18n.resolvedLanguage === 'en' && category?.name_en ? category.name_en : (category?.name || t("str_55"))}</h2>
            <button onClick={onClose} className='p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all backdrop-blur-md'>
              <FiX size={28} />
            </button>
          </div>
          
          <div className='flex-1 overflow-y-auto p-4 sm:p-8 relative pointer-events-auto no-scrollbar'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8'>
              {products.map((product: any, idx: number) => {
              const cartCount = cart[`${product.id}_full`] || 0;
              return <motion.div key={product.id} initial={{
                opacity: 0,
                y: 50
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: idx * 0.05 + 0.1,
                type: 'spring'
              }} className='relative rounded-3xl overflow-hidden bg-black/40 border border-white/10 group cursor-pointer backdrop-blur-sm hover:border-amber-500/50 transition-colors' onClick={() => onProductClick({
                ...product,
                selectedPortion: 'full'
              })}>
                    <div className='aspect-[3/4] relative overflow-hidden'>
                      {product.image ? <img src={product.image} className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100' alt={i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)} /> : <div className='w-full h-full bg-black/50 flex flex-col items-center justify-center opacity-40'>
                           <Camera size={48} className='mb-2' />
                         </div>}
                      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent' />
                    </div>
                    <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-6'>
                      <h3 className='text-lg sm:text-xl font-medium text-white mb-2 drop-shadow-md'>{i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)}</h3>
                      <div className='flex items-center justify-between'>
                        <span className='text-amber-500 font-bold text-lg'>{product.price}{t("str_30")}</span>
                        {cartCount > 0 && <span className='bg-amber-500 text-black text-sm font-bold px-3 py-1 rounded-full'>{cartCount}</span>}
                      </div>
                    </div>
                  </motion.div>;
            })}
            </div>
            {products.length === 0 && <div className='flex items-center justify-center h-[50vh] text-white/50 text-xl font-light tracking-wider'>{t("str_56")}</div>}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>;
};
const ProductModal = ({
  product,
  onClose,
  cartCount,
  onAdd,
  isFavorite,
  onToggleFavorite
}: any) => {
  const { t, i18n } = useTranslation();
  const [portion, setPortion] = useState<Product['selectedPortion']>(product.selectedPortion || (product.has_sizes ? 'small' : 'full'));
  const currentCartCount = cartCount || 0;
  let currentPrice = product.price || 0;
  if (portion === 'half' && product.has_half_portion) currentPrice = product.half_portion_price;else if (portion === 'small' && product.has_sizes) currentPrice = product.size_small_price;else if (portion === 'medium' && product.has_sizes) currentPrice = product.size_medium_price;else if (portion === 'large' && product.has_sizes) currentPrice = product.size_large_price;
  const [quantity, setQuantity] = useState(Math.max(1, currentCartCount || 1));
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [isLiked, setIsLiked] = useState(isFavorite);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  useEffect(() => {
    setQuantity(Math.max(1, currentCartCount || 1));
  }, [portion, currentCartCount]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isImageZoomed) {
          setIsImageZoomed(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isImageZoomed]);
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAdd(product.id, portion);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 800);
  };
  const handleLike = () => {
    setIsLiked(!isLiked);
    onToggleFavorite(product.id);
  };
  const currentIngredients = i18n.resolvedLanguage === 'en' && product.ingredients_en ? product.ingredients_en : product.ingredients;
  const ingredientsList = currentIngredients?.split(',').map((i: string) => i.trim()) || [t("str_57"), t("str_58"), t("str_59"), t("str_60"), t("str_61")];
  const nutritionInfo = {
    calories: product.calories || t("str_62"),
    proteins: t("str_63"),
    fats: t("str_64"),
    carbs: t("str_65"),
    weight: product.weight || t("str_66")
  };
  const cookingTime = t("str_67");
  const portions = t("str_68");
  return <AnimatePresence>
      <div className='fixed inset-0 z-[120]'>
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className='absolute inset-0 bg-black/80 backdrop-blur-md' />

        <motion.div initial={{
        opacity: 0,
        y: 30,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: 30,
        scale: 0.95
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }} className='absolute inset-0 flex items-center justify-center p-2 md:p-4' style={{
        pointerEvents: isImageZoomed ? 'none' : 'auto'
      }}>
          <div className='relative w-full max-w-5xl rounded-2xl md:rounded-3xl overflow-hidden border shadow-2xl flex flex-col' style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          maxHeight: 'calc(100vh - 16px)',
          opacity: isImageZoomed ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}>
            <div className='absolute top-3 right-3 md:top-4 md:right-4 z-10 flex gap-2'>
              <button onClick={handleLike} className='w-8 h-8 md:w-10 md:h-10 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center' style={{
              background: isLiked ? 'rgba(196, 154, 60, 0.15)' : 'rgba(0, 0, 0, 0.4)',
              border: isLiked ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
              color: isLiked ? 'var(--accent-gold)' : 'rgba(255,255,255,0.7)'
            }}>
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button onClick={onClose} className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all duration-300 flex items-center justify-center' style={{
              border: '1px solid var(--border-color)'
            }}>
                <FiX size={18} />
              </button>
            </div>

            <div className='flex flex-col md:flex-row overflow-hidden h-full'>
              <div className='relative w-full md:w-2/5 h-40 sm:h-48 md:h-auto shrink-0 overflow-hidden'>
                {product.image ? <motion.img initial={{
                scale: 1.1
              }} animate={{
                scale: 1
              }} transition={{
                duration: 0.6
              }} src={product.image} alt={i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)} className='w-full h-full object-cover cursor-zoom-in' onClick={() => setIsImageZoomed(true)} /> : <div className='w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'>
                    <Camera size={48} className='mb-3 opacity-30' />
                    <span className='text-sm font-medium'>{t("str_69")}</span>
                  </div>}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/60 pointer-events-none' />

                <button onClick={() => setIsImageZoomed(true)} className='absolute bottom-3 right-3 md:bottom-4 md:right-4 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/80 transition-all z-10'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <circle cx='11' cy='11' r='8' />
                    <line x1='21' y1='21' x2='16.65' y2='16.65' />
                    <line x1='11' y1='8' x2='11' y2='14' />
                    <line x1='8' y1='11' x2='14' y2='11' />
                  </svg>
                </button>

                <div className='absolute bottom-3 left-3 md:bottom-4 md:left-4 flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full' style={{
                border: '1px solid rgba(196, 154, 60, 0.3)'
              }}>
                  <FaStar size={9} color='var(--accent-gold)' />
                  <span className='text-white text-[10px] font-semibold'>4.8</span>
                </div>
              </div>

              <div className='flex-1 p-3 md:p-5 flex flex-col overflow-hidden'>
                <div className='shrink-0'>
                  <div className='flex items-center gap-1.5 mb-1'>
                    <GiChefToque size={12} color='var(--accent-gold)' />
                    <span className='text-[9px] md:text-xs font-semibold tracking-wider uppercase' style={{
                    color: 'var(--accent-gold)'
                  }}>{t("str_70")}</span>
                  </div>
                  <h2 className='font-serif text-lg md:text-2xl font-bold mb-0.5' style={{
                  color: 'var(--text-primary)'
                }}>
                    {i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)}
                  </h2>
                  <p className='text-[10px] md:text-sm leading-relaxed opacity-70 line-clamp-2' style={{
                  color: 'var(--text-muted)'
                }}>
                    {i18n.resolvedLanguage === 'en' && product.description_en ? product.description_en : t(product.description)}
                  </p>
                </div>

                <div className='flex items-center justify-between py-2 border-b shrink-0 flex-wrap gap-2' style={{
                borderColor: 'var(--border-color)'
              }}>
                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    {product.has_sizes ? <div className="flex items-center gap-1 bg-[var(--toggle-bg)] rounded-lg p-1 w-fit flex-wrap">
                        <button onClick={() => setPortion('small')} className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all duration-200 ${portion === 'small' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
                      color: portion === 'small' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>{t("str_71")}</button>
                        <button onClick={() => setPortion('medium')} className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all duration-200 ${portion === 'medium' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
                      color: portion === 'medium' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>{t("str_72")}</button>
                        <button onClick={() => setPortion('large')} className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all duration-200 ${portion === 'large' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
                      color: portion === 'large' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>{t("str_73")}</button>
                      </div> : product.has_half_portion ? <div className="flex items-center gap-1 bg-[var(--toggle-bg)] rounded-lg p-1 w-fit flex-wrap">
                        <button onClick={() => setPortion('full')} className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all duration-200 ${portion === 'full' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
                      color: portion === 'full' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>{t("str_74")}</button>
                        <button onClick={() => setPortion('half')} className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all duration-200 ${portion === 'half' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
                      color: portion === 'half' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>{t("str_75")}</button>
                      </div> : null}
                    <div>
                      <span className='text-[8px] block opacity-50' style={{
                      color: 'var(--text-muted)'
                    }}>{t("str_76")}</span>
                      <span className='font-serif text-xl md:text-2xl font-bold' style={{
                      color: 'var(--accent-gold)'
                    }}>
                        {currentPrice}{t("str_30")}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='text-center'>
                      <div className='w-6 h-6 md:w-7 md:h-7 mx-auto rounded-full flex items-center justify-center' style={{
                      background: 'var(--hover-bg)'
                    }}>
                        <FiClockIcon size={10} color='var(--accent-gold)' />
                      </div>
                      <span className='text-[8px] block opacity-50' style={{
                      color: 'var(--text-muted)'
                    }}>
                        {cookingTime}
                      </span>
                    </div>
                    <div className='text-center'>
                      <div className='w-6 h-6 md:w-7 md:h-7 mx-auto rounded-full flex items-center justify-center' style={{
                      background: 'var(--hover-bg)'
                    }}>
                        <FiClockIcon size={10} color='var(--accent-gold)' />
                      </div>
                      <span className='text-[8px] block opacity-50' style={{
                      color: 'var(--text-muted)'
                    }}>
                        {portions}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex gap-1 my-2 p-0.5 rounded-lg shrink-0' style={{
                background: 'var(--hover-bg)'
              }}>
                  {[{
                  id: 'info',
                  label: t("str_77"),
                  icon: FiInfoIcon
                }, {
                  id: 'ingredients',
                  label: t("str_78"),
                  icon: FaLeaf
                }, {
                  id: 'nutrition',
                  label: t("str_79"),
                  icon: FaFire
                }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-1.5 px-1 rounded-md text-[9px] md:text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1 ${activeTab === tab.id ? 'text-white shadow-md' : 'opacity-60 hover:opacity-100'}`} style={{
                  background: activeTab === tab.id ? 'var(--accent-gold)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-muted)'
                }}>
                      <tab.icon size={10} />
                      <span className='hidden sm:inline'>{tab.label}</span>
                    </button>)}
                </div>

                <div className='flex-1 min-h-0 overflow-y-auto'>
                  <AnimatePresence mode='wait'>
                    {activeTab === 'info' && <motion.div key='info' initial={{
                    opacity: 0,
                    y: 5
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    y: -5
                  }} className='space-y-1.5'>
                        <p className='text-[10px] md:text-sm leading-relaxed opacity-80' style={{
                      color: 'var(--text-secondary)'
                    }}>{t("str_80")}</p>
                        <p className='text-[10px] leading-relaxed opacity-60' style={{
                      color: 'var(--text-muted)'
                    }}>{t("str_81")}</p>
                      </motion.div>}

                    {activeTab === 'ingredients' && <motion.div key='ingredients' initial={{
                    opacity: 0,
                    y: 5
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    y: -5
                  }} className='grid grid-cols-2 gap-x-2 gap-y-1'>
                        {ingredientsList.slice(0, 6).map((item: string, i: number) => <div key={i} className='flex items-center gap-1'>
                            <div className='w-1 h-1 rounded-full shrink-0' style={{
                        background: 'var(--accent-gold)'
                      }} />
                            <span className='text-[10px] opacity-80 truncate' style={{
                        color: 'var(--text-muted)'
                      }}>
                              {item}
                            </span>
                          </div>)}
                      </motion.div>}

                    {activeTab === 'nutrition' && <motion.div key='nutrition' initial={{
                    opacity: 0,
                    y: 5
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    y: -5
                  }} className='grid grid-cols-5 gap-1'>
                        {Object.entries(nutritionInfo).map(([key, value]) => <div key={key} className='text-center p-1.5 rounded-md border' style={{
                      background: 'var(--hover-bg)',
                      borderColor: 'var(--border-color)'
                    }}>
                            <span className='text-xs md:text-sm font-bold block' style={{
                        color: 'var(--accent-gold)'
                      }}>
                              {value.split(' ')[0]}
                            </span>
                            <span className='text-[7px] md:text-[8px] uppercase tracking-wider opacity-50' style={{
                        color: 'var(--text-muted)'
                      }}>
                              {key === 'calories' ? t("str_82") : key === 'proteins' ? t("str_83") : key === 'fats' ? t("str_84") : key === 'carbs' ? t("str_85") : t("str_86")}
                            </span>
                          </div>)}
                      </motion.div>}
                  </AnimatePresence>
                </div>

                <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t shrink-0' style={{
                borderColor: 'var(--border-color)'
              }}>
                  <div className='flex items-center justify-center sm:justify-start gap-1'>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className='w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105' style={{
                    background: 'var(--toggle-bg)',
                    color: 'var(--text-muted)'
                  }}>
                      <FiMinusIcon size={14} />
                    </button>
                    <span className='text-sm md:text-base font-semibold w-6 text-center' style={{
                    color: 'var(--text-primary)'
                  }}>
                      {quantity}
                    </span>
                    <button onClick={() => setQuantity(quantity + 1)} className='w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105' style={{
                    background: 'var(--accent-gold)',
                    color: 'white'
                  }}>
                      <FiPlusIcon size={14} />
                    </button>
                  </div>

                  <button onClick={handleAddToCart} className={`flex-1 py-2 md:py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-xs md:text-sm ${isAdded ? 'opacity-90' : 'hover:scale-[1.01]'}`} style={{
                  background: isAdded ? '#1F6E33' : 'var(--accent-gold)',
                  color: 'white',
                  boxShadow: isAdded ? 'none' : '0 4px 12px rgba(196, 154, 60, 0.3)'
                }}>
                    {isAdded ? <>
                        <FiCheck size={16} />{t("str_87")}</> : <>
                        <FiShoppingCart size={16} />{t("str_88")}{product.price * quantity}{t("str_30")}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isImageZoomed && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className='absolute inset-0 z-[130] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md' onClick={() => setIsImageZoomed(false)}>
              <button onClick={() => setIsImageZoomed(false)} className='absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-10'>
                <FiX size={24} />
              </button>
              <motion.img initial={{
            scale: 0.8,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} exit={{
            scale: 0.8,
            opacity: 0
          }} transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300
          }} src={product.image} alt={i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)} className='max-w-full max-h-full object-contain rounded-lg' onClick={e => e.stopPropagation()} />
            </motion.div>}
        </AnimatePresence>
      </div>
    </AnimatePresence>;
};
const CategoryImageSlider = ({
  category,
  products,
  isHovered,
  index
}: any) => {
  const { t, i18n } = useTranslation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = React.useMemo(() => {
    const productImages = (products || []).map((p: any) => p.image).filter(Boolean);
    if (productImages.length === 0) return [category.image];
    return Array.from(new Set(productImages)).slice(0, 5);
  }, [category.image, products]);
  useEffect(() => {
    if (images.length <= 1) return;
    let interval: NodeJS.Timeout;
    const initialDelay = setTimeout(() => {
      setCurrentIdx(prev => (prev + 1) % images.length);
      interval = setInterval(() => {
        setCurrentIdx(prev => (prev + 1) % images.length);
      }, 4000);
    }, index * 500 % 2000);
    return () => {
      clearTimeout(initialDelay);
      if (interval) clearInterval(interval);
    };
  }, [images.length, index]);
  return <>
      {images.map((img, i) => <img key={i} src={img} alt={i18n.resolvedLanguage === 'en' && category.name_en ? category.name_en : t(category.name)} className='absolute inset-0 w-full h-full object-cover' style={{
      transition: 'opacity 1.5s ease-in-out, transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      opacity: i === currentIdx ? 1 : 0
    }} />)}
    </>;
};
const CategoryCard = ({
  category,
  index,
  isVisible,
  onClick,
  products
}: any) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  return <button onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`relative w-full h-60 rounded-xl overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{
    transitionDelay: `${index * 40}ms`,
    transition: 'transform 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s ease-out, box-shadow 0.2s ease',
    boxShadow: isHovered ? 'var(--shadow-gold)' : 'var(--shadow-md)',
    transform: isHovered ? 'scale(1.01)' : 'scale(1)'
  }}>
      <CategoryImageSlider category={category} products={products} isHovered={isHovered} index={index} />
      <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30' />
      <div className='absolute inset-2 rounded-lg transition-opacity duration-200' style={{
      border: '1px solid var(--accent-gold)',
      opacity: isHovered ? 1 : 0
    }} />
      <div className='absolute bottom-0 left-0 right-0 p-4 text-left'>
        <h3 className='text-xl font-bold text-white mb-1 drop-shadow-lg'>{i18n.resolvedLanguage === 'en' && category.name_en ? category.name_en : t(category.name)}</h3>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-white/90 drop-shadow'>{category.count}{t("str_89")}</span>
          <ChevronRight size={20} style={{
          color: 'white',
          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          opacity: isHovered ? 1 : 0.7,
          transition: 'transform 0.2s ease, opacity 0.2s ease'
        }} />
        </div>
      </div>
    </button>;
};
const DesktopCategoryCard = ({
  category,
  index,
  onClick,
  products
}: any) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  return <button onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className='relative h-48 rounded-xl overflow-hidden' style={{
    transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
    boxShadow: isHovered ? 'var(--shadow-gold)' : 'var(--shadow-md)',
    transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease'
  }}>
      <CategoryImageSlider category={category} products={products} isHovered={isHovered} index={index} />
      <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30' />
      <div className='absolute inset-2 rounded-lg transition-opacity duration-200' style={{
      border: '1px solid var(--accent-gold)',
      opacity: isHovered ? 1 : 0
    }} />
      <div className='absolute bottom-0 left-0 right-0 p-4 text-left'>
        <h3 className='text-xl font-bold text-white mb-1 drop-shadow-lg'>{i18n.resolvedLanguage === 'en' && category.name_en ? category.name_en : t(category.name)}</h3>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-white/90 drop-shadow'>{category.count}{t("str_89")}</span>
          <ChevronRight size={20} style={{
          color: 'white',
          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          opacity: isHovered ? 1 : 0.6,
          transition: 'transform 0.2s ease, opacity 0.2s ease'
        }} />
        </div>
      </div>
    </button>;
};
const ProductCard = ({
  product,
  index,
  getCartCount,
  onAdd,
  onRemove,
  isFavorite,
  onToggleFavorite,
  onClick
}: any) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [portion, setPortion] = useState<Product['selectedPortion']>(product.has_sizes ? 'small' : 'full');
  let currentPrice = product.price || 0;
  if (portion === 'half' && product.has_half_portion) currentPrice = product.half_portion_price;else if (portion === 'small' && product.has_sizes) currentPrice = product.size_small_price;else if (portion === 'medium' && product.has_sizes) currentPrice = product.size_medium_price;else if (portion === 'large' && product.has_sizes) currentPrice = product.size_large_price;
  const currentCartCount = getCartCount(product.id, portion);
  return <div className='relative w-full rounded-xl overflow-hidden animate-reveal-card' style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    boxShadow: isHovered ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
    transition: 'box-shadow 0.2s ease, border-color 0.15s ease',
    animationDelay: `${index * 30}ms`
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='relative h-32 sm:h-48 cursor-pointer' onClick={() => onClick({
      ...product,
      selectedPortion: portion
    })}>
        {product.image ? <img src={product.image} alt={i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)} className='w-full h-full object-cover' /> : <div className='w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'>
            <Camera size={24} className='mb-1 opacity-50' />
            <span className='text-[10px] sm:text-xs font-medium'>{t("str_90")}</span>
          </div>}
        <button onClick={e => {
        e.stopPropagation();
        onToggleFavorite(product.id);
      }} className='absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm transition-all hover:scale-110' style={{
        color: isFavorite ? 'var(--accent-gold)' : 'white'
      }}>
          <Heart size={18} fill={isFavorite ? 'var(--accent-gold)' : 'none'} />
        </button>
      </div>

      <div className='p-2.5 sm:p-4'>
        <h4 className='font-bold text-sm sm:text-lg mb-1 cursor-pointer line-clamp-2' style={{
        color: 'var(--text-primary)'
      }} onClick={() => onClick({
        ...product,
        selectedPortion: portion
      })}>
          {i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)}
        </h4>
        <p className='text-xs sm:text-sm opacity-70 mb-2 sm:mb-3 line-clamp-2' style={{
        color: 'var(--text-muted)'
      }}>
          {i18n.resolvedLanguage === 'en' && product.description_en ? product.description_en : t(product.description)}
        </p>

        {product.has_sizes ? <div className="flex items-center gap-1 bg-[var(--toggle-bg)] rounded-lg p-1 mb-4 h-auto min-h-7 sm:min-h-9 flex-wrap">
            <button onClick={() => setPortion('small')} className={`flex-1 text-[10px] font-semibold rounded-md py-1 px-1 transition-all duration-200 ${portion === 'small' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'small' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_91")}</button>
            <button onClick={() => setPortion('medium')} className={`flex-1 text-[10px] font-semibold rounded-md py-1 px-1 transition-all duration-200 ${portion === 'medium' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'medium' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_92")}</button>
            <button onClick={() => setPortion('large')} className={`flex-1 text-[10px] font-semibold rounded-md py-1 px-1 transition-all duration-200 ${portion === 'large' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'large' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_93")}</button>
          </div> : product.has_half_portion ? <div className="flex items-center gap-2 bg-[var(--toggle-bg)] rounded-lg p-1 mb-4 h-9">
            <button onClick={() => setPortion('full')} className={`flex-1 text-xs font-semibold rounded-md h-full transition-all duration-200 ${portion === 'full' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'full' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_74")}</button>
            <button onClick={() => setPortion('half')} className={`flex-1 text-xs font-semibold rounded-md h-full transition-all duration-200 ${portion === 'half' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'half' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_75")}</button>
          </div> : null}

        <div className='flex items-center justify-between'>
          <span className='font-bold text-xl' style={{
          color: 'var(--accent-gold)'
        }}>
            {currentPrice}{t("str_30")}</span>

          {currentCartCount === 0 ? <button onClick={() => onAdd(product.id, portion)} className='w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-150 transform hover:scale-110' style={{
          background: 'var(--accent-gold)'
        }}>
              <Plus size={20} style={{
            color: 'white'
          }} />
            </button> : <div className='flex items-center gap-2'>
              <button onClick={() => onRemove(product.id, portion)} className='w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-150 transform hover:scale-110' style={{
            background: 'var(--toggle-bg)'
          }}>
                <Minus size={18} style={{
              color: 'var(--text-muted)'
            }} />
              </button>
              <span className='font-bold text-lg' style={{
            color: 'var(--text-primary)'
          }}>
                {currentCartCount}
              </span>
              <button onClick={() => onAdd(product.id, portion)} className='w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-150 transform hover:scale-110' style={{
            background: 'var(--accent-gold)'
          }}>
                <Plus size={18} style={{
              color: 'white'
            }} />
              </button>
            </div>}
        </div>
      </div>
    </div>;
};
const DesktopProductCard = ({
  product,
  index,
  getCartCount,
  onAdd,
  onRemove,
  isFavorite,
  onToggleFavorite,
  onClick
}: any) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [portion, setPortion] = useState<Product['selectedPortion']>(product.has_sizes ? 'small' : 'full');
  let currentPrice = product.price || 0;
  if (portion === 'half' && product.has_half_portion) currentPrice = product.half_portion_price;else if (portion === 'small' && product.has_sizes) currentPrice = product.size_small_price;else if (portion === 'medium' && product.has_sizes) currentPrice = product.size_medium_price;else if (portion === 'large' && product.has_sizes) currentPrice = product.size_large_price;
  const currentCartCount = getCartCount(product.id, portion);
  return <div className='relative rounded-xl overflow-hidden animate-reveal-card' style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    boxShadow: isHovered ? 'var(--shadow-gold)' : 'var(--shadow-md)',
    transform: isHovered ? 'scale(1.01) translateY(-3px)' : 'scale(1)',
    transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease',
    animationDelay: `${index * 30}ms`
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='relative h-48 overflow-hidden cursor-pointer' onClick={() => onClick({
      ...product,
      selectedPortion: portion
    })}>
        {product.image ? <img src={product.image} alt={i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)} className='w-full h-full object-cover' style={{
        transition: 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }} /> : <div className='w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500' style={{
        transition: 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}>
            <Camera size={32} className='mb-2 opacity-50' />
            <span className='text-xs font-medium'>{t("str_69")}</span>
          </div>}
        <button onClick={e => {
        e.stopPropagation();
        onToggleFavorite(product.id);
      }} className='absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm transition-all hover:scale-110' style={{
        color: isFavorite ? 'var(--accent-gold)' : 'white'
      }}>
          <Heart size={18} fill={isFavorite ? 'var(--accent-gold)' : 'none'} />
        </button>
      </div>

      <div className='p-2.5 sm:p-4'>
        <h4 className='font-bold text-sm sm:text-lg mb-1 cursor-pointer line-clamp-2' style={{
        color: 'var(--text-primary)'
      }} onClick={() => onClick({
        ...product,
        selectedPortion: portion
      })}>
          {i18n.resolvedLanguage === 'en' && product.name_en ? product.name_en : t(product.name)}
        </h4>
        <p className='text-xs sm:text-sm opacity-70 mb-2 sm:mb-3 line-clamp-2' style={{
        color: 'var(--text-muted)'
      }}>
          {i18n.resolvedLanguage === 'en' && product.description_en ? product.description_en : t(product.description)}
        </p>

        {product.has_sizes ? <div className="flex items-center gap-1 bg-[var(--toggle-bg)] rounded-lg p-1 mb-4 h-auto min-h-7 sm:min-h-9 flex-wrap">
            <button onClick={() => setPortion('small')} className={`flex-1 text-[10px] font-semibold rounded-md py-1 px-1 transition-all duration-200 ${portion === 'small' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'small' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_91")}</button>
            <button onClick={() => setPortion('medium')} className={`flex-1 text-[10px] font-semibold rounded-md py-1 px-1 transition-all duration-200 ${portion === 'medium' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'medium' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_92")}</button>
            <button onClick={() => setPortion('large')} className={`flex-1 text-[10px] font-semibold rounded-md py-1 px-1 transition-all duration-200 ${portion === 'large' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'large' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_93")}</button>
          </div> : product.has_half_portion ? <div className="flex items-center gap-2 bg-[var(--toggle-bg)] rounded-lg p-1 mb-4 h-9">
            <button onClick={() => setPortion('full')} className={`flex-1 text-xs font-semibold rounded-md h-full transition-all duration-200 ${portion === 'full' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'full' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_74")}</button>
            <button onClick={() => setPortion('half')} className={`flex-1 text-xs font-semibold rounded-md h-full transition-all duration-200 ${portion === 'half' ? 'bg-[var(--bg-card)] shadow-sm' : 'opacity-60 hover:opacity-100'}`} style={{
          color: portion === 'half' ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>{t("str_75")}</button>
          </div> : null}

        <div className='flex items-center justify-between'>
          <span className='font-bold text-xl' style={{
          color: 'var(--accent-gold)'
        }}>
            {currentPrice}{t("str_30")}</span>

          {currentCartCount === 0 ? <button onClick={() => onAdd(product.id, portion)} className='w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-150 transform hover:scale-110' style={{
          background: 'var(--accent-gold)'
        }}>
              <Plus size={20} style={{
            color: 'white'
          }} />
            </button> : <div className='flex items-center gap-2'>
              <button onClick={() => onRemove(product.id, portion)} className='w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-150 transform hover:scale-110' style={{
            background: 'var(--toggle-bg)'
          }}>
                <Minus size={18} style={{
              color: 'var(--text-muted)'
            }} />
              </button>
              <span className='font-bold text-lg' style={{
            color: 'var(--text-primary)'
          }}>
                {currentCartCount}
              </span>
              <button onClick={() => onAdd(product.id, portion)} className='w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-150 transform hover:scale-110' style={{
            background: 'var(--accent-gold)'
          }}>
                <Plus size={18} style={{
              color: 'white'
            }} />
              </button>
            </div>}
        </div>
      </div>
    </div>;
};
const OrderSuccessModal = ({
  show,
  onClose,
  totalPrice
}: any) => {
  const { t, i18n } = useTranslation();
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (show) {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setAnimate(false);
    }
  }, [show]);
  if (!show) return null;
  return <div className='fixed inset-0 z-[150] flex items-center justify-center p-4' onClick={onClose}>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' />
      <div className={`relative w-full max-w-md rounded-2xl p-6 text-center transition-all duration-500 ${animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} style={{
      background: 'var(--bg-card)'
    }} onClick={e => e.stopPropagation()}>
        <div className='mb-4 flex justify-center'>
          <div className='w-20 h-20 rounded-full flex items-center justify-center' style={{
          background: 'var(--accent-gold)'
        }}>
            <svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
              <polyline points='20 6 9 17 4 12' />
            </svg>
          </div>
        </div>

        <h2 className='text-2xl font-serif font-bold mb-2' style={{
        color: 'var(--text-primary)'
      }}>{t("str_94")}</h2>

        <p className='text-base mb-2' style={{
        color: 'var(--text-secondary)'
      }}>{t("str_95")}</p>

        <div className='py-3 px-6 rounded-xl inline-block mb-4' style={{
        background: 'var(--hover-bg)'
      }}>
          <span className='text-sm' style={{
          color: 'var(--text-muted)'
        }}>{t("str_96")}{' '}
          </span>
          <span className='text-xl font-bold' style={{
          color: 'var(--accent-gold)'
        }}>
            {totalPrice}{t("str_30")}</span>
        </div>

        <p className='text-sm mb-6' style={{
        color: 'var(--text-muted)'
      }}>{t("str_97")}</p>

        <button onClick={onClose} className='w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]' style={{
        background: 'var(--accent-gold)'
      }}>{t("str_98")}</button>
      </div>
    </div>;
};
export default MenuPage;
