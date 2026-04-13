const test = require("node:test"); // Se recupera el módulo de tests
const assert = require("node:assert/strict"); // Se recupera el assert

const orderBy = require("../js/orderBy");

test("orderBy(field, 'asc') ordena por campo numerico de menor a mayor", () => {
  const dataset = [
    { id: 1, age: 32 },
    { id: 2, age: 24 },
    { id: 3, age: 35 },
  ];

  const result = orderBy("age", "asc")(dataset);

  assert.deepEqual(result.map((item) => item.id), [2, 1, 3]);
});

test("orderBy(field, 'desc') ordena por campo string de mayor a menor", () => {
  const dataset = [
    { id: 1, city: "Santiago" },
    { id: 2, city: "Antofagasta" },
    { id: 3, city: "Valparaiso" },
  ];

  const result = orderBy("city", "desc")(dataset);

  assert.deepEqual(result.map((item) => item.city), [
    "Valparaiso",
    "Santiago",
    "Antofagasta",
  ]);
});

test("orderBy(field) usa asc por defecto", () => {
  const dataset = [
    { id: 1, score: 15 },
    { id: 2, score: 5 },
  ];

  const result = orderBy("score")(dataset);

  assert.deepEqual(result.map((item) => item.score), [5, 15]);
});

test("orderBy(field, direction) no muta el dataset original", () => {
  const dataset = [
    { id: 1, age: 32 },
    { id: 2, age: 24 },
  ];
  const snapshot = JSON.stringify(dataset);

  orderBy("age", "asc")(dataset);

  assert.equal(JSON.stringify(dataset), snapshot);
});

test("orderBy(field, direction) valida field y direction", () => {
  assert.throws(() => orderBy("", "asc"), TypeError);
  assert.throws(() => orderBy("age", "up"), TypeError);
});
