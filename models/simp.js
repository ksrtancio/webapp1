const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const simpSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    nationality:{
        type: String,
        required: true
    },
    birthdate:{
        type: String,
        required:true
    }
},
{timestamps: true});

const Simp = mongoose.model('Simp', simpSchema)
module.exports = Simp;