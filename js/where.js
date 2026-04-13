// Función where que recibe un predicado. Se valida que el argumento sea una función, en esencia, que sea algun filtro
// where retorna una función que espera recibir el dataset y aplica el filtro pasado como argumento

const where = (predicateFn) => {
  if (typeof predicateFn !== "function") {
    throw new TypeError("where(predicateFn) espera una funcion");
  }

  return (dataset) => dataset.filter(predicateFn);
};

module.exports = where; // Se exporta where
