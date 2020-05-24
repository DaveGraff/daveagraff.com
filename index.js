const express = require('express');	//Instantiate application w/ Express (common node app)
const app = express();

const http = require('http').Server(app);
const port = process.env.PORT || 8080;
const path = require('path');

// Get captcha info
const fs = require('fs');
let secrets = fs.readFileSync('secrets.json');
secrets = JSON.parse(secrets);

var bodyParser = require('body-parser');
request = require('request');


var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: secrets['SITE_EMAIL'],
    pass: secrets['EMAIL_PASSWORD']
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);


app.use('/views', express.static(__dirname + '/views'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/resources', express.static(__dirname + '/resources'));

//Main page
app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname + '/views/index.html'));
});


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


    res.sendFile(path.join(__dirname + '/dave_graff_resume.pdf'));
  });
});

app.post('/', function(req, res) {
	var body = res.req.res.req.body;

	if(empty(body['subject']) || empty(body['message']) || empty(body['email'])){
		return res.render(__dirname + '/views/error.html', {error: 'All mailing fields must be specified'});
	}

	if(!validateEmail(body['email']))
		return res.render(__dirname + '/views/error.html', {error: 'Email not recognized'});

	var mailOptions = {
		from: secrets['SITE_EMAIL'],
		to: `${body['email']}, ${secrets['PERSONAL_EMAIL']}`,
		subject: body['subject'],
		text: body['message']
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    return res.render(__dirname + '/views/error.html', {error: 'All mailing fields must be specified'});
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});

  	res.sendFile(path.join(__dirname + '/views/index.html'));
});

http.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

function empty(datum){
	if(datum == null || datum == undefined || datum == '')
		return true;
	return false;
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}