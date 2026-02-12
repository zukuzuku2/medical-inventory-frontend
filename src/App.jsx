import { useState, useEffect } from 'react';
import { Box, Heading, HStack, VStack, Input, Text, Card, Button, createListCollection } from '@chakra-ui/react';
import { FiPackage, FiAlertCircle, FiPlus } from 'react-icons/fi';
import InventoryAccordion from './components/InventoryAccordion';
import { InputGroup } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@chakra-ui/react';
import { api } from './services/api';
import { sanitizeInput, validateProduct } from './utils/validation';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    categoria: 'Preparacion',
    cantidad: '',
    descripcion: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get('/inventory');
        setProducts(data.map(item => ({
          id: item.id,
          nombre: item.name,
          categoria: item.category,
          cantidad: item.quantity,
          precio: item.price,
          descripcion: item.description
        })));
        setError(null);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (product) => {
    const errors = validateProduct(product);
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      const item = await api.post('/inventory', {
        name: sanitizeInput(product.nombre),
        category: product.categoria,
        quantity: product.cantidad,
        price: 0,
        description: sanitizeInput(product.descripcion)
      });
      setProducts([...products, {
        id: item.id,
        nombre: item.name,
        categoria: item.category,
        cantidad: item.quantity,
        precio: item.price,
        descripcion: item.description
      }]);
      setError(null);
    } catch (err) {
      setError('Error al agregar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/inventory/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      setError(null);
    } catch (err) {
      setError('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      nombre: product.nombre,
      categoria: product.categoria,
      cantidad: product.cantidad.toString(),
      descripcion: product.descripcion || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = async () => {
    const errors = validateProduct(newProduct);
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      const item = await api.put(`/inventory/${editingProduct.id}`, {
        name: sanitizeInput(newProduct.nombre),
        category: newProduct.categoria,
        quantity: parseInt(newProduct.cantidad),
        price: 0,
        description: sanitizeInput(newProduct.descripcion)
      });
      setProducts(products.map(p => p.id === editingProduct.id ? {
        id: item.id,
        nombre: item.name,
        categoria: item.category,
        cantidad: item.quantity,
        precio: item.price,
        descripcion: item.description
      } : p));
      setEditingProduct(null);
      setNewProduct({ nombre: '', categoria: 'Preparacion', cantidad: '', descripcion: '' });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.reduce((sum, p) => sum + p.cantidad, 0);
  const lowStock = products.filter((p) => p.cantidad < 10).length;

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <VStack gap={8} maxW="1400px" mx="auto" align="stretch">
        <HStack justify="space-between" width="100%" flexWrap="wrap" gap={4}>
          <Heading size="2xl" color="gray.800" fontWeight="bold">
            🧪 Sistema de Inventario
          </Heading>
          <Button 
            size="lg"
            bg="blue.500"
            color="white"
            _hover={{ transform: "translateY(-2px)", shadow: "lg", bg: "blue.600" }}
            transition="all 0.2s"
            borderRadius="xl"
            px={6}
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) {
                setEditingProduct(null);
                setNewProduct({ nombre: '', categoria: 'Preparacion', cantidad: '', descripcion: '' });
              }
            }}
          >
            <FiPlus style={{ marginRight: '8px' }} />
            {showAddForm ? 'Cancelar' : 'Agregar Producto'}
          </Button>
        </HStack>

        {showAddForm && (
          <Card.Root width="100%" bg="white" shadow="xl" borderRadius="2xl" overflow="hidden">
            <Card.Body p={8}>
              <VStack gap={6} align="stretch">
                <Heading size="lg" color="gray.700">{editingProduct ? '✏️ Editar Producto' : '✨ Nuevo Producto'}</Heading>
                {error && (
                  <Text color="red.500" fontSize="sm" bg="red.50" p={3} borderRadius="md">
                    {error}
                  </Text>
                )}
                <Input
                  placeholder="Nombre del producto"
                  value={newProduct.nombre}
                  onChange={(e) => setNewProduct({...newProduct, nombre: e.target.value})}
                  maxLength={200}
                  size="lg"
                  borderRadius="lg"
                />
                <SelectRoot 
                  collection={createListCollection({ items: [
                    { label: 'Preparacion', value: 'Preparacion' },
                    { label: 'Resinas Fluidas', value: 'Resinas Fluidas' },
                    { label: 'Composite', value: 'Composite' },
                    { label: 'Ionomeros', value: 'Ionomeros' },
                    { label: 'Profilaxis', value: 'Profilaxis' },
                    { label: 'Medicamentos', value: 'Medicamentos' },
                    { label: 'Insumos', value: 'Insumos' },
                  ]})}
                  value={[newProduct.categoria]}
                  onValueChange={(e) => setNewProduct({...newProduct, categoria: e.value[0]})}
                  positioning={{ sameWidth: true }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Preparacion', 'Resinas Fluidas', 'Composite', 'Ionomeros', 'Profilaxis', 'Medicamentos', 'Insumos'].map(cat => (
                      <SelectItem key={cat} item={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
                <VStack align="stretch" gap={1}>
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    value={newProduct.cantidad}
                    onChange={(e) => setNewProduct({...newProduct, cantidad: e.target.value})}
                    onKeyDown={(e) => {
                      if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                    min="0"
                    size="lg"
                    borderRadius="lg"
                  />
                  <Text fontSize="xs" color="gray.500">
                    ⚠️ Solo números enteros positivos
                  </Text>
                </VStack>
                <Input
                  placeholder="Descripción (opcional)"
                  value={newProduct.descripcion}
                  onChange={(e) => setNewProduct({...newProduct, descripcion: e.target.value})}
                  maxLength={500}
                  size="lg"
                  borderRadius="lg"
                />
                <Button 
                  size="lg"
                  bg="green.500"
                  color="white"
                  _hover={{ transform: "translateY(-2px)", shadow: "lg", bg: "green.600" }}
                  transition="all 0.2s"
                  borderRadius="xl"
                  isDisabled={loading}
                  onClick={() => {
                    if (newProduct.nombre && newProduct.cantidad) {
                      if (editingProduct) {
                        handleUpdateProduct();
                      } else {
                        handleAddProduct({
                          ...newProduct,
                          cantidad: parseInt(newProduct.cantidad)
                        });
                        setNewProduct({ nombre: '', categoria: 'Preparacion', cantidad: '', descripcion: '' });
                        setShowAddForm(false);
                      }
                    }
                  }}
                >
                  {loading ? 'Guardando...' : editingProduct ? '✔️ Actualizar Producto' : '💾 Guardar Producto'}
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        )}

        <HStack gap={6} width="100%" flexWrap="wrap">
          <Card.Root flex="1" minW="250px" bg="white" shadow="lg" borderRadius="2xl" borderTop="4px solid" borderColor="blue.500" transition="all 0.2s" _hover={{ shadow: "xl", transform: "translateY(-4px)" }}>
            <Card.Body p={6}>
              <HStack>
                <Box p={4} bg="blue.500" borderRadius="xl" shadow="md">
                  <FiPackage size={28} color="white" />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Productos
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                    {totalProducts}
                  </Text>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>

          <Card.Root flex="1" minW="250px" bg="white" shadow="lg" borderRadius="2xl" borderTop="4px solid" borderColor="orange.500" transition="all 0.2s" _hover={{ shadow: "xl", transform: "translateY(-4px)" }}>
            <Card.Body p={6}>
              <HStack>
                <Box p={4} bg="orange.500" borderRadius="xl" shadow="md">
                  <FiAlertCircle size={28} color="white" />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Stock Bajo
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                    {lowStock}
                  </Text>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        </HStack>

        <Card.Root width="100%" bg="white" shadow="xl" borderRadius="2xl">
          <Card.Body p={8}>
            <VStack gap={6} align="stretch">
              <InputGroup width="350px" startElement={<LuSearch />}>
                <Input
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="lg"
                  borderRadius="xl"
                />
              </InputGroup>

              {filteredProducts.length > 0 ? (
                <InventoryAccordion products={filteredProducts} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />
              ) : (
                <Text textAlign="center" color="gray.500" py={8}>
                  No se encontraron productos
                </Text>
              )}
            </VStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}

export default App;
