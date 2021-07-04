const DOMElements = {
  breed_select: '#breed_select',
  breed_data: '#breed_data',
  breed_image: '#breed_image',
  breed_data_table: '#breed_data_table',
  hidden_affection: '#hidden_affection_level',
  hidden_social: '#hidden_social_needs',
  hidden_energy: '#hidden_energy_level'
}

// Set up controller
let $breed_select = document.querySelector(DOMElements.breed_select);
$breed_select.addEventListener('change', (event) => {
  var options = $breed_select.options;
  var id = options[options.selectedIndex].id;
  console.log("Selected Breed ID: " + id);
  getCatByBreed(id);
})
 
// Load all the Breeds
function getBreeds() {
  ajax_get('https://api.thecatapi.com/v1/breeds', function(data) {
    populateBreedsSelect(data)
  });
}

// Put breeds in select control
function populateBreedsSelect(breeds)
{
  console.log("Loading Breeds into select.");
  for (let i = 0; i < breeds.length; i++)
  {
    let html = '<option id="' + breeds[i].id + '" value="1">' + breeds[i].name + '</option>';
    document.querySelector(DOMElements.breed_select).insertAdjacentHTML('beforeend', html);
  }
  document.querySelector(DOMElements.breed_select).insertAdjacentHTML('afterbegin',
                                       "<option selected='selected' value='0' id='none'>Select Breed</option>");
}


// triggered when the breed select control changes
function getCatByBreed(breed_id) {
  // search for images that contain the breed (breed_id=) and attach the breed object (include_breed=1)
  ajax_get('https://api.thecatapi.com/v1/images/search?include_breed=1&breed_id=' + breed_id, function(data) {

    if (data.length == 0) {
      // if there are no images returned
      clearBreed();
      document.querySelector(DOMElements.breed_data_table).insertAdjacentHTML('beforeend', "<tr><td>Please select a breed</td></tr>");
    } else {
      //else display the breed image and data
      displayBreed(data[0])
    }
  });
}

// clear the image and table
function clearBreed() {
  document.querySelector(DOMElements.breed_image).setAttribute('src', "");
  let parent = document.querySelector(DOMElements.breed_data_table);
  while(parent.hasChildNodes())
  {
    parent.removeChild(parent.firstChild);
  }
  console.log("Cleared Breed Information");
}

// display the breed image and data
function displayBreed(image) {
  document.querySelector(DOMElements.breed_image).setAttribute('src', image.url);
  let parent = document.querySelector(DOMElements.breed_data_table);
  while(parent.hasChildNodes())
  {
    parent.removeChild(parent.firstChild);
  }
  let breed_data = image.breeds[0];
  //Set hidden values
  document.querySelector(DOMElements.hidden_affection).value = breed_data.affection_level;
  document.querySelector(DOMElements.hidden_social).value = breed_data.social_needs;
  document.querySelector(DOMElements.hidden_energy).value = breed_data.energy_level;
  let table = document.querySelector(DOMElements.breed_data_table);
  // Fill table elements with wanted elements
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Breed:" + "</td><td>" + breed_data.name + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Origin:" + "</td><td>" + breed_data.origin + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Description:" + "</td><td>" + breed_data.description + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Temperament:" + "</td><td>" + breed_data.temperament + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Weight:" + "</td><td>" + breed_data.weight.imperial + " lbs" + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Life Span:" + "</td><td>" + breed_data.life_span + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Adaptability:" + "</td><td>" + breed_data.adaptability + "/5" + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Affection Level:" + "</td><td>" + breed_data.affection_level + "/5" + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Energy Level:" + "</td><td>" + breed_data.energy_level + "/5" + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Intelligence:" + "</td><td>" + breed_data.intelligence + "/5" + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Social Needs:" + "</td><td>" + breed_data.social_needs + "/5" + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "Vocalisation:" + "</td><td>" + breed_data.vocalisation + "/5" + "</td></tr>");
  table.insertAdjacentHTML('beforeend', "<tr><td>" + "More Info:" + "</td><td>" + "<a id='cfaLink' href='" + 
                            breed_data.cfa_url + "'target='blank'>CFA Link</a>" + "</td></tr>");
}

// Ajax request
function ajax_get(url, callback) {
  fetch(url)
  .then(response => response.json())
  .then(data => callback(data))
  .catch((error) => {
    console.error('Error', error);
  });
}


// call the getBreeds function which will load all the Cat breeds into the select control
getBreeds();
