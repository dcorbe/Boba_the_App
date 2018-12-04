from jinja2 import StrictUndefined

from flask import Flask, render_template, redirect, request, flash, session
from flask_debugtoolbar import DebugToolbarExtension

from model import User, Rating, BobaShop, connect_to_db, db

import googlemaps

from pprint import pformat
import os
import json

key = os.getenv("GOOGLE_PLACES_KEY")


app = Flask(__name__)


app.secret_key = "wiggles"

app.jinja_env.undefined = StrictUndefined


@app.route('/')
def index():
	"""Landing Page"""
	#must do the following steps for each route to export var logged_in
	return render_template("homepage.html")


@app.route("/boba-map")
def find_bobashops():
	"""Search for Boba Shops from Google Places nearbysearch & display list of shops"""
	return render_template("boba_map.html", key=os.getenv("GOOGLE_PLACES_KEY"))


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

#good place to add password encryption because this checks that the account doesn't already exist
	user = User(email=email, password=password)
	db.session.add(user)
	db.session.commit()
	flash('Success! You made an account')
	return redirect("/login")


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
			logged_in = True
			flash("Logged in!")
			return redirect("/")
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

@app.route("/change-state")
def change_login_logout_btn(value):
	"""toggles button between login and logout"""
	print("printing", value)



@app.route("/boba-shop-ratings/<title>/<place_id>/<address>", methods=["GET", "POST"])
def process_rating(title, place_id, address):
	print(session)
	# logged_in = bool(session.get("logged_in_user"))
	new_score = (request.form.get("input_rating"))
	shop_id = (request.form.get("shop_id"))

	if session.get("logged_in_user"):
	# if session["logged_in_user"]:
		user_id = session["logged_in_user"]
		return render_template("rate_shop.html", title=title, place_id=place_id, address=address)


		if Rating.query.filter(Rating.user_id==user_id, Rating.shop_id==shop_id).first():
			user = Rating.query.filter(Rating.user_id==user_id, Rating.shop_id==shop_id).first()
			user.score = new_score

			flash("Your rating has been updated!")
			return redirect("/")

		else:
			user = Rating(shop_id=shop_id, user_id=user_id, score=new_score)
			flash("Woot")

		db.session.add(user) # does this update or add new row?
		db.session.commit()

		return redirect("/")

	else:

		flash("You're not logged in!")
		return redirect("/")




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
