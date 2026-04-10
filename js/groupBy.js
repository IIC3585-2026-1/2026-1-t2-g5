// Se verifica que el field que sea tipo string y que el largo sea mayor a 0
const isValidField = (field) => typeof field === "string" && field.length > 0;

// Función groupBy propiamente tal, se lanza errro si el field no es string
const groupBy = (field) => {
  if (!isValidField(field)) {
    throw new TypeError("groupBy(field) espera un field string");
  }

  // Se retorna una función que itera por el dataset, obtiene el valor del campo y lo convierte a string
  // Si ese grupo existe, lo usa, si no, parte con array vacío. Retorna un nuevo objeto
  // Con lo que ya había en groups y actualiza la clave con el currentGroup.concat(items)
  return (dataset) =>
    dataset.reduce((groups, item) => {
      const key = String(item[field]);
      const currentGroup = groups[key] || [];

      return {
        ...groups,
        [key]: currentGroup.concat(item),
      };
    }, {});
};

module.exports = groupBy;
