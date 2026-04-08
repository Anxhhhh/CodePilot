import path from 'path'
import fs from 'fs'


export const createFile = async(req, res)=>{
const {name} = req.query;

if(!name){
    console.log("The file name is required");

};



}