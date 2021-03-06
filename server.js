// Carga de modulos necesarios y creación de nueva aplicacion.
var express 	= require("express");
var app 	= express();
var bodyParser 	= require('body-parser');
var request 	= require("request");
var router = express.Router();
var md5 = require('md5');
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;

//var mongo = require('mongodb');
// URL con contenido JSON demostrativo.


var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017'; // remove the db name.
var db;
/*
MongoClient.connect(url, (err, client) => {
			db = client.db("local");
			///insertar
			db.collection('usuarios').insertOne({
			 nombre: "Otro User",
			 apellido: "NewEmployee",
			 email:"emailql@jdhdd.cl"
	 		});

});
*/


//weas para leer los parametros


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true,useNewUrlParser: true }));

app.get('/', function(req, res) {
	var response = {mensaje:"Hola Ql"};
	res.jsonp(response);
})

// Ejemplo: GET http://localhost:8080/users
// Consumimos datos Facke de la URL: https://jsonplaceholder.typicode.com/todos
app.get('/usuarios', function(req, res) {
	MongoClient.connect(url, (err, client) => {
				db = client.db("local");
				db.collection('usuarios').find({}).toArray(function(err, docs) {

				 // Print the documents returned
				 /*
				 docs.forEach(function(doc) {
						 console.log(doc);
				 });*/
				 if(docs){
        		res.jsonp(docs);
     		 }

				 // Close the DB
				 client.close();
				 });

	});
});

/****************************************************/
app.get('/usuarios/:id', function(req, res) {

	var UserId = req.params.id;
	console.log(UserId);
	MongoClient.connect(url, (err, client) => {

				db = client.db("local");
				db.collection('usuarios').find({"_id": ObjectId(UserId)}).toArray(function(err, docs) {

				 if(docs){
        		res.jsonp(docs);
     		 }

				 // Close the DB
				 client.close();
				 });

	});

})
/****************************************************/
app.post('/usuarios/add', function(req, res) {

	//console.log('body: ', req.body)
  //console.log('query: ', req.query)

	MongoClient.connect(url, (err, client) => {
				db = client.db("local");
				///insertar
				db.collection('usuarios').insertOne({
				 nombre: req.body.nombre,
				 apellido: req.body.apellido,
				 email:req.body.email
		 		});
	});
  res.jsonp({response:"OK"});

})

/****************************************************/
app.post('/usuarios/update', function(req, res) {

	//console.log('body: ', req.body)
  //console.log('query: ', req.query)
  var resultado;
	MongoClient.connect(url, (err, client) => {
				db = client.db("local");
				///insertar
				db.collection('usuarios').updateOne({"_id":ObjectId(req.body._id)},
					{
					 $set: {
						 nombre: req.body.nombre,
						 apellido: req.body.apellido,
						 email:req.body.email
					 }
				},function(err, result) {
             resultado = result;
        });

	});
  res.jsonp(resultado);

})

app.post('/usuarios/delete', function(req, res) {

	MongoClient.connect(url, (err, client) => {
				db = client.db("local");
				///insertar
				db.collection('usuarios').deleteOne({"_id":ObjectId(req.body._id)});

	});
  res.jsonp({response:"OK"});

})


app.post('/login', function(req, res) {

	var email = req.body.email;
  var pass = req.body.password;
  console.log(req.body);
  pass = crypto.createHash('md5').update(pass).digest("hex");
	console.log(email+'/'+pass);

	MongoClient.connect(url, (err, client) => {
			db = client.db("local");
			db.collection('usuarios').find({'email': email, 'password':pass}).toArray(function(err, docs) {
       if(docs){
      		res.jsonp(docs);
   		 }
			 // Close the DB
			 client.close();
			 });
	});

})


app.post('/guardar', function(req, res) {

	//console.log('body: ', req.body)
  //console.log('query: ', req.query)

	MongoClient.connect(url, (err, client) => {
				db = client.db("local");
				///insertar
        let password = req.body.password;
        password = crypto.createHash('md5').update(req.body.password).digest("hex");
        var data = {
				 nombre: req.body.nombre,
				 apellido: req.body.apellido,
				 email:req.body.email,
         password:password
		 		}
        console.log(data);
				db.collection('usuarios').insertOne(data);
	});
  res.jsonp({response:"OK"});

})

/****************************************************/


var server = app.listen(8888, function () {
    console.log('Server is running..');
});
