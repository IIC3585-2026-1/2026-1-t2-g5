const test = require("node:test"); // Se recupera el modulo de tests
const assert = require("node:assert/strict"); // Se recupera assert

const query = require("../js/query"); // Se obtiene la función query

test("query(data) lanza error cuando data no es un arreglo", () => {
  assert.throws(() => query({ id: 1 }), TypeError);
  assert.throws(() => query("texto"), TypeError);
});

test("query(data).where(...).select(...).execute() aplica pipeline en orden", () => {
  const users = [
    { id: 1, name: "Ana", age: 24, city: "Santiago" },
    { id: 2, name: "Luis", age: 35, city: "Valparaiso" },
    { id: 3, name: "Carla", age: 32, city: "Santiago" },
  ];

  const result = query(users)
    .where((user) => user.age >= 30)
    .select(["name", "city"])
    .execute();

  assert.deepEqual(result, [
    { name: "Luis", city: "Valparaiso" },
    { name: "Carla", city: "Santiago" },
  ]);
});

test("query(data).where(...).orderBy(...).select(...).execute() mantiene el orden del pipeline", () => {
  const users = [
    { id: 1, name: "Ana", age: 24, city: "Santiago" },
    { id: 2, name: "Luis", age: 35, city: "Valparaiso" },
    { id: 3, name: "Carla", age: 32, city: "Santiago" },
    { id: 4, name: "Pedro", age: 41, city: "Concepcion" },
  ];

  const result = query(users)
    .where((user) => user.age >= 30)
    .orderBy("age", "desc")
    .select(["name", "age"])
    .execute();

  assert.deepEqual(result, [
    { name: "Pedro", age: 41 },
    { name: "Luis", age: 35 },
    { name: "Carla", age: 32 },
  ]);
});

test("query(data).groupBy(...).execute() retorna estructura agrupada", () => {
  const users = [
    { id: 1, city: "Santiago" },
    { id: 2, city: "Valparaiso" },
    { id: 3, city: "Santiago" },
  ];

  const result = query(users).groupBy("city").execute();

  assert.deepEqual(Object.keys(result).sort(), ["Santiago", "Valparaiso"]);
  assert.deepEqual(
    result.Santiago.map((user) => user.id),
    [1, 3]
  );
});

test("query(data).where(...).groupBy(...).aggregate(...).execute() resume por grupo", () => {
  const users = [
    { name: "Ana", country: "Chile", city: "Santiago", age: 30 },
    { name: "Luis", country: "Peru", city: "Lima", age: 35 },
    { name: "Carla", country: "Chile", city: "Santiago", age: 34 },
    { name: "Pedro", country: "Chile", city: "Valparaiso", age: 28 },
  ];

  const average = (numbers) =>
    numbers.reduce((sum, n) => sum + n, 0) / numbers.length;

  const result = query(users)
    .where((u) => u.country === "Chile")
    .groupBy("city")
    .aggregate({
      count: (items) => items.length,
      avgAge: (items) => average(items.map((x) => x.age)),
    })
    .execute();

  assert.deepEqual(
    result.sort((a, b) => a.groupKey.localeCompare(b.groupKey)),
    [
      { groupKey: "Santiago", count: 2, avgAge: 32 },
      { groupKey: "Valparaiso", count: 1, avgAge: 28 },
    ]
  );
});

test("execute() sin operaciones retorna una copia del dataset", () => {
  const users = [{ id: 1, name: "Ana" }];

  const result = query(users).execute();

  assert.deepEqual(result, users);
  assert.notEqual(result, users);
});

test("query(...) mantiene inmutabilidad del dataset original", () => {
  const users = [
    { id: 1, name: "Ana", age: 24 },
    { id: 2, name: "Luis", age: 35 },
  ];
  const snapshot = JSON.stringify(users);

  query(users).where((user) => user.age > 30).select(["name"]).execute();

  assert.equal(JSON.stringify(users), snapshot);
});

test("query(...).orderBy(...) y query(...).groupBy(...) validan parametros invalidos", () => {
  assert.throws(() => query([{ id: 1 }]).orderBy("id", "up"), TypeError);
  assert.throws(() => query([{ id: 1 }]).groupBy(""), TypeError);
});

test("query(...).aggregate(...) sin groupBy previo lanza TypeError", () => {
  assert.throws(
    () =>
      query([{ id: 1 }])
        .aggregate({ count: (items) => items.length })
        .execute(),
    TypeError
  );
});
