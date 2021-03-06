// This app interacts with the index.html and takes the information to do all the processing
// getInformation is the main function and calls 3 API and gathers the information and saves it

async function getInformation(e){
    event.preventDefault()
  
    const city = document.getElementById('city').value;
    const departure = document.getElementById('departure').value;
    const return_date = document.getElementById('return_date').value;
    console.log("departure: ", departure)
    console.log("city: ", city)

    let departure_date = new Date(departure)
    let start_month = departure.slice(5,7) 
  
    let start_day = departure.slice(8,10);
    let d = new Date();
 
    let end_day = parseInt(departure.slice(8,10)) + 1
    if (end_day < 9) end_day = "0" + end_day.toString();
    let start_date = d.getFullYear() - 1 + '-' + start_month + '-' + start_day
    let end_date = d.getFullYear() - 1 + '-' + start_month + '-' + end_day

    let getCoordResponse = await Client.getLatLong(`http://localhost:8000/getcoord/${city}`)
    getCoordResponse['departure'] = departure
    getCoordResponse['return_date'] = return_date
    getCoordResponse['city'] = city

    let lat = getCoordResponse['latitude']
    let lon = getCoordResponse['longitude']

    let getTemperatures = await Client.getMaxMinTemp(`http://localhost:8000/getweather/${lat}/${lon}/${start_date}/${end_date}`)

    getCoordResponse['max_temp'] = Client.convertCToFTemp(getTemperatures['max_temp'])
    getCoordResponse['min_temp'] = Client.convertCToFTemp(getTemperatures['min_temp'])

    let mycity = getCoordResponse['city']

    let country = getCoordResponse['country']

    if (country == 'United States') {
       country='usa'};
    

    let getImage = await Client.getImageURL(`http://localhost:8000/getimage/${mycity}/${country}`)
    
    getCoordResponse['img_url'] = getImage['image_URL']

    Client.postData("http://localhost:8000/addData",getCoordResponse);
    Client.updateUI();
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
           Client.createCards(allData)
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
                 
                </h5>
              </div>
          
              <div id="collapse-${idx}" class="collapse show" aria-labelledby="heading-${idx}" data-parent="#accordion">
                <div class="card-body" id="dest-picture">
                  <img src=${result.img_url} alt= ${result.city}>
                </div>
                <div id="trip-info">
                  <h3>My trip to: ${result.city}, ${result.country}</h3>
                  <p>Departing: ${result.departure}</p>
                  <p>${Client.calculateDaysLeft(result.departure)} day(s) left for the trip!!!!</p>
                  <p>Typical weather for then is:</p>
                  <p>High: ${result.max_temp.toFixed(2)}, Low: ${result.min_temp.toFixed(2)}</p>
                  <p>I will be coming back on: ${result.return_date}</p>
                  <p>I will be away for ${Client.calculateDaysAway(result.departure,result.return_date)} days</p>
                </div>
              </div>
            </div>
            `;
          
            // Append newyly created card element to the container
            myCardHolder.innerHTML += content;
          })

        
    };
    
    function calculateDaysLeft(departure){
      let departure_dt = new Date(departure)
      let today = new Date();
      let timeLeft = departure_dt.getTime() - today.getTime();
      let daysLeft = timeLeft / (1000 * 3600 * 24)
      return Math.ceil(daysLeft)
    }
 
    function calculateDaysAway(departure,return_date){
      let departure_dt = new Date(departure)
      let return_dt = new Date(return_date);
      let timeAway =  return_dt.getTime() -  departure_dt.getTime();
      let daysAway = timeAway / (1000 * 3600 * 24)
      return Math.ceil(daysAway)
    }
export { getInformation, getLatLong, getMaxMinTemp, convertCToFTemp, getImageURL, postData, createCards, calculateDaysLeft, updateUI, calculateDaysAway }