// src/context/SidebarContext.js
'use client';

import { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [sidebarView, setSidebarView] = useState('main');
  
  // New state for managing filters on the Casos page
  const [casosFilters, setCasosFilters] = useState([]);
  const [activeCasosFilter, setActiveCasosFilter] = useState(null);

  const value = {
    sidebarView,
    setSidebarView,
    casosFilters,
    setCasosFilters,
    activeCasosFilter,
    setActiveCasosFilter,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  return useContext(SidebarContext);
};