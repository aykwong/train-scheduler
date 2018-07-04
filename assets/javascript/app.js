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

var trainStats = {
  name: "",
  destination: "",
  firstTrainTime: "",
  frequency: 0,
  nextArrival: "",
  minutesAway: 0
};

var trainSchedule = [];

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
    setInterval(updateTime, 1000);
});

$("#submit").on("click", function addTrain(event) {
  event.preventDefault();

  trainStats.name = $("#name").val().trim();
  trainStats.destination = $("#destination").val().trim();
  trainStats.firstTrainTime = moment($("#time").val(), "LT").format("HH:mm A");
  trainStats.frequency = parseInt($("#frequency").val().trim());

  database.ref("trainTimes").push(trainStats);

  trainCalculations();

  trainSchedule.push(trainStats);

  //Appending information and data to the table
  let train = $("<tr>");
  train.append(`<td>${trainStats.name}</td>`);
  train.append(`<td>${trainStats.destination}</td>`);
  train.append(`<td>${trainStats.frequency}</td>`);
  train.append(`<td>${trainStats.nextArrival}</td>`);
  train.append(`<td>${trainStats.minutesAway}</td>`);
  $(".table").append(train);

  $("#name").val("");
  $("#destination").val("");
  $("#time").val("");
  $("#frequency").val("");
});



function trainCalculations() {
    //Calculation for nextArrivel and minutesAway
    let converted = moment(trainStats.firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(converted);
    let timeDiff = moment().diff(moment(converted), "minutes");
    console.log(timeDiff);
    let remainder = timeDiff % trainStats.frequency;
    console.log(remainder);
    trainStats.minutesAway = trainStats.frequency - remainder;
    console.log(trainStats.minutesAway);
    trainStats.nextArrival = moment().add(trainStats.minutesAway, "minutes").format("HH:mm A");
    console.log(trainStats.nextArrival);
}

function updateTime() {
  for(var i = 0; 0 < trainSchedule.length; i++) {
    trainStats.firstTrainTime = trainSchedule[i].firstTrainTime;
    trainStats.frequency = trainSchedule[i].frequency;
    trainCalculations();
    let trainRef = ref.child()

  }

  database.ref("trainTimes").on("value")
}