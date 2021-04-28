const express = require("express")
const fs = require("fs")
const csv = require("csv-parser")

const app = express()
app.listen(8080)
console.log("Server : http://localhost:8080");

app.use(express.static(__dirname+"/views",""))

/**
 * route pour recuperer les infos du fichier csv
 */
app.get("/data",(req,res)=>{
    let result = []
    /*Lit le fichier csv*/
    fs.createReadStream(__dirname+'/data/exercice_lekaba.csv')
    .pipe(csv()) //convertis le csv en json
    .on("data",data => result.push(data))
    .on("end",()=>{
        result.forEach(element=>{
            element.images = element.images.split("|")//Sépare les images en tableau (utile par la suite)
        })
        res.json(result) //envoie les données au format JSON
    })
})
/**
 * route pour afficher la page de la carte interactive
 */
app.get("*",(req,res)=>{
    res.sendFile(__dirname+"/views/index.html")
})