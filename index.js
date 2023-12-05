const {agregarProducto, } = require('./consultas')
const express = require("express");
const app = express();
const fs = require("fs");
PORT = 3000;

app.use(express.json());
app.use(cors());

// login 
app.post('/', async (req,res){
    try {
        
    } catch (error) {
        
    }
}) 

// landing
app.get('/landing', async (req,res){
    try {
        
    } catch (error) {
        
    }
}) 

// producto
app.get('/producto:id', async (req,res){
    try {
        
    } catch (error) {
        
    }
}) 
// vender
app.post('/vender', async (req,res){
    try {
        
    } catch (error) {
        
    }
}) 


app.listen(PORT, console.log("¡Servidor ON!"));
