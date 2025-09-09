// src/app/dashboard/casos/filter-config.js

export const premadeFilters = [
  {
    id: 'mas-alla',
    name: 'Más Allá de Loss Mitigation',
    podioQuery: {
      filters: {
        // This is the filter for: "Proyecto" field IS "Más Allá..."
        proyecto: 1 
      }
    }
  },
  {
    id: 'bienes-raices',
    name: 'Bienes Raíces con Sensibilidad',
    podioQuery: {
      filters: {
        proyecto: 2
      }
    }
  },
  {
    id: 'alquileres',
    name: 'Soluciones a Alquileres Defectuosos',
    podioQuery: {
      filters: {
        proyecto: 3
      }
    }
  }
];