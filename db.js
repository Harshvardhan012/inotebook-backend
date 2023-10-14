// password ="UMSYKt8ClcXuKQPB"
const mongoose = require('mongoose');
const uri = "mongodb+srv://3637harshsingh:UMSYKt8ClcXuKQPB@cluster0.piajh2e.mongodb.net/inotebook";

const connectMoongose = ()=>{
    mongoose.connect(uri);
    console.log("Successfully Connected To Data Base");
} 

module.exports = connectMoongose;