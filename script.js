// // //
"use strict";

// Geolocation API
// The Geolocation API provides the geographic location of a user. It allows you to access latitude and longitude coordinates through the browser. This is useful for location-based features in web applications
// Latitude: Measures how far north or south you are from the equator (0° to 90°)
// Longitude: Measures how far east or west you are from the Prime Meridian (0° to 180°)
// using Leaflet🍀🍁🍀🍁 Library. It's an open-source JavaScript library for mobile-friendly interactive maps

// Workout class✅✅✅
class Workout {
  date = new Date(); // mind that here date isn't variable, date is property. Variable: A value used inside functions or blocks, Property: A value that belongs to an object or instance of a class
  id = (Date.now() + "").slice(-10); // for each input or element that needs to be uniquely identified, assigning a unique id helps manage and reference them easily, especially when dealing with dynamic content or multiple elements. Date.now() returns the current time in milliseconds since January 1, 1970
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Setup Time✅✅
    const hours = this.date.getHours();
    const minutes = String(this.date.getMinutes()).padStart(2, "0"); // 5.padStart(2, "0") == 05 hobe, but 11.padStart(2, "0") == 11 hobe cuz 11 is already 2 characters long
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // example hours = 5, then 5/12 = 0.4167. The integer part of the division is 0, To find the remainder, multiply the integer part of the division (which is 0) by 12 and subtract it from 5. (5 - (12 * 0) = 5), So, the remainder is 5. hours = 17, then 17/12 = 1.4167. The integer part of the division is 1, Now ( 17 - (12 * 1) = 5), So the remainder is 5
    // ⛔️⛔️

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()} &nbsp;&nbsp;⌛️${`${adjustedHours}: ${minutes} ${period}`}
    `;

    this.descriptionShort = `${this.type[0].toUpperCase()}${this.type.slice(
      1
    )} on ${months[this.date.getMonth()]} ${this.date.getDate()} 
    `;
  }

  click() {
    this.clicks++;
  }
}
// ⛔️⛔️⛔️

// Running class✅✅✅
class Running extends Workout {
  type = "running"; // same thing for obj

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    // this.type = "running"; // same thing for obj

    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
// ⛔️⛔️⛔️

// Cycling class✅✅✅
class Cycling extends Workout {
  type = "cycling"; // same thing for obj

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    // this.type = "cycling"; // same thing for obj

    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
// ⛔️⛔️⛔️

// APPLICATION ARCHITECTURE✅✅✅
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const deleteAll = document.querySelector(".dlt");

// App class✅✅✅
class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition(); // We use this._getPosition() in the constructor to call the method immediately when an instance of the class is created. The constructor function is automatically called when a new instance of the class is created with new keyword, amra etake instance create er poreu call dite prtam, we r a js developer, so we r here to solve the spaghetti problem, ei rules ei constructor fucntion er nicher gulor jonno same

    // Form Submit✅✅
    form.addEventListener("submit", this._newWorkout.bind(this)); // eta bojhar jonno function section e jete hobe, here we want this keyword refer to the class instance. 'submit' event is triggered when a form is submitted, like press "enter"

    // change Cadence to Elev Gain. mind that, when we click this element(inputType) and changing something example: one item to another item
    inputType.addEventListener("change", this._toggleElevationField); // ekhane to ar .bind(this) lagbe na karon ekhane proyojon nai
    // change is a event(When user modifies or changes the value of a form element)
    // ⛔️⛔️

    // Smooth move to every workout
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));

    // Get data form local storage
    this._getLocalStorage();

    // Delete everything
    deleteAll.addEventListener("click", this.reset);
  }

  _getPosition() {
    if (navigator.geolocation) {
      // navigator.geolocation provides access to the current device’s geographic location. navigator is an object that provides browser and system information
      navigator.geolocation.getCurrentPosition(
        // geolocation property, getCurrentPosition() is a method/function that retrieves the user’s current geographical location
        this._loadMap.bind(this), // ekhane .bind(this) na use korle eta refer korto getCurrentPosition function k, jeta global object, ar global object this keyword nai, so we use .bind(this) to ensure that it's refer to the class instance
        // 1st parameter holo success call back function, when the browser successfully got the coordinates
        function () {
          alert(`Sorry! Could not get your position 😕`);
        } // 2nd parameter holo error call back function, when the browser face any error
      );
    }
  }

  _loadMap(position) {
    // console.log(position);
    const { latitude } = position.coords; // coords property
    const { longitude } = position.coords;
    // console.log(latitude, longitude);
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];

    // console.log(this);
    this.#map = L.map("map").setView(coords, this.#mapZoomLevel); // ekhane id name onujai e class use korlam. L onekta Internationalization API er moto. 13 holo position-zoom
    // console.log(map);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      // tileLayer method/function er 1st parameter holo map er theme
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling click on map
    this.#map.on("click", this._showForm.bind(this)); // same case for 'this'
    // on method/function is coming from Leaflet library, etakei addEventListner method hisebe kaj korbo

    // But at this point after full load, it's now avaliabe to any actions, It's for _getLocalStorage() method/function
    this.#workouts.forEach((work) => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    // console.log(mapE);
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus(); // focus method/function sets the cursor in an element
  }

  _hideForm() {
    // empty the input
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        ""; // value property set/get the current content of an input field

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();
    // console.log(this);

    // Helper function for guard clause✅✅
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp)); // jehetu rest parameter use korchi, so it'll be an array. every() is an array method/function that checks if all elements in the array pass a given test (provided by a function). It returns true if all elements pass the test; otherwise, it returns false

    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);
    // ⛔️⛔️

    // Get data from the form✅✅
    const type = inputType.value; // ei value html e set kora ache
    const distance = +inputDistance.value; // this value coming from user, we use + for number
    const duration = +inputDuration.value; // same
    const { lat, lng } = this.#mapEvent.latlng; // latlang is a built-in Leaflet property
    let workout;
    // ⛔️⛔️

    // If workout running, create running obj✅✅
    if (type === "running") {
      const cadence = +inputCadence.value;

      // Check the data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        // guard clause means is that we will basically check for the opposite of what we are originally interested in
        return alert(`Inputs have to be positive number! 😑`);
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }
    // ⛔️⛔️

    // If workout cycling, create cycling obj✅✅
    if (type === "cycling") {
      const elevation = +inputElevation.value;

      // Check the data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration) // elevation negative hote pare
      ) {
        return alert(`Inputs have to be positive number! 😑`);
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    // ⛔️⛔️

    // Add new obj to workout array✅✅
    this.#workouts.push(workout);
    // console.log(workout);
    // ⛔️⛔️

    // Render workout on the map as a marker✅✅
    this._renderWorkoutMarker(workout);
    // ⛔️⛔️

    // Render workout on the list✅✅
    this._renderWorkout(workout);
    // ⛔️⛔️

    // Hide form and Clear the input field when press enter after submitting something✅✅
    this._hideForm();
    // ⛔️⛔️

    // Set local storage to all workout✅✅
    this._setLocalStorage();
    // ⛔️⛔️

    // Show the delete button✅✅
    deleteAll.style.display = "block";
    // ⛔️⛔️
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      // marker method/function
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${
          workout.descriptionShort
        }`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
     <li class="workout workout--${workout.type}" data-id="${workout.id}">
       <h2 class="workout__title">${workout.description}</h2>
       <div class="workout__details">
         <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}
         </span>
         <span class="workout__value">${workout.distance}</span>
         <span class="workout__unit">km</span>
       </div>
       <div class="workout__details">
         <span class="workout__icon">⏱️</span>
         <span class="workout__value">${workout.duration}</span>
         <span class="workout__unit">min</span>
       </div>
    `;

    if (workout.type === "running") {
      html += `
       <div class="workout__details">
         <span class="workout__icon">⚡️</span>
         <span class="workout__value">${workout.pace.toFixed(1)}</span>
         <span class="workout__unit">min/km</span>
       </div>
       <div class="workout__details">
         <span class="workout__icon">🦶🏼</span>
         <span class="workout__value">${workout.cadence}</span>
         <span class="workout__unit">spm</span>
       </div>
     </li>
    `;
    }

    if (workout.type === "cycling") {
      html += `
       <div class="workout__details">
         <span class="workout__icon">⚡️</span>
         <span class="workout__value">${workout.speed.toFixed(1)}</span>
         <span class="workout__unit">km/h</span>
       </div>
       <div class="workout__details">
         <span class="workout__icon">⛰</span>
         <span class="workout__value">${workout.elevationGain}</span>
         <span class="workout__unit">m</span>
       </div>
     </li>
    `;
    }

    form.insertAdjacentHTML("afterend", html);

    // show the delete button
    deleteAll.style.display = "block";
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");
    // console.log(workoutEl);

    if (!workoutEl) return; // guard clause

    // console.log(this.#workouts);
    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    );
    // console.log(workout);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    }); // setView is a Leaflet method/fucntion

    // using the public interface
    // workout.click(); // when we converted our objects or array to a string, and then back from the string to objects or array, we lost the prototype chain
  }

  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts)); // localStorage object is an API that the browser provides for us. setItem() method/function stores a key-value pair in localStorage, where both key and value are string. JSON.stringify() converts a JavaScript object or array into a JSON string
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts")); // getItem() method/fucntion retrieves a value from localStorage by using a specified key. JSON.parse() converts a JSON string back into a JavaScript object or array
    // console.log(data);

    if (!data) return;

    this.#workouts = data; //  _getLocalStorage method here is gonna be executed right in the very beginning, So at that point we set some data based on our previous data in the local storage
    this.#workouts.forEach((work) => {
      this._renderWorkout(work);

      // this._renderWorkoutMarker(work); // At the beginning jokhon _getLocalStorage executed holo sathe sathe to r gota page load hoy na, it's take some times jar karone eta possible na. There's a lot of stuff that has to happen before we can actually render any markers on the map
    });
  }

  // using it on DevTools
  reset() {
    localStorage.removeItem("workouts"); // removeItem() method/function removes a specific key and its value
    location.reload(); // it's reloads the current page from the server and refreshing the content. location is an object that provides information about the current URL and allows you to reload or manipulate the page
  }
}
// ⛔️⛔️⛔️

const mapty = new App();
// When JavaScript reads a class(means when we call it like(const mapty = new App();)). So, it processes the entire class definition before running any code inside it. This means: Once a class is defined(means after the class code is fully written and ready for use), all its methods and properties are available within the class. Methods aren’t hoisted globally, but they’re accessible within the class after the class definition
// ⛔️⛔️⛔️

// window.onload = function () {
//   alert(`Hey! Click one the Map 🗺️😎`);
// };
