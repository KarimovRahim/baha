/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CallPage from './pages/CallPage';
import LocationPage from './pages/LocationPage';
import ContactPage from './pages/ContactPage';
import CashbackPage from './pages/CashbackPage';
import ExpiredPage from './pages/ExpiredPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { MenuProvider } from './contexts/MenuContext';

export default function App() {
  // Устанавливаем дату окончания доступа (1 июля 2026, 00:00)
  const expirationDate = new Date('2027-07-01T00:00:00');
  let isExpired = new Date() >= expirationDate;

  // Если нужно принудительно заблокировать прямо сейчас для теста,
  // просто раскомментируйте следующую строчку:
  // isExpired = true;

  if (isExpired) {
    // Возвращая компонент без Router'а, мы гарантируем, что никакие URL
    // не будут работать и доступ к другим страницам будет полностью закрыт.
    return (
      
        
      
        <ExpiredPage />
      
      
      
    );
  }

  return (
    
    
      <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='menu' element={<MenuPage />} />
          <Route path='call' element={<CallPage />} />
          <Route path='location' element={<LocationPage />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='cashback' element={<CashbackPage />} />
        </Route>
      </Routes>
    </Router>
    
    
  );
}
