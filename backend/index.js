const express = require("express");
const cors = require("cors");
const pool = require("./db");


const app = express ();

app.use(cors());
app.use(express.json());

//buscador

app.get("/articulos",async(req,res)=>{
    try{
        const { buscar } = req.query;

        let consulta = "SELECT * FROM articulos";
        let valores = [];

        if(buscar){
            consulta += " WHERE nombre ILIKE $1";
            valores.push(`%${buscar}%`);
        }

        const resultado = await pool.query(consulta, valores);
        res.json(resultado.rows);
        }catch(error){
            res.status(500).json({error: error.message });
        }
    });

    //creador

app.post("/articulos", async(req, res) => {
    try{
        const {nombre, precio, stock} = req.body;

        const existe = await pool.query(
            "SELECT * FROM articulos WHERE nombre = $1",
            [nombre]
        );

        if(existe.rows.length > 0) {
            return res.status(400).json({error:"Ya existe ese articulo"});
        }

        const resultado = await pool.query(
            "INSERT INTO articulos ( nombre, precio, stock) VALUES ( $1, $2, $3) RETURNING *",
            [nombre, precio, stock]
        );

        res.status(201).json(resultado.rows[0]);
        }catch(error){
            res.status(500).json({error:error.message});
        }
});

      //Ventas

app.post("/ventas", async (req,res)=>{
    try{
        const { items } = req.body;

        for( const item of items ){
            const consulta = await pool.query(
                "SELECT stock FROM articulos WHERE id = $1",
                [item.id]
            );
            if (consulta.rows.length === 0) {
                return res.status(404).json({error:"Articulo no encontrado"});
            }

            const stockActual = consulta.rows[0].stock;
            if (stockActual < item.cantidad) {
                return res.status(400).json({
                    error: ` No hay stock sificiente de ${item.nombre}. 
                    stock actual: ${stockActual}`
                });
            }
        }

        for (const item of items){

            await pool.query(
                "UPDATE articulos SET stock = stock - $1 WHERE id = $2",
                [item.cantidad, item.id]
            );
        }
        res.json({ mensaje: "Venta confirmada"});
    }catch(error) {
        res.status(500).json({error: error.message});
    }
});


// modificar 
app.get("/articulos", async (req,res)=>{
    try{
        const { buscar }= req.query;
        let sqlid="SELECT * FROM articulos";
        let artid=[];

        if(buscar){
            sqlid += " WHERE nombre ILIKE $1"
            artid.push(`%${buscar}%`)
        }
        const resul = await pool.query(sqlid, artid);
        res.json(resul.rows);

    }catch(error){
        console.log("error"+error);
    }
})

app.put("/articulos/:id", async (req,res)=>{
    try{
        const { id }= req.params;
        const {nombre, precio, stock}= req.body;

        const data = await pool.query(
            "UPDATE articulos SET nombre = $1, precio = $2, stock = $3 WHERE id = $4 RETURNING *",[nombre,precio,stock,id]);

        res.send({ mensaje: "Articulo actualizado" });
    }catch(error){
        console.log("error"+error);
    }

})


    app.listen(3000, () => {
        console.log("Servidor en http://localhost:3000");
    });