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
  if (!selectedItem) return { ...field, inputs: staticInputs };
  if (extraInputs[selectedItem]) {
    const inputsToAdd = extraInputs[selectedItem].map((extra) => {
      const existing = field.inputs.find(
        (input) => input.label === extra.label,
      );
      return existing ? { ...extra, value: existing.value } : { ...extra };
    });
    return { ...field, inputs: [...staticInputs, ...inputsToAdd] };
  }
  const genericInput = field.inputs.find(
    (input) => input.label === 'Value',
  ) || {
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

        // Ensure type safety by converting values to strings
        const typeValue = String(typeInput.value);
        const methodValue = String(methodInput.value);
        let itemValue = String(itemInput.value);

        // Get valid item options based on the selected Type and Method
        itemInput.options = getItemOptions(typeValue, methodValue);

        // Reset item value if it is not in the updated options
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
