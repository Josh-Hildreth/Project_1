// grab input form element
var inputFormEl = document.querySelector('#artist-name');

// get the latest search from local storage
artistInfo = JSON.parse(localStorage.getItem("artistData"));

// if there is data in local storage, set input field equal to latest artist searched
if (artistInfo) {
    inputFormEl.value = artistInfo.name;
} else {
    inputFormEl.value = "";
}
