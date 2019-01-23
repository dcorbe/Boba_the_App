![alt text](/static/imgs/boba_logo.png)

***

# Boba, The App.

**Boba the App** is a web application that helps [Boba](https://en.wikipedia.org/wiki/Bubble_tea) lovers
locate cafes that serve boba. Users can use the geolocation feature to find boba stores near them, or they can manually input a city or zipcode. Users can also sign up for an account to contribute ratings to the "Boba" community by rating different shops.


# Tech stack

* Python (Flask, Jinja)
* Javascript (Jquery, ReactJS)
* HTML/CSS
* Bootstrap
* PostgreSQL
* SQLAlchemy
* Google Maps API (Nearby Search, Places)


# How to use
When you first arrive at the landing page, you can enter the website by scrolling down. A parallax scroll uses javascript to turn the page into a milk-tea colored background and the user is asked if they're "down to boba".

![alt text](/static/gifs/boba_intro.gif)

When you click the link you enter the website and the browser prompts you for permission to access your location. If the user grants access an API call is made to Google Maps and a map is rendered using javascript with clickable custom icons.

![alt text](/static/gifs/geolocate.gif)

### Make an account

## License
[MIT](https://choosealicense.com/license/mit/)
