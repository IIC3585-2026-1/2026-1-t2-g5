const test = require("node:test"); // Se recupera el modulo de tests
const assert = require("node:assert/strict"); // Se recupera assert

const select = require("../js/select"); // Se obtiene la función select

test("select(fields) retorna solo los campos solicitados", () => {
  const dataset = [
    { id: 1, name: "Ana", age: 24, city: "Santiago" },
    { id: 2, name: "Luis", age: 35, city: "Valparaiso" },
  ];

  const result = select(["name", "city"])(dataset);

  assert.deepEqual(result, [
    { name: "Ana", city: "Santiago" },
    { name: "Luis", city: "Valparaiso" },
  ]);
});

test("select(fields) no muta el dataset original", () => {
  const dataset = [{ id: 1, name: "Ana", age: 24 }];
  const snapshot = JSON.stringify(dataset);

  const result = select(["name"])(dataset);

  assert.equal(JSON.stringify(dataset), snapshot);
  assert.notEqual(result[0], dataset[0]);
});

test("select(fields) lanza error si fields no es array de strings", () => {
  assert.throws(() => select("name"), TypeError);
  assert.throws(() => select(["name", 1]), TypeError);
});
