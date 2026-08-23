import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LangToggle = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLang = (lng?: string) => {
    if (lng) {
      i18n.changeLanguage(lng);
    } else {
      const newLang = i18n.resolvedLanguage === 'ru' ? 'en' : 'ru';
      i18n.changeLanguage(newLang);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
    if (isDesktop) {
      toggleLang();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      <button
        onClick={handleClick}
        className='relative w-11 h-11 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105'
        style={{
          backgroundColor: 'var(--toggle-bg)',
          color: 'var(--toggle-text)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)',
        }}
        title="Change Language"
      >
        <Globe size={18} />
        {isDesktop && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-black shadow-sm uppercase" style={{ background: 'var(--accent-gold)' }}>
             {i18n.resolvedLanguage?.substring(0, 2) || 'EN'}
          </span>
        )}
      </button>

      {isOpen && !isDesktop && (
        <div 
          className="absolute top-[calc(100%+8px)] right-0 py-2 w-32 rounded-xl shadow-2xl animate-reveal-card z-[9999]"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <button 
            onClick={() => toggleLang('ru')}
            className="w-full text-left px-4 py-2 hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-2 text-sm font-medium"
            style={{ color: i18n.resolvedLanguage === 'ru' ? 'var(--accent-gold)' : 'var(--text-primary)' }}
          >
            Русский
          </button>
          <button 
            onClick={() => toggleLang('en')}
            className="w-full text-left px-4 py-2 hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-2 text-sm font-medium"
            style={{ color: i18n.resolvedLanguage === 'en' ? 'var(--accent-gold)' : 'var(--text-primary)' }}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
};
