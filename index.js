const express = require('express');	//Instantiate application w/ Express (common node app)
const app = express();

const http = require('http').Server(app);
const port = process.env.PORT || 8080;
const path = require('path');


//Serve html files
app.use('/pages', express.static(__dirname + '/pages'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/resources', express.static(__dirname + '/resources'));

app.get('/',  (req, res) =>{
  res.sendFile(path.join(__dirname + '/pages/main.html'));
});

http.listen(port, () => {
	console.log(`Server running on port ${port}`);
});