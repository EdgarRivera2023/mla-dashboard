// src/components/CasoForm.js
'use client';

import Link from 'next/link';
import FormField from './FormField';
import { formLayout } from '../app/dashboard/casos/[proyectoSlug]/form-layout';

// This map connects a number to the full Tailwind class name.
const columnClassMap = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

const CasoForm = ({ appTemplate, formData, handleInputChange, handleSubmit, isSubmitting, pageTitle, caseId }) => {
  // Get a set of all field IDs that are defined in the layout for quick lookups
  const layoutFieldIds = new Set(
    formLayout.sections.flatMap(section => section.rows.flatMap(row => row.fields.map(f => f.id)))
  );

  // Filter the app's fields to include only those not in the layout and not hidden
  const unmappedFields = appTemplate.fields.filter(field =>
    !layoutFieldIds.has(field.external_id) &&
    !formLayout.hiddenFields.includes(field.external_id) &&
    field.status === 'active' &&
    !field.config.hidden
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">{pageTitle}: {formData.title || caseId || ''}</h1>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Render the sections defined in the layout */}
        {formLayout.sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-lg font-semibold text-white bg-slate-800 text-center rounded-md py-2 px-4 mb-6">{section.title}</h2>
            <div className="space-y-6">
              {section.rows.map((row, rowIndex) => (
                <div key={rowIndex} className={`grid grid-cols-1 ${columnClassMap[row.columns] || 'md:grid-cols-1'} gap-6`}>
                  {row.fields.map(fieldConfig => {
                    // Conditional logic to show/hide fields
                    if (fieldConfig.showWhen) {
                      const triggerValue = formData[fieldConfig.showWhen.fieldId];
                      if (String(triggerValue) !== String(fieldConfig.showWhen.hasValue)) {
                        return null; // Don't render the field if the condition isn't met
                      }
                    }

                    const field = appTemplate.fields.find(f => f.external_id === fieldConfig.id);
                    if (!field) return null;
                    
                    return (
                      <FormField
                        key={field.external_id}
                        field={field}
                        value={formData[field.external_id] || ''}
                        onChange={handleInputChange}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Render any unmapped fields in a default "Other Fields" section */}
        {unmappedFields.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white bg-slate-800 text-center rounded-md py-2 px-4 mb-6">Other Fields</h2>
            <div className="space-y-6">
              {unmappedFields.map(field => (
                <div key={field.external_id} className="grid grid-cols-1 gap-6">
                    <FormField
                      field={field}
                      value={formData[field.external_id] || ''}
                      onChange={handleInputChange}
                    />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t mt-6">
          <Link href="/dashboard/casos">
            <button type="button" className="rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ring-1 ring-inset ring-gray-300">
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CasoForm;