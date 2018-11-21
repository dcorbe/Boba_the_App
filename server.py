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
    """Homepage."""
    return render_template("homepage.html")


@app.route("/boba-map")
def find_bobashops():
    """Search for Boba Shops from Google Places nearbysearch & display list of shops"""

 #for now will just render map of current location
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

			flash("Logged in!")
			return redirect("/")
		else:
			flash("The e-mail or password is incorrect.")



#delete this route if it doesn't work
@app.route("/boba-shop-ratings", methods=["POST"])
def process_rating():
	new_score = int(request.form.get("input_rating"))
	placeId = int(request.form.get("placeId"))

	if session["logged_in_user"]:
		user_id = session["logged_in_user"]

		if Rating.query.filter(Rating.user_id==user_id, Rating.movie_id==movie_id).first():
			user = Rating.query.filter(Rating.user_id==user_id, Rating.movie_id==movie_id).first()
			user.score = new_score

			flash("Your rating has been updated!")

		else:
			user = Rating(shop_id=shop_id, user_id=user_id, score=new_score)
			flash("Woot")

		db.session.add(user) # does this update or add new row?
		db.session.commit()

		return redirect(f"/movies/{movie_id}")


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
