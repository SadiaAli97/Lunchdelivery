var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/dishesdb");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var  LocalStrategy=require("passport-local");
var MongoStore = require("connect-mongo")(session);
//var flash = require('express-flash-notification');
var cookieParser = require('cookie-parser');
var User=require("./models/user"); 
var account=require("./models/account"); 
var expenses=require("./models/expenses"); 
var income=require("./models/income"); 
var  saving=require("./models/saving"); 
var msg=require("./models/message");



app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies\
app.use(cookieParser());
//app.use(flash(app));
app.use(session({secret:"mysupersecret",
     resave: false,
     saveUninitialised: false,
     store: new MongoStore({mongooseConnection: mongoose.connection}),
     cookie: {maxAge:180*60*1000}
    
}));
//app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//user authenticate is already availabe coz of passport local mongoose in user.js we neednt write the whole code
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.login=req.isAuthenticated();
    res.locals.session=req.session;
    next();
});

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.session=req.session;
    next();
});


app.post("/register",function(req,res){
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        g:req.body.g,
        group:req.body.group

    });
    if(req.body.g=="Admin"){
        User.find({g:"Admin"},function(err,admins){
            console.log(admins.length);
            if(admins.length){
                User.find({group:req.body.group},function(err,results){
                    if(results.length){
                    console.log(results)
                    console.log("Admin exists")
                    res.render("register2")
                    }
                    else{
                        
        User.register(newUser, req.body.password,function(err,user){//only create object for username not for password as only to store username in database
        if(err){
       console.log(err);
       console.log("hello");
       return res.render("register");
    }
    console.log(user);
       passport.authenticate("local")(req,res,function(){
           res.redirect("/login2");
       
                        
                    })
                })
            }
            
                })
            
            }
        })
        }
    else{
  
   User.register(newUser, req.body.password,function(err,user){//only create object for username not for password as only to store username in database
   if(err){
       console.log(err);
       console.log("hello");
       return res.render("register");
    }
    console.log(user);
       passport.authenticate("local")(req,res,function(){
       
           res.render("login");
      
       });
   });
    }
});

app.get("/homepage",function(req,res){
    res.render("homepage")
})
app.get("/homepage2",function(req,res){
    res.render("homepage2")
})
app.post("/login",passport.authenticate("local",{
    failureRedirect: "/login"
}),function(req,res,next){
    if(req.session.oldUrl){
       var oldUrl=req.session.oldUrl;
        req.session.oldUrl=null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect("homepage");
    }
});
app.post("/login2",passport.authenticate("local",{
    failureRedirect: "/login"
}),function(req,res,next){
    if(req.session.oldUrl){
       var oldUrl=req.session.oldUrl;
        req.session.oldUrl=null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect("homepage2");
    }
});

app.get("/profile",function(req,res){
  res.render("user",{
      currentUser:req.user});
});
app.get("/", function(req,res){
    
    res.render("first")
})

app.get("/login", function(req,res){
    
    res.render("login")
})



app.get("/register", function(req,res){
    
    res.render("register")
})
app.get("/register2", function(req,res){
    
    res.render("register2")
})

app.get("/login2", function(req,res){
    
    res.render("login2")
})
app.get("/account",function(req,res){
    res.render("account")
});

app.get("/saving",function(req,res){
    res.render("saving")
});
app.get("/expenses",function(req,res){
    res.render("expenses")
});
app.get("/income",function(req,res){
    res.render("income")
});

app.post("/account",function(req,res){
    
    var user=req.user;
    var ac_num = req.body.ac_num;
    var bank_name = req.body.bank_name;
    var ac_type = req.body.ac_type;
    var ifsc=req.body.ifsc;
    var br_name=req.body.br_name;
    var newacc = {user:user,ac_num: ac_num, bank_name: bank_name, ac_type: ac_type,ifsc:ifsc,br_name:br_name}
    account.create(newacc, function(err, newlycreated){
        if(err){
            console.log(err);
        } 
        else{
            console.log(newlycreated)
            res.render("account")
        }
    });
});

app.post("/saving",function(req,res){
    
    var user=req.user;
    var s_amount = req.body.s_amount;
    var s_date= req.body.s_date;
    var s_type = req.body.s_type;
    var newsvg = {user:user,s_amount: s_amount, s_date: s_date, s_type: s_type}
    saving.create(newsvg, function(err, newlycreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlycreated)
            res.redirect("/saving")
        }
    });
});

