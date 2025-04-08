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

// Helper to deep clone a FlexFieldInput
const cloneInput = (input: any) => ({
  ...input,
  options: input.options ? [...input.options] : input.options,
});

export function PG() {
  const getNextKey = (currentFields: FlexField[]) =>
    String(
      Math.max(
        0,
        ...currentFields.map((field) => parseInt(field.key, 10) || 0),
      ) + 1,
    );

  // Create a new field using deep copies of defaultInputs.
  // This prevents shared object references between fields.
  const createField = (currentFields: FlexField[]): FlexField => ({
    key: getNextKey(currentFields),
    inputs: defaultInputs.map(cloneInput),
  });

  const [fields, setFields] = useState<FlexField[]>([createField([])]);

  const handleFieldsChange = (updatedFields: FlexField[]) => {
    const newFields = updatedFields.map((field) => {
      // Clone the field's inputs to avoid mutating shared objects.
      const newField = { ...field, inputs: field.inputs.map(cloneInput) };

      const typeInput = newField.inputs.find((i) => i.key === 'type');
      const methodInput = newField.inputs.find((i) => i.key === 'method');
      const itemInput = newField.inputs.find((i) => i.key === 'item');

      if (!typeInput || !methodInput || !itemInput) return newField;

      const typeValue = String(typeInput.value);
      let methodValue = String(methodInput.value);
      let itemValue = String(itemInput.value);

      // Update the method options based on type.
      const methodOptions = getMethodOptions(typeValue);
      methodInput.options = [...methodOptions];

      // Reset method value if not valid.
      if (!methodOptions.some((opt) => opt.value === methodValue)) {
        methodValue = methodOptions[0].value;
        methodInput.value = methodValue;
      }

      // Update the item options based on type and method.
      const newItemOptions = getItemOptions(typeValue, methodValue);
      itemInput.options = [...newItemOptions];

      // Reset item value if it's not valid.
      if (!newItemOptions.some((opt) => opt.value === itemValue)) {
        itemValue = '';
        itemInput.value = itemValue;
      }

      return updateExtraFields(newField, itemValue);
    });
    setFields(newFields);
  };

  useEffect(() => {
    console.log('fields:', fields);
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
