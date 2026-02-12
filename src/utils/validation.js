export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export const validateProduct = (product) => {
  const errors = [];
  
  if (!product.nombre || product.nombre.trim().length === 0) {
    errors.push('El nombre es requerido');
  }
  
  if (product.nombre && product.nombre.length > 200) {
    errors.push('El nombre es demasiado largo');
  }
  
  if (!product.categoria) {
    errors.push('La categoría es requerida');
  }
  
  if (!product.cantidad || isNaN(product.cantidad) || product.cantidad < 0) {
    errors.push('La cantidad debe ser un número positivo');
  }
  
  if (product.descripcion && product.descripcion.length > 500) {
    errors.push('La descripción es demasiado larga');
  }
  
  return errors;
};
