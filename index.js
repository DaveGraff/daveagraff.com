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

//Standard error page
app.get('*', (req, res)=>{
	res.render(__dirname + '/views/error.html', {error: 'Page not found'});
});

//Retrieve my resume, requires captcha
app.post('/resume', function(req, res) {
	if(empty(req.body['g-recaptcha-response'])){
  		return res.render(__dirname + '/views/error.html', {error: 'Captcha Error'});
  	}

	const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secrets['SECRET_KEY'] + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

	request(verificationURL,function(error,response,body) {
  		body = JSON.parse(body);

    	if(body.success !== undefined && !body.success)
    		return res.render(__dirname + '/views/error.html', {error: 'Captcha Failed'});

    	res.sendFile(path.join(__dirname + '/dave_graff_resume.pdf'));
    });
});

//Send mail
var mail_requests = {};
app.post('/', function(req, res) {
	var body = req.body;

	//Only email if everything checks out
	if(empty(body['subject']) || empty(body['message']) || empty(body['email']))
		return res.send('All mailing fields must be specified');

	if(!validateEmail(body['email']))
		return res.send('Email not recognized');

	//Get ip address of client
	var ip = req.connection.remoteAddress;
	ip = empty(ip) ? req.headers['x-forwarded-for'] : ip;
	if(empty(ip))
		return res.send('Could not confirm request source');


	//As a small measure against spam, a given IP is limited to 1 email per 5 minutes
	var FIVE_MIN = 5 * 60 * 1000;

	//They haven't tried to email me since the server came up
	if(empty(mail_requests[ip]))
		mail_requests[ip] = new Date();

	//They haven't tried to email me in the last 5 minutes
	else if(new Date() - mail_requests[ip] > FIVE_MIN)
		mail_requests[ip] = new Date();

	//They have sent me an email in the last 5 minutes
	else
		return res.send('Email limit reached. Try again later');


	//Actually send the email

	//Create message
	var mailOptions = {
		from: secrets['SITE_EMAIL'],
		to: `${body['email']}, ${secrets['SITE_EMAIL']}`,
		subject: body['subject'],
		text: body['message']
	};

	//Send email
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    return res.render(__dirname + '/views/error.html', {error: 'All mailing fields must be specified'});
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});

	res.send('Email sent successfully');
});

http.listen(port, () => {
	console.log(`Server running on port ${port}`);
});


//Returns true if datum actually stores data. false otherwise
function empty(datum){
	if(datum == null || datum == undefined || datum == '')
		return true;
	return false;
}

//A nice regex I found to validate an email. Currently will not catch unregistered emails
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}