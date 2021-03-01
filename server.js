const express = require('express');
const got = require('got');
const app = express();
const port = 3000;
const weather = require('weather-js');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(port, ()=>{
    console.log(`listening in port ${port}`)
});


app.get('/home', (req, res)=>{
    var context;
    weather.find({search: 'Davao City, PH', degreeType: 'C'}, function(err, result) {
        if(err){
            console.log(err);
            context = {
                title : 'Weather Application',
                data : "Error",
                page: "home",
            };
            res.render('index', context);
        }else{
            // console.log(result);
            context = {
                title : 'Weather Application',
                data : result,
                page: "home",
            };
            res.render('index', context);
        }
    });
    console.log('REDNERING HOMEPAGE');
});

app.get('/other', (req, res)=>{
    
    (async () => {
        var myAffirmation;
        var context;
        try {
            const response = await got('https://www.affirmations.dev/');
            myAffirmation = JSON.parse(response.body);
            console.log(JSON.parse(response.body));
            context={
                title: "Weather Application: Other",
                page: "other",
                affirmation: myAffirmation,
            };
            res.render('other', context);
        } catch (error) {
            console.log(error.response.body);
            //=> 'Internal server error ...'
        }
    })();

    
    
    console.log('REDNERING OTHER');
});

app.get('/', function (req, res) {
    res.redirect('/home');
});
 
app.use((req, res)=>{
    const context = {
        title: '404: Page not found',
        page: "404",
    };
    res.render('404', context);
});
