
/* Global Variables */
console.log("app.js is being called")



// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

document.getElementById("generate").addEventListener('click',getInformation);

async function getInformation(e){
  
    const city = document.getElementById('city').value;
    console.log(city)
    const departure = document.getElementById('departure').value;
    console.log(departure)
    
    let departure_date = new Date(departure)
    let start_month = departure.slice(5,7) 
  
    let start_day = departure.slice(8,10);
 
    let end_day = parseInt(departure.slice(8,10)) + 1
    if (end_day < 9) end_day = "0" + end_day.toString();
    let start_date = d.getFullYear() - 1 + '-' + start_month + '-' + start_day
    let end_date = d.getFullYear() - 1 + '-' + start_month + '-' + end_day

    let getCoordResponse = await getLatLong(`http://localhost:8000/getcoord/${city}`)
    getCoordResponse['departure'] = departure
    getCoordResponse['city'] = city

    let lat = getCoordResponse['latitude']
    let lon = getCoordResponse['longitude']

    let getTemperatures = await getMaxMinTemp(`http://localhost:8000/getweather/${lat}/${lon}/${start_date}/${end_date}`)

    getCoordResponse['max_temp'] = convertCToFTemp(getTemperatures['max_temp'])
    getCoordResponse['min_temp'] = convertCToFTemp(getTemperatures['min_temp'])

    let mycity = getCoordResponse['city']

    let country = getCoordResponse['country']

    let getImage = await getImageURL(`http://localhost:8000/getimage/${mycity}/${country}`)
    console.log("getImageURL: ", getImage)
    getCoordResponse['img_url'] = getImage['image_URL']

    console.log("getCoordResponse: ",getCoordResponse)
    postData("http://localhost:8000/addData",getCoordResponse);
    updateUI();
}

function convertKtoFTemp(kelvin){
    let fahrenheit =  (kelvin * 9/5) - 459.67 ;
    return fahrenheit;
  }

function convertCToFTemp(centigrades){
    let fahrenheit =  (centigrades * 9/5) + 32;
    return fahrenheit;
}
const getLatLong = async ( url = '', data = {})=>{
    const response = await fetch(url);
    try {
      const newData = await response.json();
      return newData
    }catch(error) {
    console.log("error", error);
    // appropriately handle the error
    }
}

const getMaxMinTemp = async ( url = '', data = {})=>{
    const response = await fetch(url);
    try {
      const newData = await response.json();
      return newData
    }catch(error) {
    console.log("error", error);
    // appropriately handle the error
    }
}

const getImageURL = async ( url = '', data = {})=>{
  const response = await fetch(url);
  try {
    const newData = await response.json();
    return newData
  }catch(error) {
  console.log("error", error);
  // appropriately handle the error
  }
}

const postData = async ( url = '', data = {})=>{
    const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
  });
    try {
      const newData = await response.json();
      return newData
    }catch(error) {
    console.log("error", error);
   
    }
}


  const updateUI = async() => {
      try {
          const request = await fetch('http://localhost:8000/all');
           const allData = await request.json();
           console.log("allData:",allData)
           createCards(allData)
           return allData
            }
      catch(error){
          console.log("error: ", error)
      }
  }

  function createCards(allData)
    { 
        const myCardHolder = document.getElementById('entryHolder')
        allData.forEach((result, idx) => {
            // Create card element
            const card = document.createElement('div');
            card.classList = 'card-body';
          
            // Construct card content
            const content = `
              <div class="card">
              <div class="card-header" id="heading-${idx}">
                <h5 class="mb-0">
                  <button class="btn btn-link" data-toggle="collapse" data-target="#collapse-${idx}" aria-expanded="true" aria-controls="collapse-${idx}">
          
                          </button>
                </h5>
              </div>
          
              <div id="collapse-${idx}" class="collapse show" aria-labelledby="heading-${idx}" data-parent="#accordion">
                <div class="card-body">
                  <img src=${result.img_url} alt= ${result.city}>
                  <h5>My trip to: ${result.city}, ${result.country}</h5>
                  <p>Departing: ${result.departure}</p>
                  <p>Typical weather for then is:</p>
                  <p>High: ${result.max_temp}, Low: ${result.min_temp}</p>
                  
                </div>
              </div>
            </div>
            `;
          
            // Append newyly created card element to the container
            myCardHolder.innerHTML += content;
          })

        
    };
        /* <div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
  <div class="card-body">
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>       */

