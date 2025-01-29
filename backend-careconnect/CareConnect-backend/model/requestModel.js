import {Schema, model} from 'mongoose';

const requestSchema= new Schema({
    request:{
        type : String,
        required : true
    },
    time:{
        type : String,
        required : true,
        unique : true
    },
    date:{
        type : String,
        required : true
    },
})

const Request = model('Request',requestSchema);
export default Request;