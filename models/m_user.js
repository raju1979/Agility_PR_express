const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	isActive:{
		type:Boolean,
		required:true,
		default:false
	},
	picture:{
		type:String,
		required:true,
		default:"http://placehold.it/64x64"
	},
	password:{
		type:String,
		required:true
	},
	age:{
		type:Number,
		required:true
	},
	name:{
		type:String,
		required:true
	},
	gender:{
		type:String,
		required:true
	},
	company:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	phone:{
		type:String,
		required:true
	},
	address:{
		type:String,
		required:true
	},
	latitude:{
		type:String,
		required:true
	},
	longitude:{
		type:String,
		required:true
	}
})

const User = mongoose.model("Users",userSchema);
module.exports = User;
