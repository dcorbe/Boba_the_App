import json
import unittest
from model import connect_to_db, db, BobaShop, User, Rating,
from server import app
import os


class AppRoutesFlask(unittest.TestCase):
    """Tests routes without database connection"""

    def setUp(self):
        """Sets up fake client and sets up test."""
        self.client = app.test_client()
        app.config['TESTING'] = True


    def test_homepage(self):
        """Tests homepage route"""
        result = self.client.get("/")
        self.assertIn(b"Find a", result.data)


if __name__ == "__main__":
    unittest.main()
