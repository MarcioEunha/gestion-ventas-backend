

const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Proyecto",
    password: "TU CONTRASEÑA AQUI",
    port: 5432
});
console.log("pool creado:", pool);

module.exports = pool;