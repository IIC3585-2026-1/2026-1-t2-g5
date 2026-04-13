// Se importan todas las funciones SQL
const query = require("./query");
const select = require("./select");
const where = require("./where");
const orderBy = require("./orderBy");
const groupBy = require("./groupBy");

module.exports = { query, select, where, orderBy, groupBy }; // Se exportan las funciones
