import { Accordion } from '@chakra-ui/react';
import InventoryTable from './InventoryTable';

const CATEGORIES = [
  'Preparacion',
  'Resinas Fluidas',
  'Composite',
  'Ionomeros',
  'Profilaxis',
  'Medicamentos',
  'Insumos'
];

export default function InventoryAccordion({ products, onDelete, onEdit }) {
  const groupedProducts = CATEGORIES.map(category => ({
    category,
    items: products.filter(p => p.categoria === category)
  })).filter(group => group.items.length > 0);

  return (
    <Accordion.Root collapsible multiple>
      {groupedProducts.map(({ category, items }) => (
        <Accordion.Item key={category} value={category}>
          <Accordion.ItemTrigger>
            {category} ({items.length})
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <InventoryTable products={items} onDelete={onDelete} onEdit={onEdit} />
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
