# travel-app
This is an app where one can enter travel information. The app expects a city name and a departure date. This will also request a return date. Using this information, it will then go to the Geonomes API, where it will get the country name as well as the longitude and latitude. Then it will go to weatherbit and get the historical data for the weather in that area. Finally, it will go to Pixabay and get an image from that place.

# Technologies used
Basically, Node.js, Express, Webpack, Babel, Service Workers, Jest.

# Requirements to start this app
Since this app calls three different APIs, it is necessary to obtain API keys for Geonomes, Weatherbit and Pixabay. These keys should be stored in an .env file. The command to start in NPM start


