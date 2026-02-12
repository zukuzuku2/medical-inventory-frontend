import { Table, Badge, IconButton, HStack } from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function InventoryTable({ products, onDelete, onEdit }) {
  const getStockBadge = (cantidad) => {
    if (cantidad === 0) return <Badge colorScheme="red" borderRadius="full" px={3} py={1}>Sin Stock</Badge>;
    if (cantidad < 10) return <Badge colorScheme="orange" borderRadius="full" px={3} py={1}>Stock Bajo</Badge>;
    return <Badge colorScheme="green" borderRadius="full" px={3} py={1}>Disponible</Badge>;
  };

  return (
    <Table.Root size="lg" variant="outline">
      <Table.Header>
        <Table.Row bg="blue.50">
          <Table.ColumnHeader fontWeight="bold" color="gray.700">Producto</Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="bold" color="gray.700">Categoría</Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="bold" color="gray.700">Cantidad</Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="bold" color="gray.700">Estado</Table.ColumnHeader>
          <Table.ColumnHeader fontWeight="bold" color="gray.700">Acciones</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {products.map((product) => (
          <Table.Row key={product.id} _hover={{ bg: "gray.50" }} transition="all 0.2s">
            <Table.Cell fontWeight="semibold" color="gray.800">{product.nombre}</Table.Cell>
            <Table.Cell color="gray.600">{product.categoria}</Table.Cell>
            <Table.Cell fontWeight="bold" color="blue.600">{product.cantidad}</Table.Cell>
            <Table.Cell>{getStockBadge(product.cantidad)}</Table.Cell>
            <Table.Cell>
              <HStack gap={2}>
                <IconButton 
                  size="sm" 
                  variant="ghost" 
                  colorScheme="blue"
                  borderRadius="lg"
                  _hover={{ bg: "blue.100", transform: "scale(1.1)" }}
                  transition="all 0.2s"
                  onClick={() => onEdit && onEdit(product)}
                >
                  <FiEdit2 />
                </IconButton>
                <IconButton
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  borderRadius="lg"
                  _hover={{ bg: "red.100", transform: "scale(1.1)" }}
                  transition="all 0.2s"
                  onClick={() => onDelete(product.id)}
                >
                  <FiTrash2 />
                </IconButton>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
