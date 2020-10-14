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
  constructor (name, id, country, web, year) {
      this.name = name;
      this.id = id;
      this.country = country;
      this.web = web;
      this.year = year;
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
const equipos = []; // todos los equipos van a estar en este arrays de objEquipo
equipos[0] = new ObjEquipo("Arsenal FC","0","England","http://www.arsenal.com",1886);
equipos[1] = new ObjEquipo("Aston Villa FC","1","England","http://www.avfc.co.uk",1872);

app.get('/', (req, res) => { //vista principal, tabla inicial
  res.render('inicio', {
    layout: 'base',
    data: {
      nombre_equipo : equipos[0].name,
      pais : equipos[0].country,
      filas : equipos.length,
      equipos,
    },
  });
});

app.get('/add', (req, res) => {
  res.render('agregar_equipo', {
    layout : 'base',
    data : {

    },
  });
});

app.post('/edit', function(request, response){
  response.redirect(`edit/${request.body.user.id}`)
  equipoActual = request.body.user.id;
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

app.post('/view', function(request, response){
  response.redirect(`view/${request.body.user.id}`)
  equipoActual = request.body.user.id;
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
      },
    });
  });
});

app.get('/form', (req, res) => {
  console.log(req.files);
  res.render('form', {
    layout: 'ejemplo',
  });
});

app.post('/form', upload.single('imagen'), (req, res) => {
  console.log(req.file);
  res.render('form', {
    layout: 'ejemplo',
    data: {
      mensaje: 'Éxito!',
      nombreArchivo: req.file.filename,
    },
  });
});

app.get('/equipos', (req, res) => {
  const equipos = fs.readFileSync('./data/equipos.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(equipos);
});

function setPos (num) {
  return num;
}

app.listen(PUERTO);
console.log(`Escuchando en http://localhost:${PUERTO}`);
