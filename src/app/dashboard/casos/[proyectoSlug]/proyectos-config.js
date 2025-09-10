// src/app/dashboard/casos/[proyectoSlug]/proyectos-config.js

export const proyectosConfig = {
  'mas-alla': {
    name: 'Más Allá de Loss Mitigation',
    mainFilter: { filters: { proyecto: 1 } },
    subFilters: [
      { id: 'all', name: 'Todos los Casos', podioQuery: {} },
      { id: 'activo', name: 'Casos Activos', podioQuery: { filters: { 'estatus-de-record': 1 } } },
      { id: 'inactivo', name: 'Casos Inactivos', podioQuery: { filters: { 'estatus-de-record': 2 } } },
    ]
  },
  'bienes-raices': {
    name: 'Bienes Raíces con Sensibilidad',
    mainFilter: { filters: { proyecto: 2 } },
    subFilters: [
      { id: 'all', name: 'Todos los Casos', podioQuery: {} },
      // Add specific sub-filters for this project later
    ]
  },
  'alquileres': {
    name: 'Soluciones a Alquileres Defectuosos',
    mainFilter: { filters: { proyecto: 3 } },
    subFilters: [
      { id: 'all', name: 'Todos los Casos', podioQuery: {} },
      // Add specific sub-filters for this project later
    ]
  }
};