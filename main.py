from flask import Flask, render_template, url_for
from bs4 import BeautifulSoup
from flask_recaptcha import ReCaptcha
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'somesecretkey'

app.config.update(dict(
    RECAPTCHA_ENABLED = True,
    RECAPTCHA_SITE_KEY = "somekey",
    RECAPTCHA_SECRET_KEY = "somesecretkey",
))

recaptcha = ReCaptcha()
recaptcha.init_app(app)

@app.route('/', methods=['GET', 'POST'])
@app.route('/home')
def home():
	return render_template('home.html')

@app.route('/about')
def about():
	return render_template('about.html')

@app.route('/courses')
def courses():
	return render_template('courses.html')

@app.route('/projects')
def projects():
	return render_template('projects.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
	return render_template('contact.html')

@app.route('/contact/response', methods=['GET' ,'POST'])
def response():
	if recaptcha.verify():
		return render_template('contact_response.html', response='You can reach me via email at daveagraff@gmail.com')
	else:
		return render_template('contact_response.html', response='No email for you, bot!')

@app.route('/ufaq')
def ufaq():
	return render_template('ufaq.html')

@app.route('/ufaq/oldwebsite')
def oldwebsite():
	return render_template('old.html')

@app.errorhandler(Exception)
def handle_error(error):
	return render_template('error.html', error=error)


if __name__ == '__main__':
    app.run()
