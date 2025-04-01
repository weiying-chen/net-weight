import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField } from '@/components/FlexFields';
import {
  datasheetOptions,
  defaultInputs,
  extraInputs,
  networkOptions,
} from '@/constants';

// Returns valid options for "Item" based on the selected type and method.
const getItemOptions = (type: string, method: string) => {
  return method === 'Datasheet'
    ? datasheetOptions[type] || []
    : networkOptions[type] || [];
};

// Centralizes the logic for available "Method" options based on the selected Type.
const getMethodOptions = (type: string) => {
  return type === 'Rack'
    ? [{ value: 'Datasheet', label: 'Datasheet' }]
    : [
        { value: 'Datasheet', label: 'Datasheet' },
        { value: 'Network', label: 'Network' },
      ];
};

// Updates extra fields based on the selected item.
function updateExtraFields(field: FlexField, selectedItem: string): FlexField {
  // Use the internal key for extra inputs instead of label.
  const extraKeys = Object.values(extraInputs)
    .flat()
    .map((input) => input.key)
    .concat('value'); // fallback generic key for "Value"
  const staticInputs = field.inputs.filter(
    (input) => !extraKeys.includes(input.key),
  );

  if (!selectedItem) {
    return { ...field, inputs: staticInputs };
  }

  if (extraInputs[selectedItem]) {
    const inputsToAdd = extraInputs[selectedItem].map((extra) => {
      const existing = field.inputs.find((inp) => inp.key === extra.key);
      return existing ? { ...extra, value: existing.value } : { ...extra };
    });
    return { ...field, inputs: [...staticInputs, ...inputsToAdd] };
  }

  const genericInput = field.inputs.find((inp) => inp.key === 'value') || {
    key: 'value',
    label: 'Value',
    value: '',
    type: 'text',
  };
  return { ...field, inputs: [...staticInputs, genericInput] };
}

export function PG() {
  const getNextKey = (currentFields: FlexField[]) =>
    String(
      Math.max(
        0,
        ...currentFields.map((field) => parseInt(field.key, 10) || 0),
      ) + 1,
    );

  // Create a new field using the defaultInputs constant.
  // defaultInputs should now include internal keys for each input:
  // e.g. { key: 'type', label: 'Type', value: 'Rack', ... }
  const createField = (currentFields: FlexField[]): FlexField => ({
    key: getNextKey(currentFields),
    inputs: [...defaultInputs],
  });

  const [fields, setFields] = useState<FlexField[]>([createField([])]);

  const handleFieldsChange = (updatedFields: FlexField[]) => {
    setFields(
      updatedFields.map((field) => {
        const typeInput = field.inputs.find((i) => i.key === 'type');
        const methodInput = field.inputs.find((i) => i.key === 'method');
        const itemInput = field.inputs.find((i) => i.key === 'item');

        if (!typeInput || !methodInput || !itemInput) return field;

        const typeValue = String(typeInput.value);
        let methodValue = String(methodInput.value);
        let itemValue = String(itemInput.value);

        // Get proper method options based on the selected type.
        const methodOptions = getMethodOptions(typeValue);
        methodInput.options = methodOptions;

        // If the current method is not valid for the selected type, reset it.
        if (!methodOptions.some((opt) => opt.value === methodValue)) {
          methodValue = methodOptions[0].value;
          methodInput.value = methodValue;
        }

        // Get valid item options based on the selected type and method.
        itemInput.options = getItemOptions(typeValue, methodValue);

        // Reset item value if it's not in the updated list.
        if (!itemInput.options.some((opt) => opt.value === itemValue)) {
          itemValue = '';
          itemInput.value = itemValue;
        }

        return updateExtraFields(field, itemValue);
      }),
    );
  };

  useEffect(() => {
    console.log('f:', fields);
  }, [fields]);

  return (
    <Col>
      <FlexFields
        label="Attributes"
        fields={fields}
        fieldTemplate={createField(fields)}
        onChange={handleFieldsChange}
      />
    </Col>
  );
}
