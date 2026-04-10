const test = require("node:test"); // Se recupera el modulo de tests
const assert = require("node:assert/strict"); // Se recupera assert

const where = require("../js/where"); // Se obtiene la función where

test("where(predicateFn) filtra correctamente los elementos", () => {
  const dataset = [
    { id: 1, age: 24 },
    { id: 2, age: 35 },
    { id: 3, age: 30 },
  ];

  const result = where((item) => item.age >= 30)(dataset);

  assert.deepEqual(result, [
    { id: 2, age: 35 },
    { id: 3, age: 30 },
  ]);
});

test("where(predicateFn) no muta el dataset original", () => {
  const dataset = [
    { id: 1, active: true },
    { id: 2, active: false },
  ];
  const snapshot = JSON.stringify(dataset);

  where((item) => item.active)(dataset);

  assert.equal(JSON.stringify(dataset), snapshot);
});

test("where(predicateFn) lanza error si predicateFn no es funcion", () => {
  assert.throws(() => where(null), TypeError);
  assert.throws(() => where("item => item.active"), TypeError);
});
