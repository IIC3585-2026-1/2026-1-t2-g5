# Tarea-2-Web-Avanzado

Motor de consultas en memoria sobre arreglos de objetos, con API encadenada (estilo pipeline) inspirada en SQL.

## Cómo se cumplió la tarea (directo)

| Lo pedido | Qué hicimos |
|-----------|-------------|
| **`query(data)`** | Punto de entrada en `js/query.js`. Recibe un arreglo; si no lo es, lanza error. Hace copia superficial del arreglo (`slice`) para no reutilizar la misma referencia. |
| **No modificar el dataset original** | Las operaciones devuelven datos nuevos (por ejemplo `map`, `filter`, `slice` + `sort`, `reduce` con objetos nuevos). Los tests comprueban que el JSON de entrada no cambia. |
| **`select(fields)`** | `js/select.js`: valida arreglo de strings y proyecta cada fila con `map` + `reduce` (objetos nuevos). |
| **`where(predicateFn)`** | `js/where.js`: valida que sea función y aplica `filter`. |
| **`orderBy(field, 'asc' \| 'desc')`** | `js/orderBy.js`: valida campo y dirección; ordena una copia del arreglo (`slice` + `sort`). |
| **`groupBy(field)`** | `js/groupBy.js`: devuelve un objeto `{ claveGrupo: [filas…] }` armado con `reduce` e inmutabilidad (spread + `concat`). |
| **`aggregate(aggregations)`** | `js/aggregate.js`: recibe un objeto cuyos valores son funciones; cada una recibe el arreglo del grupo. Espera la salida de `groupBy`. Devuelve un arreglo de filas con `groupKey` y las métricas pedidas. |
| **`execute()`** | En `js/query.js`: recorre la lista de operaciones acumuladas con `reduce` y devuelve el resultado final. |
| **Programación funcional** | Sin clases ni bucles `for`/`while` en el motor. Se usan `map`, `filter`, `reduce`, funciones puras por operación y composición vía encadenamiento + `reduce` al ejecutar. |

Archivos del motor: carpeta **`js/`**. Punto de exportación: **`js/index.js`**.

## Cómo correr los tests

```bash
node --test
```

(O `npm test` si usás el `package.json` del repo.)

## Demo web (opcional, solo para mostrar)

No forma parte de los requisitos de la tarea; sirve para ver consultas sobre los JSON de `data/`.

```bash
npm install
npm run build:demo
npm run demo
```

Abrí la URL que indique `serve` (por defecto http://localhost:5173). El build copia `data/*.json` a `demo/public/data/` y genera el bundle `demo/public/query-demo.js`.
