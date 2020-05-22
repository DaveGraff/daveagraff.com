const express = require('express');	//Instantiate application w/ Express (common node app)
const app = express();

const http = require('http').Server(app);
const port = process.env.PORT || 8080;
const path = require('path');

const fs = require('fs');

// Get captcha info
let secrets = fs.readFileSync('secrets.json');
secrets = JSON.parse(secrets);

var bodyParser = require('body-parser');
request = require('request');
// var Recaptcha = require('express-recaptcha').RecaptchaV3;
// var recaptcha = new Recaptcha(secrets['SITE_KEY'], secrets['SECRET_KEY']);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
//Serve html files
// var engine = require('consolidate');

app.use('/views', express.static(__dirname + '/views'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/resources', express.static(__dirname + '/resources'));

// app.engine('html', engine.mustache);
// app.set('view engine', 'html');

//Main page
app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname + '/views/index.html'));
  // res.render('login', { captcha:recaptcha.render() });
});


// //Page to download resume
// app.get('/resume',  (req, res) =>{
// 	res.sendFile(path.join(__dirname + '/views/resume.html'));
// });

//Page to display SBU courses
app.get('/courses',  (req, res) =>{
	res.sendFile(path.join(__dirname + '/views/courses.html'));
});

app.get('*', (req, res)=>{
	res.render(__dirname + '/views/error.html', {error: 'Page not found'});
});


app.post('/resume', function(req, res) {
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
  {
    return res.render(__dirname + '/views/error.html', {error: 'Captcha Error'});
  }

  console.log(res.req.res.req.body);

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secrets['SECRET_KEY'] + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL,function(error,response,body) {
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      return res.render(__dirname + '/views/error.html', {error: 'Captcha Failed'});
    }
    // res.json({"responseSuccess" : "Sucess"});
    // res.end('It worked!');
    res.sendFile(path.join(__dirname + '/resources/dave_graff_resume.pdf'));
    // res.redirect('back');
  });
});

http.listen(port, () => {
	console.log(`Server running on port ${port}`);
});