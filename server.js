const express = require('express');
const app = express();
const port = 3000;
const MongoClient = require('mongoose');
const Simp = require('./models/simp');
var request = require('request');

app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(express.static(__dirname + 'public'))
app.use(express.urlencoded({extended: true}));

var uri = "mongodb+srv://ksrtancio:AdDU2201801263047@mycluster.oy8zf.mongodb.net/SummativeAssessment1?retryWrites=true&w=majority";
MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=> {
        app.listen(port, ()=>{
            console.log(`listening in port ${port}`)
        });
    })
    .catch((err) => {console.log(err)});

app.get('/', function (req, res) {
    res.redirect('/home');
});

app.get('/home', (req, res)=>{
    context={
        title: "Usada Constructions",
        page: "home"
    };
    res.render("index", context);
});

app.get('/create-simp/:timezone', (req, res) =>{
    var people, code;
    switch(req.params.timezone){
        case "Asia-Singapore": people = "Singaporean Simp"; code = "SG";break;
        case "America-Los_Angeles": people = "American Simp"; code = "US";break;
        case "Asia-Tokyo": people = "Japanese Simp"; code = "JP";break;
        case "Europe-Moscow": people = "Muscovite Simp"; code = "RU";break;
        case "Pacific-Fiji": people = "Fijian Simp"; code = "FJ";break;
        default: people = "Humanian"; code="AQ";break;
    }
    context={
        title: "Usada Constructions: Create Simp",
        page: "create-simp",
        timezone: req.params.timezone,
        people: people,
        code: code,
    };
    res.render('create-simp', context);
});

// app.post('/create-simp', (req, res)=>{
//     context={
//         title: "Usada Constructions: Create Simp",
//         page: "create-simp",
//     };
//     res.redirect('/create-simp/' + req.body.timezone.split('/').join('-'));
// })

app.post('/add-simp', (req, res)=>{
    const simp = new Simp({
        name: req.body.simpName,
        nationality: req.body.simpOrigin,
        birthdate: req.body.simpBirthdate
    });
    simp.save()
        .then((result) => {
            var timecode="";
            switch(req.body.simpOrigin){
                case "Singaporean Simp": timecode = "Asia/Singapore"; country="Singapore"; break;
                case "American Simp": timecode = "America/Los_Angeles"; country="Los Angeles";break;
                case "Japanese Simp": timecode = "Asia/Tokyo"; country="Tokyo"; break;
                case "Muscovite Simp": timecode = "Europe/Moscow"; country="Moscow"; break;
                case "Fijian Simp": timecode = "Pacific/Fiji"; country="Fiji"; break;
                default: timecode="AQ"; country="Unknown"; break;
            }
            res.redirect('/simps/' + timecode.split('/').join('-'));
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/simps', (req, res) => {
    res.redirect('/simps/' + req.body.timezone.split('/').join('-'));
});

app.get('/simps/:timezone', (req, res) => {
    var time = "", date = "";
    switch(req.params.timezone){
        case "Asia-Singapore": people = "Singaporean Simp"; code = "SG"; country="Singapore"; break;
        case "America-Los_Angeles": people = "American Simp"; code = "US"; country="Los Angeles";break;
        case "Asia-Tokyo": people = "Japanese Simp"; code = "JP"; country="Tokyo"; break;
        case "Europe-Moscow": people = "Muscovite Simp"; code = "RU"; country="Moscow"; break;
        case "Pacific-Fiji": people = "Fijian Simp"; code = "FJ"; country="Fiji"; break;
        default: people = "Humanian"; code="AQ"; country="Unknown"; break;
    }
    Simp.find()
        .then((result) => {
            request('http://worldtimeapi.org/api/timezone/' + req.params.timezone.split('-').join('/') , (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    date = JSON.parse(body).datetime.substring(0,9);
                    time = JSON.parse(body).datetime.substring(11,19);
                    var context = {
                        title: "Usada Constructions: Simps",
                        timecode: req.params.timezone,
                        page: "simps",
                        people: people,
                        code: code,
                        country: country,
                        date: date,
                        time: time, 
                        simps: result != null ? result : {},
                    }
                    res.render('simps', context)
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/view-simp/:id', (req, res) => {
    var id = req.params.id;
    var people, code, country;
    Simp.findById(id)
        .then((result) => {
            switch(result.nationality){
                case "Singaporean Simp": code = "SG"; country="Singapore"; break;
                case "American Simp": code = "US"; country="Los Angeles";break;
                case "Japanese Simp": code = "JP"; country="Tokyo"; break;
                case "Muscovite Simp": code = "RU"; country="Moscow"; break;
                case "Fijian Simp": code = "FJ"; country="Fiji"; break;
                default: code="AQ"; country="Unknown"; break;
            }
            context={
                title: "Usada Constructions: View Simp",
                page: "view-simp",
                name: result.name,
                code: code,
                origin: result.nationality,
                birthdate: result.birthdate,
            };
            res.render('view-simp', context);
        })
        .catch((err) => {
            console.log(err)
        })

});
 
app.use((req, res)=>{
    const context = {
        title: '404: Page not found',
        page: "404",
    };
    res.render('404', context);
});
