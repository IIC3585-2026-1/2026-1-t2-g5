const test = require("node:test"); // Se recupera el modulo de tests
const assert = require("node:assert/strict"); // Se recupera el assert

const groupBy = require("../js/groupBy"); // Se recupera la función groupBy

test("groupBy(field) agrupa elementos por el campo indicado", () => {
  const dataset = [
    { id: 1, city: "Santiago" },
    { id: 2, city: "Valparaiso" },
    { id: 3, city: "Santiago" },
  ];

  const result = groupBy("city")(dataset);

  assert.deepEqual(Object.keys(result).sort(), ["Santiago", "Valparaiso"]);
  assert.deepEqual(
    result.Santiago.map((item) => item.id),
    [1, 3]
  );
  assert.deepEqual(
    result.Valparaiso.map((item) => item.id),
    [2]
  );
});

test("groupBy(field) crea grupo 'undefined' si falta el campo", () => {
  const dataset = [{ id: 1, city: "Santiago" }, { id: 2 }];

  const result = groupBy("city")(dataset);

  assert.deepEqual(result.undefined.map((item) => item.id), [2]);
});

test("groupBy(field) no muta el dataset original", () => {
  const dataset = [
    { id: 1, city: "Santiago" },
    { id: 2, city: "Valparaiso" },
  ];
  const snapshot = JSON.stringify(dataset);

  groupBy("city")(dataset);

  assert.equal(JSON.stringify(dataset), snapshot);
});

test("groupBy(field) valida field", () => {
  assert.throws(() => groupBy(""), TypeError);
  assert.throws(() => groupBy(10), TypeError);
});
