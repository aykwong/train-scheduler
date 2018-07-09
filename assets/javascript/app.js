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

var train = {
  trainStats: {
  name: "",
  destination: "",
  firstTrainTime: "",
  frequency: 0,
  nextArrival: "",
  minutesAway: 0
}};

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
    // setInterval(updateTime, 1000);
});

$("#submit").on("click", function addTrain(event) {
  event.preventDefault();

  //Assigning user input to object variable
  train.trainStats.name = $("#name").val().trim();
  train.trainStats.destination = $("#destination").val().trim();
  train.trainStats.firstTrainTime = moment($("#time").val(), "LT").format("HH:mm A");
  train.trainStats.frequency = parseInt($("#frequency").val().trim());

  //Calculating the minutes to arrival and next arrival time
  trainCalculations();
  
  //Pushing object variable to Firebase database
  database.ref("trainTimes").push(train.trainStats);

  //Appending information and data to the table
  rowCreation();

  //Clearing the user input fields for next input
  $("#name").val("");
  $("#destination").val("");
  $("#time").val("");
  $("#frequency").val("");
});

function trainCalculations() {
    //Calculation for nextArrivel and minutesAway
    let converted = moment(train.trainStats.firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(converted);
    let timeDiff = moment().diff(moment(converted), "minutes");
    console.log(timeDiff);
    let remainder = timeDiff % train.trainStats.frequency;
    console.log(remainder);
    train.trainStats.minutesAway = train.trainStats.frequency - remainder;
    console.log(train.trainStats.minutesAway);
    train.trainStats.nextArrival = moment().add(train.trainStats.minutesAway, "minutes").format("HH:mm A");
    console.log(train.trainStats.nextArrival);
}

function rowCreation() {
  let train = $("<tr>");
  train.append(`<td>${train.trainStats.name}</td>`);
  train.append(`<td>${train.trainStats.destination}</td>`);
  train.append(`<td>${train.trainStats.frequency}</td>`);
  train.append(`<td>${train.trainStats.nextArrival}</td>`);
  train.append(`<td>${train.trainStats.minutesAway}</td>`);
  $(".table").append(train);

}

database.ref("/trainTimes").on("value", function(snapshot) {

  if (snapshot.child().exists()) {

    $(snapshot.child()).each(function (snapshot) {
      trainStats.name = snapshot.val().name;
      trainStats.destination = snapshot.val().destination;
      trainStats.firstTrainTime = snapshot.firstTrainTime;
      trainStats.frequency = snapshot.val().frequency;
      trainStats.nextArrival = snapshot.val().nextArrival;
      trainStats.minutesAway = snapshot.val().minutesAway;

    trainCalculations();



    })
  }
  
  // If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// function updateTime() {
//   for(var i = 0; 0 < trainSchedule.length; i++) {
//     trainStats.firstTrainTime = trainSchedule[i].firstTrainTime;
//     trainStats.frequency = trainSchedule[i].frequency;
//     trainCalculations();
//     let trainRef = ref.child()

//   }

//   database.ref("trainTimes").on("value")
// }