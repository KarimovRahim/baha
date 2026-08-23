import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from 'react';
import { Phone, Star, Gift, MapPin, Send, Menu, Sun, Moon, Sparkles, Crown, Clock, Heart, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext'
import { LangToggle } from '../components/LangToggle';;
const LOGO_PATH = '/logo.webp';
const HomePage = () => {
  const {
    t
  } = useTranslation();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{
    id: number;
    x: string;
    y: string;
    delay: number;
    size: number;
  }>>([]);
  useEffect(() => {
    setIsVisible(true);
    setFloatingElements([{
      id: 1,
      x: '5%',
      y: '10%',
      delay: 0,
      size: 60
    }, {
      id: 2,
      x: '90%',
      y: '85%',
      delay: 2,
      size: 80
    }, {
      id: 3,
      x: '15%',
      y: '80%',
      delay: 4,
      size: 40
    }, {
      id: 4,
      x: '80%',
      y: '20%',
      delay: 1,
      size: 50
    }, {
      id: 5,
      x: '50%',
      y: '50%',
      delay: 3,
      size: 70
    }]);
  }, []);
  const menuItems = [{
    icon: Menu,
    label: t("str_112"),
    subtitle: t("str_113"),
    description: t("str_114"),
    link: '/menu',
    delay: 0,
    accent: 'var(--accent-gold)',
    badge: 'NEW'
  }, {
    icon: Phone,
    label: t("str_115"),
    subtitle: t("str_116"),
    description: t("str_117"),
    link: '/call',
    delay: 80,
    accent: 'var(--accent-gold)',
    badge: '24/7'
  }, {
    icon: Star,
    label: t("str_118"),
    subtitle: t("str_119"),
    description: t("str_120"),
    action: () => window.open('https://www.google.com/search?q=%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD+%D0%91%D0%B0%D1%85%D1%82%D0%B8%D1%91%D1%80+%D0%9E%D1%82%D0%B7%D1%8B%D0%B2%D1%8B', '_blank'),
    delay: 160,
    accent: 'var(--accent-gold)',
    badge: '4.1★'
  }, {
    icon: Gift,
    label: t("str_121"),
    subtitle: t("str_122"),
    description: t("str_123"),
    link: '/cashback',
    delay: 240,
    accent: 'var(--accent-gold)',
    badge: '10%'
  }, {
    icon: MapPin,
    label: t("str_103"),
    subtitle: t("str_124"),
    description: t("str_125"),
    link: '/location',
    delay: 320,
    accent: 'var(--accent-gold)',
    badge: '📍'
  }, {
    icon: Send,
    label: t("str_126"),
    subtitle: t("str_127"),
    description: t("str_128"),
    link: '/contact',
    delay: 400,
    accent: 'var(--accent-gold)',
    badge: '⚡'
  }];
  return <div className='min-h-screen flex flex-col transition-all duration-500 overflow-hidden relative' style={{
    background: 'var(--bg-page-gradient)'
  }}>
      {floatingElements.map(el => <div key={el.id} className='hidden lg:block absolute rounded-full pointer-events-none' style={{
      width: el.size,
      height: el.size,
      left: el.x,
      top: el.y,
      background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)',
      opacity: 0.03,
      animation: `float ${8 + el.delay}s ease-in-out infinite`,
      animationDelay: `${el.delay}s`,
      filter: 'blur(20px)'
    }} />)}

      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {[...Array(20)].map((_, i) => <div key={i} className='absolute rounded-full' style={{
        width: '2px',
        height: '2px',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        background: 'var(--accent-gold)',
        opacity: 0.1 + Math.random() * 0.3,
        animation: `twinkle ${3 + Math.random() * 5}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 5}s`
      }} />)}
      </div>

      <div className='flex-1 w-full h-full flex flex-col lg:flex-row overflow-hidden relative z-10'>
        <div className='lg:hidden w-full h-full flex flex-col px-4 py-3 overflow-y-auto'>
          <div className={`flex items-center justify-between mb-3 relative z-50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className='w-13 h-13 rounded-xl overflow-hidden flex-shrink-0 relative' style={{
            boxShadow: 'var(--shadow-gold)',
            border: '1.5px solid var(--accent-gold)',
            padding: '2px',
            background: 'var(--bg-card)',
            width: '3.25rem',
            height: '3.25rem'
          }}>
              <img src={LOGO_PATH} alt={t("str_15")} className='w-full h-full object-cover rounded-lg' />
            </div>

            <div className='text-center flex-1'>
              <h1 className='text-xl font-serif font-bold tracking-tight' style={{
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 50%, var(--text-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
                BAKHTIYOR
              </h1>
              <div className='flex items-center justify-center gap-2'>
                <span className='text-[8px] tracking-[.25em] font-semibold' style={{
                color: 'var(--accent-gold)'
              }}>
                  RESTAURANT
                </span>
                <span className='text-[6px]' style={{
                color: 'var(--accent-gold)',
                opacity: 0.6
              }}>
                  ✦
                </span>
                <span className='text-[8px] tracking-[.25em] font-semibold' style={{
                color: 'var(--accent-gold)'
              }}>{t("str_16")}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-50">
            <button onClick={toggleTheme} className='w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105' style={{
            backgroundColor: 'var(--toggle-bg)',
            color: 'var(--toggle-text)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            width: '2.75rem',
            height: '2.75rem'
          }}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <LangToggle />
            </div>
          </div>

          <div className={`text-center mt-2 mb-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className='inline-block px-4 py-2 rounded-full' style={{
            background: 'linear-gradient(135deg, var(--bg-card) 0%, transparent 100%)',
            border: '1px solid var(--border-color)'
          }}>
              <p className='text-sm font-medium' style={{
              color: 'var(--text-secondary)'
            }}>{t("str_129")}</p>
            </div>
          </div>

          <div className='flex-1 flex flex-col justify-center'>
            <div className='space-y-2 pb-6'>
              {menuItems.map((item, index) => <MobileCard key={index} item={item} index={index} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} isVisible={isVisible} />)}
            </div>
          </div>

          <div className={`flex flex-col items-center gap-4 pt-3 pb-6 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className='text-[9px] uppercase tracking-[.35em] font-medium' style={{
            color: 'var(--accent-gold)',
            opacity: 0.4
          }}>{t("str_130")}</p>
            <a href="https://www.learn-it-academy.site/" target="_blank" rel="noopener noreferrer" className="relative flex items-center gap-3 px-2 py-2 pr-5 rounded-2xl backdrop-blur-xl transition-all duration-300 group overflow-hidden bg-[var(--bg-card)] hover:bg-[var(--hover-bg)] hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]" style={{
            border: '1px solid var(--border-color)'
          }}>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-rose-500/20 group-hover:border-rose-500/50 group-hover:scale-110 transition-all duration-300 relative z-10 bg-[var(--hover-bg)]">
                <Box className="w-4 h-4 text-rose-500 group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] transition-all" />
              </div>
              <div className="flex flex-col text-left relative z-10">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold mb-0.5 text-[var(--text-muted)] leading-none">{t("str_23")}</span>
                <span className="text-sm font-bold transition-colors drop-shadow-md text-[var(--text-primary)] group-hover:text-rose-500 leading-none tracking-tight">Learn IT</span>
              </div>
            </a>
          </div>
        </div>

        <div className='hidden lg:flex w-full h-full max-w-7xl mx-auto px-8 py-6'>
          <div className='w-1/3 flex flex-col justify-center pr-8'>
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className='relative mb-8 group'>
                <div className='absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl' style={{
                background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)'
              }} />
                <div className='w-32 h-30 rounded-2xl overflow-hidden relative mx-auto' style={{
                boxShadow: 'var(--shadow-gold)',
                border: '2px solid var(--accent-gold)',
                width: '8rem',
                height: '7.5rem'
              }}>
                  <img src={LOGO_PATH} alt={t("str_15")} className='w-full h-full object-cover' />
                  <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000' style={{
                  boxShadow: 'inset 0 0 30px var(--accent-gold)'
                }} />
                </div>
              </div>

              <h1 className='text-5xl font-serif font-bold text-center mb-4' style={{
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 50%, var(--text-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s ease-in-out infinite'
            }}>
                BAKHTIYOR
              </h1>

              <div className='flex items-center justify-center gap-3 mb-6'>
                <span className='text-xs tracking-[.3em] font-semibold' style={{
                color: 'var(--accent-gold)'
              }}>
                  RESTAURANT
                </span>
                <Sparkles size={12} style={{
                color: 'var(--accent-gold)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
                <span className='text-xs tracking-[.3em] font-semibold' style={{
                color: 'var(--accent-gold)'
              }}>{t("str_16")}</span>
              </div>

              <div className='space-y-4'>
                <div className='group flex items-center gap-3 p-3 rounded-xl transition-all duration-500 cursor-pointer hover:scale-[1.02]' style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                animation: 'gentleFloat 4s ease-in-out infinite'
              }}>
                  <Crown size={20} className='transition-all duration-500 group-hover:scale-110' style={{
                  color: 'var(--accent-gold)'
                }} />
                  <span className='transition-all duration-500 group-hover:translate-x-1' style={{
                  color: 'var(--text-secondary)'
                }}>{t("str_131")}</span>
                </div>

                <div className='group flex items-center gap-3 p-3 rounded-xl transition-all duration-500 cursor-pointer hover:scale-[1.02]' style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                animation: 'gentleFloat 4s ease-in-out infinite',
                animationDelay: '1s'
              }}>
                  <Heart size={20} className='transition-all duration-500 group-hover:scale-110' style={{
                  color: 'var(--accent-gold)',
                  animation: 'heartbeat 2s ease-in-out infinite'
                }} />
                  <span className='transition-all duration-500 group-hover:translate-x-1' style={{
                  color: 'var(--text-secondary)'
                }}>{t("str_132")}</span>
                </div>

                <div className='group flex items-center gap-3 p-3 rounded-xl transition-all duration-500 cursor-pointer hover:scale-[1.02]' style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                animation: 'gentleFloat 4s ease-in-out infinite',
                animationDelay: '2s'
              }}>
                  <Clock size={20} className='transition-all duration-500 group-hover:scale-110' style={{
                  color: 'var(--accent-gold)'
                }} />
                  <span className='transition-all duration-500 group-hover:translate-x-1' style={{
                  color: 'var(--text-secondary)'
                }}>{t("str_133")}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6">
                <button onClick={toggleTheme} className='w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shrink-0' style={{
                backgroundColor: 'var(--toggle-bg)',
                color: 'var(--toggle-text)',
                border: '1px solid var(--border-color)'
              }}>
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <LangToggle />
                <a href="https://www.learn-it-academy.site/" target="_blank" rel="noopener noreferrer" className="relative flex items-center gap-3 px-2 py-2 pr-5 rounded-2xl backdrop-blur-xl transition-all duration-300 group overflow-hidden bg-[var(--bg-card)] hover:bg-[var(--hover-bg)] hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]" style={{
                border: '1px solid var(--border-color)'
              }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-rose-500/20 group-hover:border-rose-500/50 group-hover:scale-110 transition-all duration-300 relative z-10 shrink-0 bg-[var(--hover-bg)]">
                    <Box className="w-4 h-4 text-rose-500 group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] transition-all" />
                  </div>
                  <div className="flex flex-col text-left relative z-10">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold mb-0.5 text-[var(--text-muted)] leading-none">{t("str_23")}</span>
                    <span className="text-sm font-bold transition-colors drop-shadow-md text-[var(--text-primary)] group-hover:text-rose-500 tracking-tight leading-none">Learn IT</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className='w-2/3 flex items-center pl-8'>
            <div className={`w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className='grid grid-cols-2 gap-4'>
                {menuItems.map((item, index) => <DesktopCard key={index} item={item} index={index} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.1); }
          20% { transform: scale(1); }
          30% { transform: scale(1.05); }
          40% { transform: scale(1); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: var(--border-color); box-shadow: var(--shadow-md); }
          50% { border-color: var(--accent-gold); box-shadow: var(--shadow-gold); }
        }
      `}</style>
    </div>;
};
const MobileCard = ({
  item,
  index,
  hoveredIndex,
  setHoveredIndex,
  isVisible
}: any) => {
  const {
    t
  } = useTranslation();
  const buttonStyles = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border-color)',
    borderWidth: '1px',
    borderStyle: 'solid',
    boxShadow: 'var(--shadow-md)',
    transitionDelay: `${item.delay}ms`,
    transform: hoveredIndex === index ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
    animation: 'borderGlow 4s ease-in-out infinite'
  };
  const content = <>
      <div className='absolute inset-0 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-700' style={{
      background: 'linear-gradient(135deg, var(--accent-gold) 0%, transparent 100%)'
    }} />
      
      <div className='absolute left-0 top-0 bottom-0 transition-all duration-500' style={{
      backgroundColor: 'var(--accent-gold)',
      width: hoveredIndex === index ? '4px' : '2px',
      opacity: hoveredIndex === index ? 1 : 0.2
    }} />
      <div className='flex items-center gap-4 relative z-10'>
        <div className='transition-all duration-500' style={{
        color: hoveredIndex === index ? 'var(--accent-gold)' : 'var(--icon-color)',
        animation: 'pulse 3s ease-in-out infinite',
        transform: hoveredIndex === index ? 'scale(1.2) rotate(3deg)' : 'scale(1) rotate(0deg)'
      }}>
          <item.icon size={hoveredIndex === index ? 20 : 18} strokeWidth={1.8} />
        </div>

        <div className='text-left'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-semibold tracking-wide transition-all duration-500' style={{
            color: hoveredIndex === index ? 'var(--accent-gold)' : 'var(--text-primary)',
            transform: hoveredIndex === index ? 'translateX(2px)' : 'translateX(0)'
          }}>
              {item.label}
            </span>
            <span className='text-[9px] px-1.5 py-0.5 rounded-full transition-all duration-500' style={{
            background: 'var(--accent-gold)',
            color: 'var(--accent-gold-text)',
            opacity: hoveredIndex === index ? 1 : 0.7,
            animation: 'pulse 2s ease-in-out infinite',
            transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)'
          }}>
              {item.badge}
            </span>
          </div>
          <div className='text-[11px] font-medium transition-all duration-500' style={{
          color: hoveredIndex === index ? 'var(--text-secondary)' : 'var(--text-muted)',
          transform: hoveredIndex === index ? 'translateX(2px)' : 'translateX(0)'
        }}>
            {item.subtitle}
          </div>
        </div>
      </div>

      <div className='relative z-10 transition-all duration-500' style={{
      color: hoveredIndex === index ? 'var(--accent-gold)' : 'var(--chevron-color)',
      transform: hoveredIndex === index ? 'translateX(8px) scale(1.2)' : 'translateX(0) scale(1)',
      opacity: hoveredIndex === index ? 1 : 0.4
    }}>
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
          <path d='M6 12L10 8L6 4' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </div>

      <div className='absolute right-0 bottom-0 transition-all duration-500' style={{
      width: hoveredIndex === index ? '16px' : '8px',
      height: hoveredIndex === index ? '16px' : '8px',
      borderRight: '2px solid var(--accent-gold)',
      borderBottom: '2px solid var(--accent-gold)',
      opacity: hoveredIndex === index ? 0.6 : 0.1,
      borderRadius: '0 0 12px 0'
    }} />
    </>;
  if (item.link) {
    return <Link to={item.link} className={`w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-500 group relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={buttonStyles} onMouseEnter={() => {
      setHoveredIndex(index);
    }} onMouseLeave={() => setHoveredIndex(null)}>
        {content}
      </Link>;
  }
  return <button onClick={item.action} className={`w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-500 group relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={buttonStyles} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
      {content}
    </button>;
};
const DesktopCard = ({
  item,
  index,
  hoveredIndex,
  setHoveredIndex
}: any) => {
  const {
    t
  } = useTranslation();
  const buttonStyles = {
    backgroundColor: 'var(--bg-card)',
    borderColor: hoveredIndex === index ? 'var(--accent-gold)' : 'var(--border-color)',
    borderWidth: '1px',
    borderStyle: 'solid',
    boxShadow: hoveredIndex === index ? 'var(--shadow-gold)' : 'var(--shadow-md)',
    transform: hoveredIndex === index ? 'scale(1.05) translateY(-8px)' : 'scale(1) translateY(0)',
    animation: `gentleFloat ${5 + index}s ease-in-out infinite`,
    animationDelay: `${index * 0.2}s`
  };
  const content = <>
      <div className='absolute inset-0 transition-all duration-700' style={{
      background: 'conic-gradient(from 0deg, transparent, var(--accent-gold), transparent)',
      opacity: hoveredIndex === index ? 0.08 : 0.03,
      animation: 'rotateSlow 20s linear infinite',
      animationDuration: hoveredIndex === index ? '8s' : '20s'
    }} />

      <div className='absolute inset-0 rounded-2xl transition-all duration-500' style={{
      boxShadow: hoveredIndex === index ? 'inset 0 0 0 2px var(--accent-gold), 0 0 30px var(--accent-gold)' : 'none',
      opacity: hoveredIndex === index ? 1 : 0
    }} />

      <div className='absolute top-0 left-0 right-0 h-1 transition-all duration-500' style={{
      background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
      opacity: hoveredIndex === index ? 1 : 0
    }} />

      <div className='relative z-10'>
        <div className='flex items-start justify-between mb-4'>
          <div className='p-3 rounded-xl transition-all duration-500' style={{
          backgroundColor: hoveredIndex === index ? 'var(--toggle-bg)' : 'transparent',
          transform: hoveredIndex === index ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
          animation: 'pulse 3s ease-in-out infinite'
        }}>
            <item.icon size={hoveredIndex === index ? 32 : 28} strokeWidth={1.5} style={{
            color: hoveredIndex === index ? 'var(--accent-gold)' : 'var(--icon-color)'
          }} />
          </div>
          <span className='text-xs px-2 py-1 rounded-full font-bold transition-all duration-500' style={{
          background: 'var(--accent-gold)',
          color: 'var(--accent-gold-text)',
          opacity: hoveredIndex === index ? 1 : 0.7,
          transform: hoveredIndex === index ? 'scale(1.15)' : 'scale(1)',
          animation: 'heartbeat 3s ease-in-out infinite',
          boxShadow: hoveredIndex === index ? '0 4px 12px var(--shadow-gold)' : 'none'
        }}>
            {item.badge}
          </span>
        </div>

        <h3 className='text-lg font-bold mb-2 transition-all duration-500' style={{
        color: hoveredIndex === index ? 'var(--accent-gold)' : 'var(--text-primary)',
        transform: hoveredIndex === index ? 'translateX(4px)' : 'translateX(0)'
      }}>
          {item.label}
        </h3>
        <p className='text-sm font-medium mb-1 transition-all duration-500' style={{
        color: 'var(--text-muted)',
        transform: hoveredIndex === index ? 'translateX(4px)' : 'translateX(0)'
      }}>
          {item.subtitle}
        </p>
        <p className='text-xs transition-all duration-500' style={{
        color: 'var(--text-muted)',
        opacity: hoveredIndex === index ? 1 : 0.7,
        transform: hoveredIndex === index ? 'translateX(4px)' : 'translateX(0)'
      }}>
          {item.description}
        </p>

        <div className='absolute bottom-4 right-4 transition-all duration-500' style={{
        transform: hoveredIndex === index ? 'translateX(8px) scale(1.2)' : 'translateX(0) scale(1)'
      }}>
          <svg width='20' height='20' viewBox='0 0 16 16' fill='none'>
            <path d='M6 12L10 8L6 4' stroke={hoveredIndex === index ? 'var(--accent-gold)' : 'var(--chevron-color)'} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </div>
      </div>
    </>;
  if (item.link) {
    return <Link to={item.link} className='group relative p-6 rounded-2xl transition-all duration-500 overflow-hidden h-full block' style={buttonStyles} onMouseEnter={() => {
      setHoveredIndex(index);
    }} onMouseLeave={() => setHoveredIndex(null)}>
        {content}
      </Link>;
  }
  return <button onClick={item.action} className='group relative p-6 rounded-2xl transition-all duration-500 overflow-hidden h-full block w-full text-left' style={buttonStyles} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
      {content}
    </button>;
};
export default HomePage;
