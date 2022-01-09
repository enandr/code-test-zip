let searchButton;
let zipcodeInput;
let stateImg;

initializeApp();

function initializeApp() {
  stateImg = document.querySelector('#stateImage');
  // apply click event to the search button
  searchButton = document.querySelector('#searchBtn');
  searchButton.addEventListener('click', runSearch);

  // lock input to numbers only
  zipcodeInput = document.querySelector('#zipInput');
  zipcodeInput.addEventListener('keydown', event => {
    // run search if the user presses enter and the zip code is 5 digits long
    if (event.keyCode === 13 && zipcodeInput.value.length === 5) {
      runSearch();
    } else {
      // if the keypressed is not a number, cancel the event
      if ((event.keyCode < 48 || event.keyCode > 57) && event.keyCode !== 8) {
        event.preventDefault();
      }
    }
  })
}

async function runSearch() {
  const zipcode = zipcodeInput.value;
  document.querySelector('#alertBox').innerHTML = '';
  if (zipcode.length !== 5) return;

  // fetches the zipcode data from the api
  const zipcodeData = await (await fetch(`http://api.zippopotam.us/us/${zipcode}`)).json();
  if (zipcodeData['post code']) {
    zipcodeInput.value = '';
    zipcodeInput.focus();

    // if the zipcode exists, update the ui
    updateUI(zipcodeData);
  } else {

    // if the zipcode does not exist, create an alert box
    document.querySelector('#alertBox').innerHTML = `
    <div class="alert">
			I'm sorry but that zipcode does not exist
		</div>`
  }
}

function updateUI(zipcodeData) {
  // remove the no data row if it exists
  const noDataRow = document.querySelector('#noDataRow');
  if (noDataRow) {
    noDataRow.remove();
  }

  const tableBody = document.querySelector("#searchResults tbody");

  // create all the elements of a new table row and insert the data
  const newTR = document.createElement('tr');

  const newTDzip = document.createElement('td');
  newTDzip.innerText = zipcodeData['post code'];

  const newTDcity = document.createElement('td');
  newTDcity.innerText = zipcodeData.places[0]['place name'];

  const newTDstate = document.createElement('td');
  newTDstate.innerText = zipcodeData.places[0].state;

  const newTDlon = document.createElement('td');
  newTDlon.innerText = zipcodeData.places[0].longitude;

  const newTDlat = document.createElement('td');
  newTDlat.innerText = zipcodeData.places[0].latitude;

  const newTDcountry = document.createElement('td');
  newTDcountry.innerText = zipcodeData.country;

  const newTDimg = document.createElement('td');
  const newImg = document.createElement('img');
  newImg.src = `states/${zipcodeData.places[0]['state abbreviation']}.svg`;
  newTDimg.append(newImg);

  newTR.append(newTDzip);
  newTR.append(newTDcountry);
  newTR.append(newTDcity);
  newTR.append(newTDstate);
  newTR.append(newTDlat);
  newTR.append(newTDlon);
  newTR.append(newTDimg);
  tableBody.append(newTR);
}