app.post("/expenses",function(req,res){
    
    var user=req.user;
    var e_amount = req.body.e_amount;
    var e_date= req.body.e_date;
    var e_type = req.body.e_type;
    var e_desc = req.body.e_desc;
    var newexp = {user:user,e_amount: e_amount, e_date: e_date, e_type: e_type, e_desc: e_desc}
    expenses.create(newexp, function(err, newlycreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlycreated)
            res.redirect("/expenses")
        }
    });
});

app.post("/income",function(req,res){
    
    var user=req.user;
    var amount = req.body.amount;
    var date= req.body.date;
    var sources = req.body.sources;
    var newicm = {user:user,amount: amount, date: date, sources: sources}
    income.create(newicm, function(err, newlycreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlycreated)
            res.redirect("/income")
        }
    });
});



app.get("/details",function(req,res){
    account.find({user:req.user},function(err,result1){
        saving.find({user:req.user},function(err,result2){
            income.find({user:req.user},function(err,result3){
                expenses.find({user:req.user},function(err,result4){
                     res.render("details",{acc:result1,svg:result2,icm:result3,exp:result4})
        })
            
        })
            
        })
        
    })
})
app.get("/userreq",function(req,res){
        msg.find({user:req.user},function(err,results){
            res.render("userreq",{msg:results});
        })
  
});
app.post("/messages",function(req,res){
    var user=req.user;
    var un=user.username;
     var name = req.body.name;
    var message= req.body.message;
    var response=" "
    var newmsg= {user:user,un:un,name: name, message: message,response:response}
   
    msg.create(newmsg, function(err, newlycreated){
        if(err){
            console.log(err);
        } else {
             msg.find({user:req.user},function(err,results){
            res.render("userreq",{msg:results});
        })
        
   
       
 
           
        }
    
   
})
})

app.get("/groups",function(req,res){
    var grp=req.user.group;
    User.find({group:grp},function(err,results){
        res.render("groups",{usr:results})
    })
})
app.get("/requests",function(req,res){
    var grp=req.user.group;
    User.find({group:grp},function(err,results){
        msg.find({user:results},function(err,msgs){
        console.log(msgs)
        res.render("requests",{msg:msgs});
        
    })
       
    })
})
app.post("/responses",function(req, res) {
    var un=req.body.name;
    msg.update({un:un},{response:req.body.a},function(err,results){
        console.log(results)
    })
})
app.get("/logout",function(req,res){
     req.logout();
    res.redirect("/");
})


app.get("/chart",function(req,res,next){
    var ssum=0
var sum=0
    var svgs1=new Array()
    var exps12=new Array()
   saving.find({user:req.user},"s_amount",function(err,results){
    for(var i=0;i<results.length;i++){
              /*var etee=JSON.stringify(results[i]).split(":")[2]
        var ete = etee.substring(1,(etee.length-2)).toString();
        */
        var tmp1=JSON.stringify(results[i]).split(":")[2];
        var tmp2=tmp1.substring(0,(tmp1.length-1))
        svgs1.push(parseInt(tmp2))
       
        
        //exps1.push(ete);
    }
   
    for( var i=0;i<svgs1.length;i++){
        ssum=parseInt(ssum+svgs1[i])
    }
    
     expenses.find({user:req.user},"e_amount",function(err,results){
    for(var i=0;i<results.length;i++){
              /*var etee=JSON.stringify(results[i]).split(":")[2]
        var ete = etee.substring(1,(etee.length-2)).toString();
        */
        var tmp1=JSON.stringify(results[i]).split(":")[2];
        var tmp2=tmp1.substring(0,(tmp1.length-1))
        exps12.push(parseInt(tmp2))
        
        
        //exps1.push(ete);
    }
   
    for( var i=0;i<exps12.length;i++){
        sum=parseInt(sum+exps12[i])
    }
    

    
    console.log(sum)
    console.log(ssum)

    res.render("chart",{sum1:sum,sum2:ssum})
     })
})

    })
app.get("/delmsg",function(req,res){
    var u=req.user;
    var un=u.username;
    console.log("username is")
    console.log(un)
        msg.findOneAndRemove({un:un}, function(err,data){
        console.log("deleted")
        console.log(data)
    if(!err){
        console.log("Deleted");
    }
    res.redirect("userreq");
    
})
})
   
    
   
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Money Manager Server Has Started!");
});



/*req.body.use=req.user;

msg._ida

    var responses = {user:user,response:resp}
    msg.create(responses, function(err, newlycreated){
        if(err){
            console.log(err);
        } 
        else{
            console.log(newlycreated)
User            
    console.log(grp)
     User.find({group:grp},function(err, newusers) {
 msg.finduser:newusers},function(err,msgs){
        console.log(msgs)
        res.render("requests",{msg:msgs});
        
    })
            
            res.render("requests",{})
  })
    });*/
