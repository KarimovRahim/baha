import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Sun, Moon, Sparkles, Store, Clock, Navigation, Copy, Check, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext'
import { LangToggle } from '../components/LangToggle';;
const LOGO_PATH = '/logo.webp';
const CallPage = () => {
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
  const [copiedPhone, setCopiedPhone] = useState<number | null>(null);
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
  const branches = [{
    id: 1,
    address: t("str_13"),
    phone: '+992 93 888 24 24',
    phoneRaw: '+992938882424',
    hours: '09:00 - 22:00',
    hoursNote: t("str_100"),
    description: t("str_101"),
    mapUrl: 'https://maps.app.goo.gl/kArHGGZLkyjMYvuH8?g_st=atm',
    popular: true
  }, {
    id: 2,
    address: t("str_14"),
    phone: '+992 99 300 57 57',
    phoneRaw: '+992993005757',
    hours: '09:00 - 22:00',
    hoursNote: t("str_100"),
    description: t("str_102"),
    mapUrl: 'https://maps.app.goo.gl/yUAsyRKWuXQFMLuP9?g_st=atm',
    popular: false
  }];
  const handleCopyPhone = (phone: string, id: number) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2000);
  };
  const handleCall = (phoneRaw: string) => {
    window.location.href = `tel:${phoneRaw}`;
  };
  const handleTelegram = (phoneRaw: string) => {
    window.open(`https://t.me/${phoneRaw.replace('+', '')}`, '_blank');
  };
  const handleNavigate = (mapUrl: string) => {
    window.open(mapUrl, '_blank');
  };
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
            }}>{t("str_115")}</h1>
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

          <div className={`text-center mt-2 mb-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className='inline-block px-4 py-2 rounded-full' style={{
            background: 'linear-gradient(135deg, var(--bg-card) 0%, transparent 100%)',
            border: '1px solid var(--border-color)'
          }}>
              <p className='text-sm font-medium' style={{
              color: 'var(--text-secondary)'
            }}>{t("str_153")}</p>
            </div>
          </div>

          <div className='flex-1 flex flex-col justify-center'>
            <div className='space-y-3 pb-6'>
              {branches.map((branch, index) => <BranchCard key={branch.id} branch={branch} index={index} isVisible={isVisible} copiedPhone={copiedPhone} onCopy={handleCopyPhone} onCall={handleCall} onTelegram={handleTelegram} onNavigate={handleNavigate} />)}
            </div>
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

              <h1 className='text-4xl font-serif font-bold text-center mb-4' style={{
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 50%, var(--text-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s ease-in-out infinite'
            }}>{t("str_115")}</h1>

              <div className='flex items-center justify-center gap-3 mb-6'>
                <Sparkles size={12} style={{
                color: 'var(--accent-gold)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
                <span className='text-xs tracking-[.3em] font-semibold' style={{
                color: 'var(--accent-gold)'
              }}>{t("str_154")}</span>
                <Sparkles size={12} style={{
                color: 'var(--accent-gold)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              </div>

              <div className='space-y-4'>
                <div className='group flex items-center gap-3 p-4 rounded-xl' style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                animation: 'gentleFloat 4s ease-in-out infinite'
              }}>
                  <Store size={24} style={{
                  color: 'var(--accent-gold)'
                }} />
                  <div>
                    <p className='font-medium' style={{
                    color: 'var(--text-primary)'
                  }}>{t("str_106")}</p>
                    <p className='text-sm opacity-70' style={{
                    color: 'var(--text-muted)'
                  }}>{t("str_155")}</p>
                  </div>
                </div>

                <div className='group flex items-center gap-3 p-4 rounded-xl' style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                animation: 'gentleFloat 4s ease-in-out infinite',
                animationDelay: '1s'
              }}>
                  <Clock size={24} style={{
                  color: 'var(--accent-gold)'
                }} />
                  <div>
                    <p className='font-medium' style={{
                    color: 'var(--text-primary)'
                  }}>
                      09:00 - 22:00
                    </p>
                    <p className='text-sm opacity-70' style={{
                    color: 'var(--text-muted)'
                  }}>{t("str_100")}</p>
                  </div>
                </div>
              </div>

              <Link to='/' className='mt-8 mx-auto w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105' style={{
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

          <div className='w-2/3 flex items-center pl-8'>
            <div className={`w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className='grid grid-cols-1 gap-5'>
                {branches.map((branch, index) => <DesktopBranchCard key={branch.id} branch={branch} index={index} copiedPhone={copiedPhone} onCopy={handleCopyPhone} onCall={handleCall} onTelegram={handleTelegram} onNavigate={handleNavigate} />)}
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
const BranchCard = ({
  branch,
  index,
  isVisible,
  copiedPhone,
  onCopy,
  onCall,
  onTelegram,
  onNavigate
}: any) => {
  const {
    t
  } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  return <div className={`relative w-full rounded-xl overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
    transitionDelay: `${index * 100}ms`,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    boxShadow: isHovered ? 'var(--shadow-gold)' : 'var(--shadow-md)',
    transform: isHovered ? 'scale(1.01)' : 'scale(1)'
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='p-5'>
        <div className='flex items-start gap-3 mb-4'>
          <div className='p-2 rounded-lg' style={{
          background: 'var(--hover-bg)'
        }}>
            <MapPin size={18} style={{
            color: 'var(--accent-gold)'
          }} />
          </div>
          <div>
            <h3 className='font-bold text-lg mb-0.5' style={{
            color: 'var(--text-primary)'
          }}>
              {branch.address}
            </h3>
            <p className='text-xs opacity-70' style={{
            color: 'var(--text-muted)'
          }}>
              {branch.description}
            </p>
          </div>
        </div>

        <div className='flex items-center justify-between mb-4 p-3 rounded-lg' style={{
        background: 'var(--hover-bg)'
      }}>
          <div className='flex items-center gap-2'>
            <Phone size={16} style={{
            color: 'var(--accent-gold)'
          }} />
            <span className='font-bold text-lg' style={{
            color: 'var(--text-primary)'
          }}>
              {branch.phone}
            </span>
          </div>
          <button onClick={() => onCopy(branch.phone, branch.id)} className='p-2 rounded-lg transition-all hover:scale-105' style={{
          background: 'var(--bg-card)'
        }}>
            {copiedPhone === branch.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} style={{
            color: 'var(--text-muted)'
          }} />}
          </button>
        </div>

        <div className='flex gap-2'>
          <button onClick={() => onCall(branch.phoneRaw)} className='flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2' style={{
          background: 'var(--accent-gold)'
        }}>
            <Phone size={16} />{t("str_141")}</button>
          <button onClick={() => onTelegram(branch.phoneRaw)} className='px-4 py-3 rounded-xl transition-all hover:scale-105 flex items-center justify-center' style={{
          background: '#2AABEE',
          color: 'white'
        }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>;
};
const DesktopBranchCard = ({
  branch,
  index,
  copiedPhone,
  onCopy,
  onCall,
  onTelegram,
  onNavigate
}: any) => {
  const {
    t
  } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  return <div className='relative rounded-2xl overflow-hidden transition-all duration-500' style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    boxShadow: isHovered ? 'var(--shadow-gold)' : 'var(--shadow-md)',
    transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
    animation: `gentleFloat ${5 + index}s ease-in-out infinite`,
    animationDelay: `${index * 0.2}s`
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-start gap-4'>
            <div className='p-3 rounded-xl' style={{
            background: 'var(--hover-bg)'
          }}>
              <Store size={28} style={{
              color: 'var(--accent-gold)'
            }} />
            </div>
            <div>
              <h3 className='font-bold text-xl mb-1' style={{
              color: 'var(--text-primary)'
            }}>
                {branch.address}
              </h3>
              <div className='flex items-center gap-2 text-sm'>
                <Clock size={14} style={{
                color: 'var(--accent-gold)'
              }} />
                <span style={{
                color: 'var(--text-muted)'
              }}>
                  {branch.hours} • {branch.hoursNote}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className='text-sm mb-4 opacity-80' style={{
        color: 'var(--text-secondary)'
      }}>
          {branch.description}
        </p>

        <div className='flex items-center justify-between mb-4 p-4 rounded-xl' style={{
        background: 'var(--hover-bg)'
      }}>
          <div className='flex items-center gap-3'>
            <Phone size={20} style={{
            color: 'var(--accent-gold)'
          }} />
            <span className='font-bold text-2xl' style={{
            color: 'var(--text-primary)'
          }}>
              {branch.phone}
            </span>
          </div>
          <button onClick={() => onCopy(branch.phone, branch.id)} className='p-2.5 rounded-lg transition-all hover:scale-105' style={{
          background: 'var(--bg-card)'
        }}>
            {copiedPhone === branch.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} style={{
            color: 'var(--text-muted)'
          }} />}
          </button>
        </div>

        <div className='flex gap-3'>
          <button onClick={() => onCall(branch.phoneRaw)} className='flex-1 py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-lg' style={{
          background: 'var(--accent-gold)'
        }}>
            <Phone size={20} />{t("str_141")}</button>
          <button onClick={() => onTelegram(branch.phoneRaw)} className='px-6 py-4 rounded-xl transition-all hover:scale-105 flex items-center justify-center' style={{
          background: '#2AABEE',
          color: 'white'
        }}>
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>;
};
export default CallPage;
