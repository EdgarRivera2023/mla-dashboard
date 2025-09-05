// src/app/dashboard/casos/form-layout.js

export const formLayout = {
  // Add the external_id of any field you want to hide completely.
  hiddenFields: [
    'fecha-de-hoy-2', 
    'field-4',
    'navegacion-principal',
    'calculation-14',
    'calculation-19',
    'calculation-26',
    'calculation',
    'navegacion',
    'calculation-2',
    'calculation-5',
    'field-5',
    'calculation-28',
    'calculation-3',
    'navegacion-2',
    'estatus-30-dias',
    'estatus-15-dias-rebeldia-y-sentencia',
    'cat-sumac-7-dias',
    'personal-de-llamada',
    'asignado-a-luisana',
    'etapa-de-sumac',
    'field-9',
    'of',
    'nav14',
    'navegacion-3',
    'calculation-4',
    'nav16',
    'field-17',
    'field-21',
    'field-20',

  ],

  // Define the sections of your form.
  sections: [
    {
      title: 'Información Principal del Caso', // The title for the first section
      rows: [
        // This row will have ONE field that takes the full width.
        {
          columns: 2,
          fields: ['proyecto', 'title'] // Example: The 'Número Caso' field
        },
        // This row will have TWO fields side-by-side.
        {
          columns: 3,
          fields: ['estatus-de-record', 'tribunal-2', 'especialista-a-cargo'] // Example: 'Fecha Demanda' and 'Proyecto'
        }
      ]
    },
    {
      title: 'Fechas del Caso', // The title for the second section
      rows: [
        {
          columns: 4,
          fields: ['fecha-entrada-record', 'fecha-demanda', 'fecha-presentacion-demanda', '	fecha-resolucion-solo-herencias'] // The 'Contactos' relational field
        }
      ]
    },
     {
      title: 'Análisis de Equidad', // The title for the second section
      rows: [
        {
          columns: 2,
          fields: ['analisis-de-equidad', 'fecha-analisis-de-equidad'] // The 'Contactos' relational field
        }
      ]
    },// You can add as many sections as you need...
  ]
};