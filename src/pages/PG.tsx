import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField } from '@/components/FlexFields';
import {
  datasheetOptions,
  defaultInputs,
  extraInputs,
  networkOptions,
} from '@/constants';

// Returns valid options based on the selected type and method
const getItemOptions = (type: string, method: string) => {
  if (method === 'Datasheet') {
    return datasheetOptions[type] || datasheetOptions.Rack;
  }
  return networkOptions[type] || [];
};

// Updates extra fields based on the selected item
function updateExtraFields(field: FlexField, selectedItem: string): FlexField {
  const extraLabels = Object.values(extraInputs)
    .flat()
    .map((input) => input.label)
    .concat('Value');
  const staticInputs = field.inputs.filter(
    (input) => !extraLabels.includes(input.label),
  );

  if (!selectedItem) {
    return { ...field, inputs: staticInputs };
  }

  if (extraInputs[selectedItem]) {
    const inputsToAdd = extraInputs[selectedItem].map((extra) => {
      const existing = field.inputs.find((inp) => inp.label === extra.label);
      return existing ? { ...extra, value: existing.value } : { ...extra };
    });
    return { ...field, inputs: [...staticInputs, ...inputsToAdd] };
  }

  // Fallback to a generic "Value" input if no extra fields
  const genericInput = field.inputs.find((inp) => inp.label === 'Value') || {
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

  // Create a new field using the defaultInputs constant
  const createField = (currentFields: FlexField[]): FlexField => ({
    key: getNextKey(currentFields),
    inputs: [...defaultInputs],
  });

  const [fields, setFields] = useState<FlexField[]>([createField([])]);

  const handleFieldsChange = (updatedFields: FlexField[]) => {
    setFields(
      updatedFields.map((field) => {
        const typeInput = field.inputs.find((i) => i.label === 'Type');
        const methodInput = field.inputs.find((i) => i.label === 'Method');
        const itemInput = field.inputs.find((i) => i.label === 'Item');

        if (!typeInput || !methodInput || !itemInput) return field;

        const typeValue = String(typeInput.value);
        let methodValue = String(methodInput.value);
        let itemValue = String(itemInput.value);

        // If Type is "Rack", force Method to only show "Datasheet"
        if (typeValue === 'Rack') {
          methodInput.options = [{ value: 'Datasheet', label: 'Datasheet' }];
          methodInput.value = 'Datasheet';
          methodValue = 'Datasheet';
        } else {
          // Otherwise, Method can be either "Datasheet" or "Network"
          methodInput.options = [
            { value: 'Datasheet', label: 'Datasheet' },
            { value: 'Network', label: 'Network' },
          ];
        }

        // Get valid item options based on the (possibly updated) type & method
        itemInput.options = getItemOptions(typeValue, methodValue);

        // Reset item value if it's not in the updated list
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
