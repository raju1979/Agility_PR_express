const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = require("../models/m_user");
const Outlet = require("../models/m_outlet");
const Contact = require("../models/m_contacts");

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
    
    let outletResult = {
        "QuickSearchResponse":{
            "Username":"Rajesh"
        }   
    };
    
    var regex = new RegExp(name, "i")
    ,   queryOutlet = { OutletName: regex }
    ,   queryContact = {Username: regex}
    
    
    let outletPromise = Outlet.find(queryOutlet,{OutletName:1,ProfileImageUrl:1}).exec();
    console.log(name)
    
    outletPromise.then((result) => {
        if(result){
            outletResult.Outlets = result;
        }else{
            outletResult.Outlets = [];
        }
//        res.json(outletResult);
        return Contact.aggregate(
            [
                { $match: { Username: regex } },
                {
                $project:{
                        Username:1,
                        ApiID:"$ContactDetail.ApiID",
                        Name:"$ContactDetail.ContactName",                       ProfileImageUrl:"$ContactDetail.ProfileImageUrl",
                        OutletName:"$ContactDetail.OutletName"

                    }
                }
            ]
        ).exec()
    })
    .then((contacts) => {
        console.log(contacts)
        if(contacts){
            contacts.forEach((item) => {
                
            })
            outletResult.Contacts = contacts
        }else{
            outletResult.Contacts = []
        }
        
        console.log(`total records : ${outletResult.Contacts.length + outletResult.Outlets.length}`)
        
        let totalRecordsReceived = outletResult.Contacts.length + outletResult.Outlets.length;
        
//        if(outletResult.Contacts.length == 0 && outletResult.Outlets.length == 0){
//            res.status(205).send({"Message":"No matching records found"})
//        }if(outletResult.Contacts.length + outletResult.Outlets.length >){
//            res.status(205).send({"Message":"No matching records found"})
//        }else if(outletResult.Contacts.length > 0  || outletResult.Outlets.length > 0){
//            res.status(200).json(outletResult);
//        }else{
//            res.send('outletResult')
//        }
        
        if(totalRecordsReceived == 0){
            res.status(204).send({"Message":"No matching records found"})
        }else if(totalRecordsReceived >= 3000){
            res.status(500).send({"Message":"Search term too broad. Please refine your search."})
        }else{
            res.status(200).json(outletResult);
        }
        
    })
});//end QuickSearch

//temp route to test user model
router.post("/alluses",(req,res) => {
    let userPromise = Contact.find(queryContact).exec();
    userPromise.then((users) => {
        if(users){
            res.json(users);
        }
    })
});//


module.exports = router;