const regeneratorRuntime = require("regenerator-runtime");
// Setup empty JS object to act as endpoint for all routes
let projectData = {};
const data = [];
require('dotenv').config()
// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Dependencies */
const bodyParser = require('body-parser');
/* Middleware*/

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'));




// Setup Server

const port = 8000;

const server = app.listen(port,listening);

function listening(){
    console.log("server running...");
    console.log(`running on local host: ${port}`)
}
const axios = require('axios');

app.get('/all', async (req, res)=>{
    res.send(data);
})


// This endpoint is for the call to Geonames API. Out of the response, we extract
// latitude, longitude and country name 

app.get('/getcoord/:place',
async (req, res)=>{
    try {
    let city = req.params.place
    const response = await axios.get(`http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${process.env.USER_NAME}`);
    const responseData = {};
 
    responseData['latitude'] = response.data.geonames[0].lat
    responseData['longitude'] = response.data.geonames[0].lng
    responseData['country'] =  response.data.geonames[0].countryName
    console.log("latitude", response.data.geonames[0].lat)
    console.log("longitude", response.data.geonames[0].lng)
    console.log("country", response.data.geonames[0].countryName)
    console.log("response.data.geonames[0]", response.data.geonames[0])
    res.send(responseData)
    }
    catch(error){
        console.log("error: ", error)
    }
}
);

// This endpoint obtains weather information from weatherbit
// It requires latitude, longitude start_date and end_date 

app.get('/getweather/:lat/:lon/:start_date/:end_date',
async (req, res)=>{
    try {
    let latitude = req.params.lat
    let longitude = req.params.lon
    let start_date = req.params.start_date
    let end_date = req.params.end_date 
    const response = await axios.get(`http://api.weatherbit.io/v2.0/history/daily?lat=${latitude}&lon=${longitude}&start_date=${start_date}&end_date=${end_date}&key=${process.env.WEATHERBIT_API_KEY}`);
    console.log(response.data.data)
    const responseData = {};
 
    responseData['max_temp'] = response.data.data[0].max_temp
    responseData['min_temp'] = response.data.data[0].min_temp

    res.send(responseData)
    }
    catch(error){
        console.log("error: ", error)
    }
}
);

// This call to pixabay will return an array of images for the city and country selected as travel destination
app.get('/getimage/:city/:country',
async (req, res)=>{
    try {
    let city = req.params.city
    let country = req.params.country
    const response = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${city}+${country}&image_type=photo`);
    console.log(response.data.hits)
    const responseData = {};
 
    responseData['image_URL'] = response.data.hits[0].webformatURL
    
    res.send(responseData)
    }
    catch(error){
        console.log("error: ", error)
    }
}
);

// This will log the information in an array

app.post('/addData',(req, res) => {
    projectData = {
       city: req.body.city,
       country: req.body.country,
       departure: req.body.departure,
       return_date: req.body.return_date,
       latitude: req.body.latitude,
       longitude: req.body.longitude,
       max_temp: req.body.max_temp,
       min_temp: req.body.min_temp,
       img_url: req.body.img_url
    }
    res.send(projectData)
    data.push(projectData);
})

app.get('/', (req,res)=> res.status(200).json({ message: "Capstone Project"}));

module.exports = app

