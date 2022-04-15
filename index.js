
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const mysql = require('mysql2');
require('dotenv').config();
const nodemailer = require('nodemailer');

//Conectamos a la Base de Datos
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "berni",
    database: "fullstack"
});

conexion.connect((error) =>{
    if(error) throw error;
    console.log('Conexión a la Base de Datos correcta!!');
});


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/assets", express.static(__dirname + "/public"));

//Configuramos el Motor de Plantillas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/', (req, res) =>{
    res.render('index', {titulo: 'Bienvenidos a la App'})
});

app.get('/formulario', (req, res) =>{
    res.render('formulario', {titulo: 'Formulario para Completar'})
});


app.post('/formulario', (req, res) =>{

    /*  res.json({
        Dato: 'Recibido'
    }); */

    //Desestructuración de las variables
    const { nombre, precio, descripcion } = req.body;
        
    if(nombre == "" || precio == ""){
        
        let validacion = 'Faltan datos para guardar el Producto';
        
        res.render('formulario', {
            titulo: 'Formulario para Completar',
            validacion
        });

    }else{

        let data = {
            producto_nombre: nombre,
            producto_precio: precio,
        };
        
        let sql = "INSERT INTO productos SET ?";

        let query = conexion.query(sql, data, (err, results) => {
            if (err) throw err;
            res.render('formulario', {titulo: 'Formulario para Completar'});
        }); 
    }
});

app.get('/productos', (req, res) =>{
    let sql = " SELECT * FROM productos";
    let query = conexion.query(sql, (err, results) => {
        if (err) throw err;
        res.render("productos", {
            titulo: 'Productos',
            results: results,
        });
        });
});

//UPDATE
app.post("/update", (req, res) => {
    let sql =
    "UPDATE productos SET producto_nombre='" +
    req.body.producto_nombre +
    "', producto_precio='" +
    req.body.producto_precio +
    "' WHERE producto_id=" +
    req.body.id;
    let query = conexion.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
    });
});


// DELETE

app.post("/delete", (req, res) => {
    let sql = "DELETE FROM productos WHERE producto_id=" + req.body.producto_id + "";
    let query = conexion.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect("/");
    });
});

app.get('/contacto', (req, res) =>{
    res.render('contacto', {titulo: 'Escríbenos'})
});

app.post('/contacto', (req, res) =>{

    //Desestructuración de las variables
    const { nombre, email } = req.body;
        
    if(nombre == "" || email == ""){
        
        let validacion = 'Faltan tus datos';
        
        res.render('contacto', {
            titulo: 'Escríbenos',
            validacion
        });

    }else{
        console.log(nombre);
        console.log(email);

        async function main(){

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: "Tu Correo Electrónico / Empresa",
                    pass: "xxxxxxxxxxxxxxxx",
                }
            });

            let info = await transporter.sendMail({
                from: 'Tu Correo Electrónico / Empresa',
                to: `${email}`,
                subject: "Nuevo mensaje de Contacto",
                html: `Gracias por contactar con nosotros <br>
                Nuestras promociones las puedes encontrar en nuestro <br>
                sitio web .....heroku.....
                `
            });

            res.render('enviado', {
                titulo: 'Mail Enviado',
                nombre,
                email
            }); 
        }

        main().catch(console.error);

    }


});

app.get('/administracion', (req, res) =>{
    res.json({titulo: 'Bienvenido Administrador'})
});

app.listen(PORT, () =>{
    console.log(`Servidor está trabajando en el Puerto ${process.env.PORT}`);
});

app.on('error', (err) =>{
    console.log(`Error en la ejecución del Servidor ${error}`);
})





