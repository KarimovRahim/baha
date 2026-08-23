import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from 'react';
import { Gift, Sun, Moon, Sparkles, Truck, Percent, Cake, Send, Star, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext'
import { LangToggle } from '../components/LangToggle';;
import { FaTelegramPlane } from 'react-icons/fa';
const LOGO_PATH = '/logo.webp';
const CashbackPage = () => {
  const {
    t
  } = useTranslation();
  const {
    theme,
    toggleTheme
  } = useTheme();
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
      x: '10%',
      y: '15%',
      delay: 0,
      size: 60
    }, {
      id: 2,
      x: '85%',
      y: '80%',
      delay: 2,
      size: 80
    }, {
      id: 3,
      x: '20%',
      y: '75%',
      delay: 4,
      size: 40
    }, {
      id: 4,
      x: '75%',
      y: '25%',
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
  const handleTelegramBot = () => {
    window.open('https://t.me/baxtiyor_bot', '_blank');
  };
  const bonuses = [{
    id: 1,
    icon: Truck,
    title: t("str_142"),
    description: t("str_143"),
    color: '#10B981' // Emerald
  }, {
    id: 3,
    icon: Cake,
    title: t("str_144"),
    description: t("str_145"),
    color: '#F43F5E' // Rose
  },];
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
        {/* Mobile Layout */}
        <div className='lg:hidden w-full h-full flex flex-col px-4 py-3 overflow-y-auto'>
          <div className={`flex items-center justify-between mb-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <Link to='/' className='p-2 rounded-lg transition-all hover:scale-105' style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}>
              <svg width='18' height='18' viewBox='0 0 16 16' fill='none'>
                <path d='M10 12L6 8L10 4' stroke='var(--accent-gold)' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </Link>

            <div className='text-center flex-1'>
              <h1 className='text-lg font-serif font-bold' style={{
              color: 'var(--text-primary)'
            }}>{t("str_148")}</h1>
            </div>

            <button onClick={toggleTheme} className='w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0' style={{
            backgroundColor: 'var(--toggle-bg)',
            color: 'var(--toggle-text)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)'
          }}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
                <LangToggle />
          </div>

          <div className={`text-center mt-2 mb-6 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className='inline-block px-4 py-2 rounded-full' style={{
            background: 'linear-gradient(135deg, var(--bg-card) 0%, transparent 100%)',
            border: '1px solid var(--border-color)'
          }}>
              <p className='text-sm font-medium' style={{
              color: 'var(--text-secondary)'
            }}>{t("str_149")}</p>
            </div>
          </div>

          <div className='flex-1 flex flex-col'>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              {bonuses.map((bonus, index) => <div key={bonus.id} className={`p-5 rounded-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
              transitionDelay: `${index * 100}ms`,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)'
            }}>
                  <div className='flex items-start gap-4'>
                    <div className='p-3 rounded-xl flex-shrink-0' style={{
                  background: 'var(--hover-bg)',
                  color: bonus.color
                }}>
                      <bonus.icon size={24} />
                    </div>
                    <div>
                      <h3 className='font-bold text-lg mb-1' style={{
                    color: 'var(--text-primary)'
                  }}>
                        {bonus.title}
                      </h3>
                      <p className='text-sm leading-snug' style={{
                    color: 'var(--text-muted)'
                  }}>
                        {bonus.description}
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
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

              <h1 className='text-4xl font-serif font-bold text-center mb-4 leading-tight' style={{
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 50%, var(--text-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s ease-in-out infinite'
            }}>{t("str_150")}<br />{t("str_151")}</h1>

              <div className='flex items-center justify-center gap-3 mb-8'>
                <Sparkles size={12} style={{
                color: 'var(--accent-gold)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
                <span className='text-xs tracking-[.3em] font-semibold' style={{
                color: 'var(--accent-gold)'
              }}>{t("str_152")}</span>
                <Sparkles size={12} style={{
                color: 'var(--accent-gold)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              </div>

              <Link to='/' className='mx-auto w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105' style={{
              backgroundColor: 'var(--toggle-bg)',
              color: 'var(--toggle-text)',
              border: '1px solid var(--border-color)'
            }}>
                <svg width='20' height='20' viewBox='0 0 16 16' fill='none'>
                  <path d='M10 12L6 8L10 4' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </Link>
            </div>
          </div>

          <div className='w-2/3 flex items-center pl-12'>
            <div className={`w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className='grid grid-cols-2 gap-6'>
                {bonuses.map((bonus, index) => <div key={bonus.id} className='relative rounded-2xl overflow-hidden transition-all duration-500 group' style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
                animation: `gentleFloat ${5 + index}s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`
              }}>
                    <div className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2" style={{
                  background: bonus.color
                }} />
                    <div className='p-8 pl-10'>
                      <div className='inline-flex p-4 rounded-xl mb-6 transition-transform duration-300 group-hover:scale-110' style={{
                    background: 'var(--hover-bg)',
                    color: bonus.color
                  }}>
                        <bonus.icon size={36} />
                      </div>
                      <h3 className='font-bold text-2xl mb-3' style={{
                    color: 'var(--text-primary)'
                  }}>
                        {bonus.title}
                      </h3>
                      <p className='text-base leading-relaxed opacity-80' style={{
                    color: 'var(--text-muted)'
                  }}>
                        {bonus.description}
                      </p>
                    </div>
                  </div>)}
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
      `}</style>
    </div>;
};
export default CashbackPage;
