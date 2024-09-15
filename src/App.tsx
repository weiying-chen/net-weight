import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Row } from '@/components/Row';
import { ItemCard } from '@/components/ItemCard';
import { Title } from '@/components/Title';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { Col } from '@/components/Col';
import { TagInput } from '@/components/TagInput';
import { Button } from '@/components/Button';
import { CustomFields } from '@/components/CustomFields'; // Assuming CustomFields is in the same path
import { Item } from '@/types';

// Updated Zod schema for form validation
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  country: z.string().min(1, 'Country is required'),
  customFields: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      value: z.union([z.string(), z.number(), z.boolean()]), // Accept multiple types
      type: z.enum(['string', 'number', 'boolean']),
    }),
  ),
});

type FormData = z.infer<typeof schema>;

const items = [
  { title: 'Toast (吐司)', price: 45 },
  { title: 'Eggs (雞蛋)', price: 95 },
  { title: 'Ground pork (豬絞肉)', price: 92 },
  { title: 'Chicken thigh (雞腿)', price: 80 },
  { title: 'Chicken breast (雞胸)', price: 79 },
  { title: 'Avocado (酪梨)', price: 69 },
  { title: 'Ham (火腿)', price: 76 },
  { title: 'Cheese (起司)', price: 83 },
  { title: 'Sweet potato leaves (地瓜葉)', price: 35 },
  { title: 'Onions (洋蔥)', price: 32 },
  { title: 'Lettuce (A菜)', price: 32 },
  { title: 'Cabbage (高麗菜)', price: 32 },
  { title: 'Rice (米)', price: 159 },
];

export default function App() {
  const [total, setTotal] = useState<number>(() => {
    const savedTotal = localStorage.getItem('total');
    return savedTotal ? parseInt(savedTotal, 10) : 0;
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      tags: ['tag 1', 'tag 2'],
      country: 'usa',
      customFields: [{ key: '', value: '', type: 'string' }],
    },
  });

  useEffect(() => {
    localStorage.setItem('total', total.toString());
  }, [total]);

  const handleIncrease = (item: Item) => {
    setTotal((prevTotal) => prevTotal + item.price);
  };

  const handleDecrease = (item: Item) => {
    setTotal((prevTotal) => Math.max(0, prevTotal - item.price));
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('Form submitted:', data);
  };

  const countryOptions = [
    { value: 'usa', label: 'United States' },
    { value: 'canada', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'australia', label: 'Australia' },
    { value: 'india', label: 'India' },
  ];

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Col gap="lg">
          <Row>
            <Input
              label="Name"
              {...register('name')}
              error={errors.name?.message}
            />
            <Select
              label="Country"
              value={getValues('country')}
              options={countryOptions}
              placeholder="Select your country"
              onChange={(value) =>
                setValue('country', value.toString(), {
                  shouldDirty: true,
                })
              }
              error={errors.country?.message}
            />
          </Row>
          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
          />
          <TagInput
            label="Tags"
            tags={getValues('tags')}
            placeholder="Type and press Enter or Tab"
            onChange={(newTags) =>
              setValue('tags', newTags, { shouldDirty: true })
            }
            error={errors.tags?.message}
          />
          <CustomFields
            label="Custom Fields"
            fields={getValues('customFields')}
            onChange={(newFields) => {
              setValue('customFields', newFields, { shouldDirty: true });
            }}
            error={errors.customFields?.message}
          />
          <Button type="submit" disabled={!isDirty}>
            Submit
          </Button>
        </Col>
      </form>
      <br />
      <Row align="center" className="flex-wrap">
        {items.map((item, index) => (
          <ItemCard
            key={index}
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            className="w-full md:w-64"
          />
        ))}
      </Row>
      <Row align="center">
        <Title size="lg" className="mt-4">
          Total: ${total}
        </Title>
      </Row>
    </div>
  );
}
