const express = require("express");
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const favs = require('./favs.json');
let bodyParser = require('body-parser');
let newTweetID =0;
const {text} = require("express");

app.use(express.static(__dirname));
app.use(bodyParser.json());

//GET all tweets and ids
app.get('/favs', function(req,res){
    res.send({favs: favs});
});

//Given ID GET tweet
app.get('/favs/user/:id', function(req,res){
    res.send({favs: favs});
});

app.post('/favs/user/:id', function (req,res){
    let tweet = req.body.tweet;
    let screenName;
    let id = req.params.id;
    let found = false;
    newTweetID++;

    console.log(id);
    favs.forEach(function (fav, index) {
            if (!found && fav.user.id === Number(id)) {
                screenName = fav.user.screen_name;
            }
        });

    let newTweet = new Object({
        created_at: Date(Date.now()),
        id: newTweetID,
        text: tweet,
        user: {
            id: Number(id),
            screen_name: screenName
        }
    });
    favs.push(newTweet);
    res.send('Successfully created tweet!');
});

app.put('/favs/user/:id', function(req, res){
    let id = req.params.id;
    let newName = req.body.newName;
    let oldName = req.body.oldName;
    let found = false;

    favs.forEach(function(fav, index){
        if(!found && fav.user.screen_name === oldName)
        {
            fav.user.screen_name = newName;
        }
    });
    res.send('Successfully updated screen name!');
});

app.delete('/favs/user/:id', function(req, res) {
    let id = req.params.id;
    let found = false;

    favs.forEach(function(fav, index){
        if(!found && fav.id === Number(id)){
            favs.splice(index,1);
        }
    });
    res.send('Successfully Deleted Tweet')
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));