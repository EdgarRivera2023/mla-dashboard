// src/context/SidebarContext.js
'use client';

import { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [sidebarView, setSidebarView] = useState('main');
  const [activeCasosFilter, setActiveCasosFilter] = useState(null);
  const [activeCasosSubFilter, setActiveCasosSubFilter] = useState(null);

  const value = {
    sidebarView,
    setSidebarView,
    activeCasosFilter,
    setActiveCasosFilter,
    activeCasosSubFilter,
    setActiveCasosSubFilter,
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