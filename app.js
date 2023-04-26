'use strict';
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require("cors");

app.use(cors());

app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'dist')));

app.get("/", function(req, res){
  // if(req.cookies['autorization']){
  //   res.sendFile(__dirname+'/monetario/monetario.html');
  // }else{
    res.sendFile(__dirname+'/src/login.html');
  // }
});

app.get("/cadastro", function(req, res){
  res.sendFile(path.join(__dirname, 'dist')+'/cadastro/cadastro.html');
});

app.get("/admin", function(req, res){
  res.sendFile(path.join(__dirname, 'dist')+'/admin/admin.html');
});

app.get("/agendamento", function(req, res){
  res.sendFile(path.join(__dirname, 'dist')+'/agendamento/agendamento.html');
});

app.listen(8082);