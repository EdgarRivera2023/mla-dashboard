// src/components/FormField.js
'use client';

import AsyncSelect from 'react-select/async';

const FormField = ({ field, value, onChange }) => {
  const loadOptions = async (inputValue) => {
    try {
      const response = await fetch('/api/podio/search-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: field.config.settings.referenced_apps[0].app_id,
          searchText: inputValue,
        }),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to load options", error);
      return [];
    }
  };

  const handleSelectChange = (selectedOption) => {
    if (field.config.settings.multiple) {
      const existingValues = Array.isArray(value) ? value : [];
      if (!existingValues.some(item => item.value === selectedOption.value)) {
        onChange({ target: { name: field.external_id, value: [...existingValues, selectedOption] } });
      }
    } else {
      onChange({ target: { name: field.external_id, value: selectedOption } });
    }
  };

  const handleRemove = (itemToRemove) => {
    const newValue = value.filter(item => item.value !== itemToRemove.value);
    onChange({ target: { name: field.external_id, value: newValue } });
  };

  const renderField = () => {
    switch (field.type) {
      case 'category':
        return (
          <select id={field.external_id} name={field.external_id} value={value} onChange={onChange} className="block w-full rounded-md border-gray-300 shadow-sm p-2">
            <option value="">Select an option...</option>
            {field.config.settings.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.text}
              </option>
            ))}
          </select>
        );

      case 'date':
        return <input type="date" id={field.external_id} name={field.external_id} value={value} onChange={onChange} className="block w-full rounded-md border-gray-300 shadow-sm p-2" />;
      
      case 'money':
        return <input type="number" id={field.external_id} name={field.external_id} value={value} onChange={onChange} step="0.01" className="block w-full rounded-md border-gray-300 shadow-sm p-2" />;
      
      case 'app':
        const isMulti = field.config.settings.multiple;
        const selectedItems = Array.isArray(value) ? value : (value ? [value] : []);

        return (
          <div>
            <AsyncSelect
              key={field.external_id}
              isMulti={false}
              onChange={handleSelectChange}
              loadOptions={loadOptions}
              placeholder="Search to add an item..."
              classNamePrefix="react-select"
            />
            {selectedItems.length > 0 && (
              <div className="mt-4 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Selected Item</th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Remove</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedItems.map(item => (
                          <tr key={item.value}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{item.label}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              {isMulti && (
                                <button type="button" onClick={() => handleRemove(item)} className="text-indigo-600 hover:text-indigo-900">
                                  Remove
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <input type="text" id={field.external_id} name={field.external_id} value={value} onChange={onChange} className="block w-full rounded-md border-gray-300 shadow-sm p-2" />;
    }
  };

  return (
    <div>
      <label htmlFor={field.external_id} className="block text-sm font-medium text-gray-700">{field.label}</label>
      <div className="mt-1">{renderField()}</div>
      {field.config.description && <p className="mt-2 text-sm text-gray-500">{field.config.description}</p>}
    </div>
  );
};

export default FormField;