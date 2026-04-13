// Se importan las operaciones
const createSelectOperation = require("./select"); 
const createWhereOperation = require("./where");
const createOrderByOperation = require("./orderBy");
const createGroupByOperation = require("./groupBy");
const createAggregateOperation = require("./aggregate");

// Se valida el dataset y si está correcto se hace una copia
const validateDataset = (data) => {
  if (!Array.isArray(data)) {
    throw new TypeError("query(data) espera un arreglo de objetos");
  }

  return data.slice();
};

// Función que ejecuta las operaciones acumuladas en el dataset
const executeOperations = (dataset, operations) =>
  operations.reduce((currentDataset, operation) => operation(currentDataset), dataset);

// Función que acumula las operaciones de select, where, orderby, groupby, aggregate y ejecuta.
const buildQuery = (sourceData, operations = []) =>
  Object.freeze({
    select(fields) {
      return buildQuery(
        sourceData,
        operations.concat(createSelectOperation(fields))
      );
    },

    where(predicateFn) {
      return buildQuery(
        sourceData,
        operations.concat(createWhereOperation(predicateFn))
      );
    },

    orderBy(field, direction) {
      return buildQuery(
        sourceData,
        operations.concat(createOrderByOperation(field, direction))
      );
    },

    groupBy(field) {
      return buildQuery(
        sourceData,
        operations.concat(createGroupByOperation(field))
      );
    },

    aggregate(aggregations) {
      return buildQuery(
        sourceData,
        operations.concat(createAggregateOperation(aggregations))
      );
    },

    execute() {
      return executeOperations(sourceData, operations);
    },
  });

  // Función query como tal
const query = (data) => buildQuery(validateDataset(data));

module.exports = query; // Se exporta query
