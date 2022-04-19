
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
    password: "papelitos1",
    database: "trabajofinal"
});

conexion.connect((error) =>{
    if(error) throw error;
    console.log('Conexión a la Base de Datos correcta!!');
});


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/assets", express.static(__dirname + "/public"));
app.use('/public',express.static('Public'));
app.use('/multimedia',express.static('multimedia'));

//Configuramos el Motor de Plantillas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


app.get('/', (req, res) =>{
    res.render('index')
});

app.get('/quienessomos', (req, res) =>{
    res.render('quienessomos')
});

app.get('/productos', (req, res) =>{
    res.render('productos')
});

app.get('/contacto', (req, res) =>{
    res.render('contacto')
});

app.post('/contacto', (req, res) =>{

    //Desestructuración de las variables
    const { nombre, correo, telefono, descripcion } = req.body;
        
    if(nombre == "" || telefono == "" || descripcion == "" ){
        
        let validacion = 'Faltan tus datos';
        
        res.render('contacto', {
            titulo: 'Escríbenos',
            validacion
        });

    }else{
        //INSERTAR datos a DB


        let data = {
            conta_nombre: nombre,
            conta_correo: correo,
            conta_telefono: telefono,
            conta_descripcion: descripcion,
        };
        
        let sql = "INSERT INTO conta SET ?";

        conexion.query(sql, data, (err, results) => {
            if (err) throw err;
            res.render('contacto');
        }); 
    }
});




app.listen(PORT, () =>{
    console.log(`Servidor está trabajando en el Puerto ${process.env.PORT}`);
});

app.on('error', (err) =>{
    console.log(`Error en la ejecución del Servidor ${error}`);
})





