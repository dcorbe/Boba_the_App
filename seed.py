from sqlalchemy import func
from model import (
	BobaShop
)
from model import connect_to_db, db
from server import app
from datetime import datetime


def load_boba_shops():
	"""Load movies from u.item into database."""
	print("BobaShops")

	BobaShop.query.delete()

	for row in open("seed_data/boba_shops.txt"):
		row = row.rstrip()
		shop_id, title, address, latitude, longitude, place_id = row.split("|")[0:6]

		title = title.rstrip()

		boba_shop = BobaShop(
			shop_id=shop_id,
			title=title,
			address=address,
			latitude=latitude,
			longitude=longitude,
			place_id=place_id
		)

		db.session.add(boba_shop)
		db.session.commit()


def set_val_boba_shop_id():
	"""Set value for the next shop_id after seeding database"""
	# Get the Max movie_id in the database
	result = db.session.query(func.max(BobaShop.shop_id)).one()
	max_id = int(result[0])

	# Set the value for the next shop_id to be max_id + 1
	query = "SELECT setval('bobashops_shop_id_seq', :new_id)"
	db.session.execute(query, {'new_id': max_id + 1})
	db.session.commit()


if __name__ == "__main__":
	connect_to_db(app)

	# In case tables haven't been created, create them
	db.create_all()

	# Import different types of data
	load_boba_shops()
	set_val_boba_shop_id()
