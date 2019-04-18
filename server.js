// Carga de modulos necesarios y creación de nueva aplicacion.
var express 	= require("express");
var app 	= express();
var bodyParser 	= require('body-parser');
var request 	= require("request");
var router = express.Router();
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

// Soporte para bodies codificados en jsonsupport.
app.use(bodyParser.json());
// Soporte para bodies codificados
app.use(bodyParser.urlencoded({ extended: true }));

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
app.post('/usuarios/:id', function(req, res) {

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


var server = app.listen(8888, function () {
    console.log('Server is running..');
});
