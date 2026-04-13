const VALID_DIRECTIONS = new Set(["asc", "desc"]); // Direcciones válidas, soloe stas

// Se verifica si el field es válido, el field debe ser string y el largo mayor a 0
const isValidField = (field) => typeof field === "string" && field.length > 0;

// Función de orden al comparar a "> < =" b. Sirve para que orderBy pueda ordenar números o textos. 
const compareValues = (left, right) => {
  if (left === right) {
    return 0;
  }

  if (left === undefined || left === null) {
    return 1;
  }
 
  if (right === undefined || right === null) {
    return -1;
  }

  if (typeof left === "string" && typeof right === "string") {
    return left.localeCompare(right);
  }

  return left > right ? 1 : -1;
};

// Función en su misma. Si el field no es valido se lanza error, si la dirección no es váida se lanza error.
// Se retorna una función que recibe y opera por el dataset. La idea es convertir la dirección en un multiplicados
// Ascendente es 1, descendente es -1
// Al final lo que se hace es ordenar una copia usando el factor
const orderBy = (field, direction = "asc") => {
  if (!isValidField(field)) {
    throw new TypeError("orderBy(field, direction) espera un field string");
  }

  if (!VALID_DIRECTIONS.has(direction)) {
    throw new TypeError("orderBy(field, direction) espera direction 'asc' o 'desc'");
  }

  return (dataset) => {
    const factor = direction === "asc" ? 1 : -1;

    return dataset
      .slice()
      .sort((left, right) => compareValues(left[field], right[field]) * factor);
  };
};

module.exports = orderBy; // Se exporta orderBy
