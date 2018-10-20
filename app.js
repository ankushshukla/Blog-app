var express= require("express");
var app= express();
var bodyParser=require("body-parser");
var mongoose =require("mongoose");
var methodOverride=require("method-override")
var expressSanitizer = require("express-sanitizer");
//APP  CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: "placeholderimage.jpg"},
    body: String,
    created: {type: Date, default : Date.now}
})

var Blog= mongoose.model("Blog",blogSchema);

/*Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1523219523901-777f085fcb08?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=95b3ef786aabac0b2157a6944f04bf10&auto=format&fit=crop&w=1534&q=80",
    body: "HELLO THIS IS A BLOG POST!",
    
});*/


//RESTFUL ROUTES
app.get("/", function(req,res){
    res.redirect("/blogs");
})

//INDEX ROUTE
app.get("/blogs", function(req,res){
 
    Blog.find({}, function(err, blogs){
       if(err){
           console.log(err);
       } 
       else{
           res.render("index", {blogs: blogs}); 
       }
    })
})


//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
})

//CREATE Route
app.post("/blogs",function(req,res){
    // CREATE BLOG
    req.body.blog.body=req.sanitize(req.body.blog.body) //It is used for making the ue of script tag in our form prohibited
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            //then, redirect to the index
            res.redirect("/blogs");
        }
    })
})

//SHOW ROUTE

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog: foundBlog});
        }
    })
})


//UPDATE ROUTE

app.put("/blogs/:id", function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.redirect("/blogs");
       }
    })
})





























app.listen(1234,()=> {
    console.log("The YelpCamp has Started!!!");
    
})