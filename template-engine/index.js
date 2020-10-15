// http://handlebarsjs.com/guide (el lenguaje de templating handlebars)
// https://github.com/ericf/express-handlebars (esta librería)
// https://expressjs.com/en/guide/using-template-engines.html (cómo express usa template engines)
// multer es para subir archivos de un form que tiene type enctype multipart/form-data


// nodejs core, fs = filesystem
const fs = require('fs');
const express = require('express');
const multer = require('multer');

const upload = multer({ dest: './uploads/imagenes' });
const exphbs = require('express-handlebars');

class ObjEquipo {
  constructor (name, id, country, web, year, img) {
      this.name = name;
      this.id = id;
      this.country = country;
      this.web = web;
      this.year = year;
      this.img = img;
  }
}

const PUERTO = 8080;
const app = express();
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// esto define que el directorio /uploads contiene assets estáticos,
// que se deben servir tal cual están
// notar que no hace falta ir a localhost:8080/uploads
// https://expressjs.com/en/starter/static-files.html
app.use(express.static(`${__dirname}/uploads`));
app.use(express.urlencoded());
app.use(express.json());

const nombre = 'Leonel';
let equipoActual = "";
//JSON.parse()
//JSON.stringiy()
//const equipos = []; // todos los equipos van a estar en este arrays de objEquipo
const equipos = JSON.parse(fs.readFileSync('./data/mis_equipos.json'));

app.get('/', (req, res) => { //vista principal, tabla inicial
  res.render('inicio', {
    layout: 'base',
    data: {
      filas : equipos.length,
      equipos,
    },
  });
});

app.get('/add', (req, res) => {
  res.render('agregar_equipo', {
    layout : 'base',
    data : {
      idCreado : equipos.length,
    },
  });
});

/*app.post('/add', upload.single('escudo'), (req, res) => {
  console.log(req.file);
  res.render('agregar_equipo', {
    layout: 'base',
    data: {
      mensaje: 'Éxito!',
      nombreArchivo: req.file.filename,
    },
  });
});*/

app.post('/add', upload.single('escudo'), function(req, res){
  console.log(req.body.user.id);
  const eqNew = new ObjEquipo(req.body.user.name,req.body.user.id,req.body.country,req.body.web,req.body.year,req.file.filename);
  equipos.push(eqNew);
  res.redirect('/');
});

app.post('/edit', function(req, res){
  res.redirect(`edit/${req.body.user.id}`)
  equipoActual = req.body.user.id;
  //console.log(equipoActual);
  app.get(`/edit/${equipoActual}`, (req, res) => {
    equipoNum = parseInt(equipoActual);
    res.render('edit_equipo', {
      layout : 'base',
      data : {
        nombre_equipo : equipos[equipoNum].name,
        ano_equipo : equipos[equipoNum].year,
        pais : equipos[equipoNum].country,
        web : equipos[equipoNum].web,
      },
    });
  });
});

app.post('/view', function(req, res){
  res.redirect(`view/${req.body.user.id}`)
  equipoActual = req.body.user.id;
  //console.log(equipoActual);
  app.get(`/view/${equipoActual}`, (req, res) => {
    equipoNum = parseInt(equipoActual);
    res.render('ver_equipo', {
      layout : 'base',
      data : {
        nombre_equipo : equipos[equipoNum].name,
        ano_equipo : equipos[equipoNum].year,
        pais : equipos[equipoNum].country,
        web : equipos[equipoNum].web,
        img : equipos[equipoNum].img,
      },
    });
  });
});

app.post('/delete', function(req, res){
  equipoActual = req.body.user.id;
  console.log(equipoActual);
  equipoNum = parseInt(equipoActual);
  removeItemFromArr(equipos,equipos[equipoNum]);
  for (i = equipoNum; i<equipos.length; i++) {
    equipos[i].id = (i).toString(); 
  }
  res.redirect('/');
});

function removeItemFromArr ( arr, item ) {
  var i = arr.indexOf( item );
  if ( i !== -1 ) {
      arr.splice( i, 1 );
  }
}

app.get('/form', (req, res) => {
  console.log(req.files);
  res.render('form', {
    layout: 'ejemplo',
  });
});

app.listen(PUERTO);
console.log(`Escuchando en http://localhost:${PUERTO}`);
