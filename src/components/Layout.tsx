import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';

const Layout = () => {
  return (
    
      <Outlet />
    
  );
};

export default Layout;
