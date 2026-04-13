const test = require("node:test");
const assert = require("node:assert/strict");

const aggregate = require("../js/aggregate");
const groupBy = require("../js/groupBy");

const average = (numbers) =>
  numbers.length === 0
    ? 0
    : numbers.reduce((sum, n) => sum + n, 0) / numbers.length;

test("aggregate(aggregations) resume cada grupo con las funciones indicadas", () => {
  const dataset = [
    { id: 1, city: "Santiago", age: 30 },
    { id: 2, city: "Valparaiso", age: 40 },
    { id: 3, city: "Santiago", age: 20 },
  ];

  const grouped = groupBy("city")(dataset);
  const result = aggregate({
    count: (items) => items.length,
    avgAge: (items) => average(items.map((x) => x.age)),
  })(grouped);

  assert.deepEqual(
    result.sort((a, b) => a.groupKey.localeCompare(b.groupKey)),
    [
      { groupKey: "Santiago", count: 2, avgAge: 25 },
      { groupKey: "Valparaiso", count: 1, avgAge: 40 },
    ]
  );
});

test("aggregate(aggregations) valida el spec de agregaciones", () => {
  assert.throws(() => aggregate(null), TypeError);
  assert.throws(() => aggregate([]), TypeError);
  assert.throws(() => aggregate({ count: 3 }), TypeError);
});

test("aggregate(aggregations) espera un objeto agrupado (no un arreglo plano)", () => {
  assert.throws(
    () =>
      aggregate({ count: (items) => items.length })([
        { id: 1 },
        { id: 2 },
      ]),
    TypeError
  );
});

test("aggregate(aggregations) no muta el objeto agrupado ni los arreglos de cada grupo", () => {
  const dataset = [
    { id: 1, city: "Santiago" },
    { id: 2, city: "Santiago" },
  ];
  const grouped = groupBy("city")(dataset);
  const snapshot = JSON.stringify(grouped);

  aggregate({ count: (items) => items.length })(grouped);

  assert.equal(JSON.stringify(grouped), snapshot);
});
