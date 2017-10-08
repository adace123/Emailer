let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let User = require('../models/User');
let fs = require('fs');
let validator = require('validator');
let mailer = require("nodemailer");
let config = JSON.parse(fs.readFileSync('././config.json'));
let flatten = require('flat');
let bcrypt = require('bcrypt');
let authorizedUser = null;

try {
mongoose.connect(`mongodb://${config.username}:${config.password}@${config.url}`)
} catch(err) {
    console.log(err.message);
}

router.get('/', (req,res) => {
    if(req.session.user) {
        res.redirect('/emailForm');
    }
   else res.render('index'); 
});

router.post('/login', (req,res) => {
    let hash = bcrypt.hashSync(req.body.password, 10);
    let loggedInUser = new User({
        email: req.body.email,
        password: req.body.password,
        contacts: []
    });
    
    let errors = checkUser(loggedInUser.email, loggedInUser.password);
    if(errors.length === 0) {
      User.findOne({email: loggedInUser.email}, (err, user) => {
            if(user && bcrypt.compareSync(loggedInUser.password, hash)) {
                req.session.user = user;
                req.session.save(() => {
                    res.send({user});
                });
                
            }
            else{
                errors.push("Invalid email/password combination");
                res.send({errors});
            }
        });
    }
    else res.send({errors});
});

router.get('/emailform', (req,res) => {
    if(req.session.user) {
      res.render('email');
    }
   else res.redirect('/');
});

router.post('/emailForm', (req,res) => {
    let errors = [];
    if(!validator.isEmail(req.body.email)) {
        errors.push("Invalid email");
    }
    if(req.body.body === "") {
        errors.push("Email body cannot be blank");
    }
    if(req.body.fileSize > 10240000 * 2) {
        errors.push("Email attachments cannot be more than 20MB total in size");
    }
    if(req.body.subject === "") {
        errors.push("Subject cannot be blank");
    }
    if(errors.length > 0) {
        res.send({errors});
    } else {
        let transport = mailer.createTransport({
           service: "gmail",
           auth: {
               user: config.email,
               pass: config.emailPassword
           }
        });
        let files = [];
        if(req.files) {
        let flattened = flatten(req.files);
        let data = Object.keys(flattened).filter(field => /\.name/.test(field) || /\.data/.test(field));
        for(let i = 0; i < data.length; i+=2) {
            files.push({filename: flattened[data[i]], content: flattened[data[i+1]]});
        }
        }
        let mailOptions = {
            from: req.session.user.email,
            to: req.body.email,
            subject: req.body.subject, 
            text: req.body.body,
            attachments: files
        };
        
        transport.sendMail(mailOptions, (error,info) => {
            if(error) {
                res.send({error});
            } else {
                User.findOne({email: req.session.user.email}, (err,user) => {
                    let id = user._id;
                    for(let contact of user.contacts) {
                        if(contact === req.body.email) {
                            
                            res.send("sent with existing contact");
                            return false;
                        }
                    }
                    user.contacts.push(req.body.email);
                    user.isNew = false;
                    user.save((err,info) =>{
                        if(err) {
                            console.log("second error "  + err);
                        } else res.send("sent with new contact");
                    });
                });
                
            }
        })
    }
});

router.post('/deleteContact', (req,res) => {
   User.findOne({email: req.session.user.email, password: req.session.user.password}, (err,user) => {
       if(user) {
           user.contacts.splice(user.contacts.indexOf(req.body.contact), 1);
           user.save((err, data) => {
               res.send(data);
           });
       }
   });
});

router.get('/fetchUser', (req,res) => {
   if(req.session.user) {
       User.findOne({email: req.session.user.email, password: req.session.user.password}, (err, user) => {
          if(user) {
              res.send(user);
          } 
       });
   } else res.send({error: "Not logged in"});
});

router.post('/logout', (req,res) => {
    req.session.destroy(err => {
       if(err) {
           console.log(err);
       } else res.send('session destroyed');
    });
});

router.post('/register', (req,res) => {
    console.log(req.body.password);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    let newUser = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        contacts: []
    });
    let errors = checkUser(req.body.email, req.body.password);
    
    User.findOne({email: newUser.email},(err, user) => {
       if(user) {
           errors.push("Email already taken");
           res.send({errors});
       }
    });
    
    if(errors.length === 0)
    newUser.save((err,user) => {
        
        req.session.user = user;
        res.send({user});
    });
    else res.send({errors});
});

let checkUser = (email, password) => {
    let errors = [];

    if(email.length < 8 || email.length > 32) {
        errors.push("Email must be between 8 and 32 characters");
    } 
    else if(!validator.isEmail(email)) {
        errors.push("Invalid email");
    }
    if(password.length < 8 || password.length > 32) {
        errors.push("Password must be between 8 and 32 characters");
    }
    return errors;
};

module.exports = router;