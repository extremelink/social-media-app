const { mongoose,Schema} = require("mongoose");

const userSchema =Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    password:{
        type:String,
        min:4,
        max:10,
        required:true
    },
    secret:{
        type:String,
        required:true,
        lowercase: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    about:{},
    image: {
        url: String,
        public_id: String
    },
    role:{
        type: String,
        default: "Subscriber"
    },
    following:[{type:Schema.ObjectId, ref:"User"}],
    followers:[{type:Schema.ObjectId, ref:"User"}],
},{ timestamps: true}
);

module.exports= mongoose.model("User",userSchema);