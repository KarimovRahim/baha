import { useTranslation } from "react-i18next";
import React from 'react';
import { ShieldAlert, Phone, Box } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext'
import { LangToggle } from '../components/LangToggle';;
const LOGO_PATH = '/logo.webp';
const ExpiredPage = () => {
  const {
    t
  } = useTranslation();
  const {
    theme
  } = useTheme();
  return <div className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden' style={{
    background: 'var(--bg-page-gradient)'
  }}>
      {/* Background ambient effects matching the app */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {[...Array(8)].map((_, i) => <div key={i} className='absolute rounded-full' style={{
        width: `${50 + Math.random() * 100}px`,
        height: `${50 + Math.random() * 100}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)',
        opacity: 0.03,
        animation: `float ${10 + Math.random() * 15}s ease-in-out infinite`,
        filter: 'blur(30px)'
      }} />)}
      </div>

      <div className='relative z-10 w-full max-w-lg rounded-3xl p-8 md:p-10 text-center shadow-2xl animate-slide-up' style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)'
    }}>
        <div className='flex justify-center mb-8'>
          <div className='w-24 h-24 rounded-2xl overflow-hidden shadow-2xl' style={{
          border: '2px solid var(--accent-gold)',
          boxShadow: '0 0 40px rgba(196, 154, 60, 0.2)'
        }}>
            <img src={LOGO_PATH} alt={t("str_15")} className='w-full h-full object-cover' />
          </div>
        </div>

        <div className='flex justify-center mb-6'>
          <div className='w-16 h-16 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20'>
            <ShieldAlert size={32} />
          </div>
        </div>

        <h1 className='text-2xl md:text-3xl font-serif font-bold mb-4' style={{
        color: 'var(--text-primary)'
      }}>{t("str_134")}</h1>

        <p className='text-base md:text-lg mb-8 leading-relaxed' style={{
        color: 'var(--text-secondary)'
      }}>{t("str_135")}</p>

        <div className='p-4 rounded-xl text-sm md:text-base flex items-center justify-center gap-3 mb-8' style={{
        background: 'var(--hover-bg)',
        color: 'var(--text-primary)'
      }}>
          <Phone size={18} style={{
          color: 'var(--accent-gold)'
        }} />
          <span>{t("str_136")}</span>
        </div>
        
        <div className="pt-6 border-t flex justify-center" style={{
        borderColor: 'var(--border-color)'
      }}>
          <a href="https://www.learn-it-academy.site/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={{
          background: 'transparent'
        }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{
            backgroundColor: 'rgba(244,63,94,0.1)'
          }}>
              <Box className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-widest font-bold mb-0.5 text-gray-500 leading-none">{t("str_23")}</span>
              <span className="text-sm font-black text-rose-500 tracking-tight leading-none">Learn IT</span>
            </div>
          </a>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>;
};
export default ExpiredPage;