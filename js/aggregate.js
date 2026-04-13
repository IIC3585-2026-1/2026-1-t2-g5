// Comprueba que aggregations sea un objeto plano (no arreglo) y que cada valor sea función
const isAggregationsSpec = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.values(value).every((fn) => typeof fn === "function");

// Comprueba que el dataset sea la "tabla" agrupada: objeto cuyos valores son arreglos de ítems
const isGroupedDataset = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.values(value).every((items) => Array.isArray(items));

// Para una clave de grupo y su arreglo de ítems, aplica cada agregación y arma una fila nueva
const buildRowForGroup = (aggregationEntries) => (groupKey, items) =>
  aggregationEntries.reduce(
    (row, [name, compute]) => ({
      ...row,
      [name]: compute(items),
    }),
    { groupKey }
  );

// aggregate(aggregations): recibe un objeto { nombreMetrica: (items) => valor, ... }
// Cada función recibe el arreglo completo del grupo (mismos ítems que dejó groupBy en esa clave)
// y retorna un valor escalar u objeto. El resultado es un arreglo de filas, una por grupo,
// siempre incluyendo groupKey (string) para saber a qué grupo corresponde la fila.
const aggregate = (aggregations) => {
  if (!isAggregationsSpec(aggregations)) {
    throw new TypeError(
      "aggregate(aggregations) espera un objeto cuyos valores sean funciones"
    );
  }

  const aggregationEntries = Object.entries(aggregations);

  return (groupedDataset) => {
    if (!isGroupedDataset(groupedDataset)) {
      throw new TypeError(
        "aggregate(...) espera el resultado de groupBy: un objeto cuyas claves son grupos y sus valores son arreglos"
      );
    }

    const rowForGroup = buildRowForGroup(aggregationEntries);

    return Object.entries(groupedDataset).map(([groupKey, items]) =>
      rowForGroup(groupKey, items)
    );
  };
};

module.exports = aggregate;
