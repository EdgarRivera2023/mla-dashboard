// src/app/dashboard/casos/form-layout.js

export const formLayout = {
  // Add the external_id of any field you want to hide completely.
  hiddenFields: [
    'field-to-hide-1', 
    'field-to-hide-2'
  ],

  // Define the sections of your form.
  sections: [
    {
      title: 'Información Principal del Caso',
      rows: [
        {
          columns: 4,
          fields: [
            { id: 'proyecto' },
            { id: 'title' },
            { id: 'estatus-de-record' },
            { id: 'tribunal-2' }
          ]
        },
        {
          columns: 4,
          fields: [
            { id: 'fecha-demanda' },
            { id: 'fecha-presentacion-demanda' },
            { id: 'fecha-entrada-record' }
          ]
        },
        {
            columns: 2,
            fields: [
                { id: 'estatus-de-record' }, // Estatus de Record
                { id: 'tipo-de-emplazamiento' } // Tipo de Emplazamiento
            ]
        }
      ]
    },
    {
      title: 'Información de la Propiedad',
      rows: [
        {
          columns: 1,
          fields: [
            { id: 'propiedad' } // Dirección de la Propiedad
          ]
        },
        {
          columns: 3,
          fields: [
            { id: 'pueblo2' },     // Pueblo
            { id: 'finca' },       // Finca
            { id: 'pagare-original' } // Pagaré Original
          ]
        }
      ]
    },
    {
        title: 'Fechas y Cuantías',
        rows: [
            {
                columns: 2,
                fields: [
                    { id: 'fecha-demanda' }, // Fecha Demanda
                    { id: 'fecha-pagare-original' } // Fecha Pagaré Original
                ]
            },
            {
                columns: 2,
                fields: [
                    { id: 'cuantia-demanda' }, // Cuantía Demanda
                    { 
                        id: 'fecha-resolucion-solo-herencias', // Asumo este es el external_id
                        // This is our conditional rule
                        showWhen: { 
                            fieldId: 'proyecto', 
                            // IMPORTANT: Replace '1' with the real ID for "Bienes Raíces con Sensibilidad"
                            hasValue: 2 
                        } 
                    }
                ]
            }
        ]
    },
    {
      title: 'Partes Relacionadas',
      rows: [
        {
          columns: 1,
          fields: [
            { id: 'contactos' } // This is a relational field
          ]
        },
        {
            columns: 1,
            fields: [
              { id: 'nombre-demandados' } // Nombre Demandado(s)
            ]
          }
      ]
    }
  ]
};