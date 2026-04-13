# Tarea-2-Web-Avanzado

Hicimos un motor chico que le pegas a un arreglo de objetos en JSON y vas encadenando cosas parecidas a SQL: filtrar, elegir columnas, ordenar, agrupar y después resumir con aggregate. Al final llamas execute y te devuelve el resultado.

El código está en la carpeta js, partido en un archivo por operación, y query.js junta todo y va guardando los pasos hasta que ejecutas.

Qué hace cada parte:

query recibe el arreglo de datos y arranca la cadena. Hace una copia del arreglo para no tocar el original.

where recibe una función y se queda solo con las filas donde esa función da verdadero, como un filtro.

select recibe una lista de nombres de campos y devuelve objetos nuevos solo con esas propiedades.

orderBy ordena por un campo, ascendente o descendente.

groupBy agrupa por un campo. El resultado pasa a ser un objeto donde cada clave es un valor del campo y el valor es la lista de filas de ese grupo.

aggregate va después de groupBy. Le pasas un objeto donde cada clave es el nombre de un resultado y cada valor es una función que recibe las filas de un grupo y devuelve un número o lo que quieras calcular. Al final obtienes una lista de resúmenes, una fila por grupo.

execute es el que de verdad corre todo lo que encadenaste y te devuelve el resultado.

Tratamos de no romper los datos de entrada: en general devolvemos cosas nuevas y usamos map, filter y reduce en vez de for o while. No usamos clases.

Los datos de prueba están en data. Para probar:

```
node --test
```

Si tienes npm instalado también puedes usar npm test.

La carpeta demo es solo una pantalla simple para mostrar en la presentación hecha con IA, no era obligatoria. Para verla:

```
npm install
npm run build:demo
npm run demo
```

Después abres lo que te diga la consola, casi siempre es localhost en el puerto 5173.

## Uso de IA

Se utilizó IA como apoyo en:

- La generación de la interfaz de la demo (HTML, CSS y parte de app.js)
- La configuración de archivos de build (build.mjs, entry.cjs)
- Sugerencias para la simulación de endpoints y manejo de cache

Estas herramientas se usaron como apoyo, principalmente para características extras que aportaban valor al proyecto, pero no eran necesarias en lo pedido para la entrega, sin embargo, la implementación de las funciones del motor de consultas fue realizada manualmente, mientras que el testing asociado contó con apoyo de IA.
