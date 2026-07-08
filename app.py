from flask import Flask, render_template, url_for, flash, redirect, request
from forms import RegistrationForm
from flask_behind_proxy import FlaskBehindProxy
import git
from flask_sqlalchemy import SQLAlchemy
import requests 
from flask import jsonify 

app = Flask(__name__)
proxied = FlaskBehindProxy(app)
app.config['SECRET_KEY'] = 'c29bcfa698752666def85f68880d22d8'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(20), unique=True, nullable=False)
  email = db.Column(db.String(120), unique=True, nullable=False)
  password = db.Column(db.String(60), nullable=False)

  def __repr__(self):
    return f"User('{self.username}', '{self.email}')"

with app.app_context():
  db.create_all()



@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', subtitle='Home Page', text='This is the home page')

@app.route("/food")
def food():
    return render_template('food.html', subtitle='Food Page', text='This is the food page')

@app.route("/drugs")
def drugs():
    return render_template('drugs.html', subtitle='Drugs Page', text='This is the drugs page')

@app.route("/cosmetics")
def cosmetics():
    return render_template('cosmetics.html', subtitle='Cosmetics Page', text='This is the cosmetics page')

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit(): # checks if entries are valid
        user = User(username=form.username.data, email=form.email.data, password=form.password.data)
        db.session.add(user)
        db.session.commit()
        flash(f'Account created for {form.username.data}!', 'success')
        return redirect(url_for('home')) # if so - send to home page
    return render_template('register.html', title='Register', form=form)

FOOD_URL = "https://api.fda.gov/food/enforcement.json"

#Helper function
def search_food_recalls(query, limit=5):
    resp = requests.get(FOOD_URL, 
    params={
        "search": f'product_description:"{query}"', 
        "limit": limit 
    },
    timeout=8)

    if resp.status_code == 404:
        return []
    
    resp.raise_for_status()
    data = resp.json()

    res = []

    for item in data.get("results", []):
        res.append({
            "food": item.get("product_description", "N/A"),
            "company": item.get("recalling_firm", "N/A"), 
            "reason": item.get("reason_for_recall", "N/A"), 
            "date": item.get("recall_initiation_date", "N/A"),
            "status": item.get("status", "N/A") 
        })
    return res 

@app.route("/api/food/search")
def food_search_api():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({"results": []})
    

    try:
        res = search_food_recalls(query)
    except requests.RequestException:
        return jsonify({"error": "Could not reach FDA API", "results": []}), 500
    
    return jsonify({"results": results})
@app.route("/update_server", methods=['POST'])
def webhook():
    if request.method == 'POST':
        repo = git.Repo('/home/Recaller/Recaller')
        origin = repo.remotes.origin
        origin.pull()
        return 'Updated PythonAnywhere successfully', 200
    else:
        return 'Wrong event type', 400

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")