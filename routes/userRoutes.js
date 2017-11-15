const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = require("../models/m_user");
const Outlet = require("../models/m_outlet");

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const checkJwt = require('express-jwt')

const users = require("../data/tempUser");

router.use(
    checkJwt({secret:process.env.JWT_SECRET}).unless({path:['/api/ContactManager/Authenticate']})
);

router.use((err,req,res,next) => {
    if(err.name == 'UnauthorizedError'){
        res.status(401).send({error:err.message})
    }
})


router.get("/", (req, res) => {
    res.json({ "message": "Welcome to user route" })
})


//used to push new uses form json
router.get("/adduserdata", (req, res) => {

    var promises = users.map((item) => {

        return bcrypt.genSalt(10)
            .then((salt) => {
                return bcrypt.hash(item.password, salt)
            })
            .then((hash) => {
                item.password = hash;
                return item
            })

    }); //end promises = users.map

    Promise.all(promises)
        .then((results) => {
            console.log(results)
            User.insertMany(results)
                .then((data) => {
                    res.json(data)
                })
                .catch((err) => {
                    res.json(err)
                })
        })

})

//authenticate/login user
router.post("/Authenticate",(req,res) => {
	const user = req.body;
	
	let userPromise = User.findOne({email:user.AuthenticateRequest.Email}).exec();

	userPromise.then((result) => {
		
		if(result == null){
			res.status(404).json({"Message":{"success":false,"Message":"User Does not exists"}})
		}else{
			if(!bcrypt.compareSync(user.AuthenticateRequest.Password,result.password)){
				res.status(401).json({"Message":{"success":false,value:"Authentication failed"}})
                console.log("not matched")
			}else{
				const payload = {
                    username:result.name,
					usermail:result.email
				}

				const token = jwt.sign(payload,process.env.JWT_SECRET,{
                    expiresIn:'4h'
                })

				res.status(200).json({"AuthenticateResponse":{"Username":result.name,"Token":token}})

			}
		}
	})

})

//QuickSearch route
router.post("/QuickSearch",(req,res) => {
    const searchDataRaw = req.body;
    const name = searchDataRaw.QuickSearchRequest.Name;
    
    var regex = new RegExp(name, "i")
    ,   query = { OutletName: regex };
    
    let outletPromise = Outlet.find(query).limit(5).exec();
    console.log(name)
    
    outletPromise.then((result) => {
        res.json(result);
    })
    
});//end QuickSearch


module.exports = router;