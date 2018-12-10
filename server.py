import googlemaps
import os
import json
from flask import Flask, render_template, redirect, request, flash, session
from flask_debugtoolbar import DebugToolbarExtension
from jinja2 import StrictUndefined
from pprint import pformat
from sqlalchemy.sql import func, exists

from model import User, Rating, BobaShop, connect_to_db, db


key = os.getenv("GOOGLE_PLACES_KEY")
app = Flask(__name__)
app.secret_key = "wiggles"
app.jinja_env.undefined = StrictUndefined


def get_state(session):
	return {
		'loggedIn': bool(session.get('logged_in_user')),
	}


@app.route('/')
def index():
	"""Landing Page"""
	#must do the following steps for each route to export var logged_in
	return render_template("homepage.html")


@app.route("/boba-map")
def find_bobashops():
	"""Search for Boba Shops from Google Places nearbysearch & display list of shops"""
	return render_template("boba_map.html",
						   state=get_state(session),
						   key=os.getenv("GOOGLE_PLACES_KEY"))


@app.route('/about-boba')
def render_about_me():
	"""An about me page"""
	return render_template("about.html")


@app.route("/sign-up", methods=["GET", "POST"])
def register_process():
	"""Registration form and process"""
	if request.method == "GET":
		return render_template("registration_form.html")


	email = request.form.get("email")
	password = request.form.get("password")

	if User.query.filter(User.email == email).first():
		flash('An account with that email already exists!')
		#import pdb; pdb.set_trace()
		return render_template("registration_form.html")

	#good place to add password encryption because this
	#checks that the account doesn't already exist.
	user = User(email=email, password=password)
	db.session.add(user)
	db.session.commit()

	session["logged_in_user"] = user.user_id

	flash('Success! You made an account')
	return redirect("/boba-map")


@app.route("/login", methods=["GET", "POST"])
def login():
	"""Log in."""
	if request.method == "GET":
		return render_template("login.html")

	else:
		email = request.form.get("email")
		password = request.form.get("password")

		q = User.query
		if q.filter((User.email == email), (User.password == password)).first():
			session["logged_in_user"] = q.filter(User.email == email).one().user_id
			flash("Logged in!")
			return redirect("/boba-map")
		else:
			flash("The e-mail or password is incorrect.")
			return render_template("login.html")


@app.route("/logout")
def logout():
	"""log out"""
	print("checking whatever", session.get("logged_in_user"))
	del session["logged_in_user"]
	flash("you're logged out")
	return redirect("/")


@app.route("/boba-shop-ratings/<title>/<place_id>/<address>", methods=["GET", "POST"])
def process_rating(title, place_id, address):
	print(session)
	new_score = (request.form.get("input_rating"))
	print('score: ', new_score)

	# checks if user is logged in, and if not flashes and redirects
	if not session.get("logged_in_user"):
		flash("You're not logged in!")
		return redirect("/")

	user_id = session["logged_in_user"]
	boba_shop = BobaShop.query.filter(BobaShop.place_id==place_id).first()

	# Handle GET's and POST's
	if request.method == "GET":
		# AVG rating starts at 0 for now, can fix this later!
		avg_rating = (db.session
					  .query(func.avg(Rating.score))
					  .filter(Rating.boba_shop_id==boba_shop.shop_id)
					  .scalar()) or 0

		return render_template(
			"rate_shop.html",
			title=title,
			place_id=place_id,
			address=address,
			avg_rating=f"{avg_rating:0.1f}", #format float to one demcimal place
			state=get_state(session),
		)
	else:
		rating = Rating.query.filter(
			Rating.user_id==user_id,
			Rating.boba_shop_id==boba_shop.shop_id
		).first()

		print('got existing: ', rating)
		print('got boba shop: ', boba_shop)

		if rating:
			# If rating exists, update the score.
			rating.score = new_score
			flash("Your rating has been updated!")
		else:
			# If rating does not exist, create a new one.
			rating = Rating(boba_shop_id=boba_shop.shop_id,
							user_id=user_id, score=new_score)
			flash("Woot")

		db.session.add(rating)
		db.session.commit()
		return redirect("/boba-map")


if __name__ == "__main__":
	# We have to set debug=True here, since it has to be True at the
	# point that we invoke the DebugToolbarExtension
	app.debug = True
	# make sure templates, etc. are not cached in debug mode
	app.jinja_env.auto_reload = app.debug

	connect_to_db(app)

	# Use the DebugToolbar
	DebugToolbarExtension(app)
	app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

	app.run(port=5000, host='0.0.0.0')
