// Función que verifica si el input es un array que cada elemento de este sea string
const isArrayOfStrings = (value) =>
  Array.isArray(value) && value.every((field) => typeof field === "string");


// Función que proyecta un objeto, osea, deja solo ciertos campos. Reduce recorre cada campo pedido
// Luego, selectedItem va acumulado el nuevo objeto, finalmente [field]: item[field] agrega dinámicamente la propiedad actual
const projectFields = (fields) => (item) =>
  fields.reduce(
    (selectedItem, field) => ({
      ...selectedItem,
      [field]: item[field],
    }),
    {}
  );

// Función principal de select. Recibe los fields pedidos. Primero se valida que sea un arreglo de strings
// Luego, se retorna otra función que espera el dataset y recorre cada objeto con map, y para cada objeto se usa la función de proyección.
const select = (fields) => {
  if (!isArrayOfStrings(fields)) {
    throw new TypeError("select(fields) espera un arreglo de strings");
  }

  return (dataset) => dataset.map(projectFields(fields));
};

module.exports = select; // Se exporta select
