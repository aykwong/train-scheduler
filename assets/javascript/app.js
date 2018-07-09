// Initialize Firebase
var config = {
  apiKey: "AIzaSyA-l5Xzt0ZU7BVqH8JCaDgYoO74OlkMk6c",
  authDomain: "train-scheduler-35c24.firebaseapp.com",
  databaseURL: "https://train-scheduler-35c24.firebaseio.com",
  projectId: "train-scheduler-35c24",
  storageBucket: "train-scheduler-35c24.appspot.com",
  messagingSenderId: "594478798315"
};
firebase.initializeApp(config);

var database = firebase.database();

var name = "",
  destination = "",
  firstTrainTime = "",
  frequency = 0,
  nextArrival = "",
  minutesAway = 0;

var datetime = "",
        date = "";

function update() {
    date = moment()
    datetime.html(date.format('dddd, MMMM Do YYYY, HH:mm:ss a'));
};

$(document).ready(function(){
    datetime = $('#currentTime')
    update();
    setInterval(update, 1000);
});

$("#submit").on("click", function(event) {
  event.preventDefault();

  //Assigning user input to object variable
  name = $("#name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = moment($("#time").val(), "LT").format("HH:mm A");
  frequency = parseInt($("#frequency").val().trim());

  //Calculating the minutes to arrival and next arrival time
  trainCalculations();
  
  //Pushing object variable to Firebase database
  database.ref("/trainTimes").push({
    name: name,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    minutesAway: minutesAway,
    nextArrival: nextArrival
  });

  //Clearing the user input fields for next input
  $("#name").val("");
  $("#destination").val("");
  $("#time").val("");
  $("#frequency").val("");
});

function trainCalculations() {
    //Calculation for nextArrivel and minutesAway
    let converted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(converted);
    let timeDiff = moment().diff(moment(converted), "minutes");
    console.log(timeDiff);
    let remainder = timeDiff % frequency;
    console.log(remainder);
    minutesAway = frequency - remainder;
    console.log(minutesAway);
    nextArrival = moment().add(minutesAway, "minutes").format("HH:mm A");
    console.log(nextArrival);
}

database.ref("/trainTimes").on("child_added", function(childSnapshot) {

  console.log(childSnapshot.val().name);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().frequency);
  console.log(childSnapshot.val().nextArrival);
  console.log(childSnapshot.val().minutesAway);

  let train = $("<tr>");
  train.append(`<td>${childSnapshot.val().name}</td>`);
  train.append(`<td>${childSnapshot.val().destination}</td>`);
  train.append(`<td>${childSnapshot.val().frequency}</td>`);
  train.append(`<td>${childSnapshot.val().nextArrival}</td>`);
  train.append(`<td>${childSnapshot.val().minutesAway}</td>`);
  $(".table-body").append(train);
  
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});