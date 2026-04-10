const test = require("node:test"); // Se recupera el módulo de tests
const assert = require("node:assert/strict"); // Se recupera assert
const fs = require("node:fs"); // Se recupera fs para leer los datasets
const path = require("node:path"); // Se recupera path para abrir los paths de los datasets

const query = require("../js/query");

const readJson = (relativePath) =>
  JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8")
  );

test("integracion: filtra y ordena transacciones reales", () => {
  const transactions = readJson("data/transactions.json");

  const result = query(transactions)
    .where(
      (tx) =>
        tx.currency === "CLP" && tx.status === "completed" && tx.amount >= 50000
    )
    .orderBy("amount", "desc")
    .select(["id", "userId", "amount", "currency", "status"])
    .execute();

  assert.ok(result.length > 0);
  assert.ok(
    result.every(
      (tx) =>
        tx.currency === "CLP" && tx.status === "completed" && tx.amount >= 50000
    )
  );
  assert.ok(result[0].amount >= result[result.length - 1].amount);
});

test("integracion: simula join con producto cruz + where", () => {
  const users = readJson("data/users.json");
  const transactions = readJson("data/transactions.json");

  const crossProduct = users.flatMap((user) =>
    transactions.map((tx) => ({
      userId: user.id,
      userName: user.name,
      userCountry: user.country,
      txId: tx.id,
      txUserId: tx.userId,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
    }))
  );

  const joined = query(crossProduct)
    .where((row) => row.userId === row.txUserId)
    .where((row) => row.userCountry === "Chile")
    .select(["userId", "userName", "txId", "amount", "currency", "status"])
    .execute();

  const usersById = new Map(users.map((user) => [user.id, user]));
  const expectedCount = transactions.filter(
    (tx) => usersById.get(tx.userId)?.country === "Chile"
  ).length;

  assert.equal(joined.length, expectedCount);
  assert.ok(
    joined.every(
      (row) =>
        typeof row.userId === "number" &&
        typeof row.userName === "string" &&
        typeof row.txId === "number"
    )
  );
});
