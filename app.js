var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
const { cursorTo } = require('readline');
const { Buffer } = require('buffer');
//Server
var app = express();
var port = process.env.PORT || 3000;
//creamos una llave
var randomKey= Buffer.from('xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=', 'base64')
const algorithm = 'aes-256-gcm';
const iv= crypto.randomBytes(16)
const msgUTF8= "Hola Jonatan"
const msg_buff = Buffer.from(msgUTF8, 'utf8')

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
	res.status(200).send("Funciona");
});

//Encription setup
const cipher = crypto.createCipheriv(algorithm,randomKey, iv)
let encrypted= cipher.update(msgUTF8,'utf8','binary')
encrypted += cipher.final('binary') 

const authTag = cipher.getAuthTag();
const authTagBase64 = authTag.toString('base64')

console.log(`Encrypted: ${encrypted}`)
console.log(`Auth tag: ${authTagBase64}`)

const decipher = crypto.createDecipheriv(algorithm,randomKey, iv)
let decrypted= decipher.update(encrypted,'binary','utf8')
decipher.setAuthTag(Buffer.from(authTagBase64,'base64'))
decrypted += decipher.final('utf8')

console.log(`decrypted: ${decrypted}`)


app.listen(port, function(){
	console.log(`Server running in http://localhost:${port}`);
	
});