var User = require('../models/user');
var Story = require('../models/story');
var List = require('../models/list');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');


function createToken(user) {
    
    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {expiresIn: 1440});
    
    return token;
    
}


module.exports = function(app, express, io) {
    
    var api = express.Router();
    
    
    api.post('/signup', function(req, res) {
        
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });
        
        user.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }
            
            res.json({ message: "User has been created!"});
        });
        
    });
    
    api.get('/users', function(req, res) {
        
        User.find({}, function(err, users) {
            if(err) {
                res.send(err);
                return;
            }
            
            res.json(users);
        });
    });
    
    
    api.post('/login', function(req, res) {
        
        User.findOne({
            username: req.body.username
        }).select('password').exec(function(err, user) {
            
            if(err) throw err;
            
            if(!user) {
                res.send({message: "User doesnt exist"});
            } else if(user) {
                
                var validPassword = user.comparePassword(req.body.password);
                
                if(!validPassword) {
                    res.send({ message: "Invalid Password"});
                } else {
                    
                    var token = createToken(user);
                    
                    res.json({
                        success: true,
                        message: "Login",
                        token: token
                    });
                }
            }
        });
    });
    
    // Middleware
    api.use(function(req, res, next) {
       
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        
        // check if token exist
        if(token) {
            
            jsonwebtoken.verify(token, secretKey, function(err, decoded) {
                
                if(err) {
                    res.status(403).send({ success: false, message: "Failed to authenticate user"});
                } else {
                    
                    req.decoded = decoded;
                    
                    next();
                }
            });
        } else {
            
            res.status(403).send({success: false, message: "No token provided"});
        }
    });
    
    
    api.route('/story')
    
        .post(function(req, res) {
        
            var story = new Story({
                creator: req.decoded.id,
                content: req.body.content
            });
        
            story.save(function(err) {
                if(err) {
                    res.send(err);
                    return;
                }
                
                res.json({message: "New Story Created!"});
            });
        })
        
        .get(function(req, res) {
        
            Story.find({creator: req.decoded.id}, function(err, stories) {
                if(err) {
                    res.send(err);
                    return;
                } 
                
                res.json(stories);
            });
        });
    
    api.route('/list')
    
        .post(function(req, res) {
        
            var list = new List({
                users: req.decoded.id,
                listname: req.body.listname,
            });
            
            list.save(function(err, newList) {
                if(err) {
                    res.send(err);
                }
                
                io.emit('list', newList);
                res.json({message: "New List created"});
            });
        })
    
        .get(function(req, res) {
        
            List.find({users: req.decoded.id}, function(err, lists) {
                if(err) {
                    res.send(err);
                    return;
                }
                
                res.json(lists);
            });
        });
    
    
    api.get('/me', function(req, res) {
       
        res.json(req.decoded);
    });
    
    
    return api;
    
}