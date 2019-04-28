var trainName = '';
var destination = '';
var firstTrainTime = '';
var frequency = '';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyB5P-U6h5R8BP84h4XeLvGU1R746u5w0lA",
    authDomain: "train-schedule-a3d9b.firebaseapp.com",
    databaseURL: "https://train-schedule-a3d9b.firebaseio.com",
    projectId: "train-schedule-a3d9b",
    storageBucket: "train-schedule-a3d9b.appspot.com",
    messagingSenderId: "93420503185"
};
firebase.initializeApp(config);
// Link to database
var database = firebase.database();

// Firebase Snapshot on Value


// Add Train Route Function
$('button').on('click',function() {
    // Prevent Default
    event.preventDefault();
    
    // Take Input from Form and Store in Variables
    trainName = $('#train-name').val().trim();
    // console.log('train name: ', trainName);
    destination = $('#destination').val().trim();
    // console.log('destination: ', destination);
    firstTrainTime = $('#first-train-time').val().trim();
    // console.log('first train time: ', firstTrainTime);
    frequency = $('#frequency').val().trim();
    // console.log('frequency: ', frequency);

    // Prevent Empty Submission
    if (trainName === '' || destination === '' || firstTrainTime === '' || frequency === '') {
        alert('All fields are required. Please fill them out and try again.')
        // Otherwise, save variables to firebase database
    } else {
        database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    });
    // Clear Input Fields
    $('#train-name').val('');
    $('#destination').val('');
    $('#first-train-time').val('');
    $('#frequency').val('');
    }
})

// On Child Add Event
database.ref().on("child_added", function(childSnapshot) {
    // Take a Snapshot of Every Variable When a Train is Added
    console.log('train name: ', childSnapshot.val().trainName);
    // Variable to Store Key
    var trainKey = childSnapshot.key;
    console.log('Key: ', childSnapshot.key);
    // Variable to Store Name
    var trainNameChild = childSnapshot.val().trainName;
    console.log('Train Name Snapshot: ', trainNameChild);
    // Variable to Store Destination
    var destinationChild = childSnapshot.val().destination;
    console.log('Destination Snapshot: ', destinationChild);
    // Variable to Store First Train Time
    var firstTrainChild = childSnapshot.val().firstTrainTime;
    console.log('First Train Snapshot: ', firstTrainChild);
    // Variable to Store Frequency
    var frequencyChild = parseInt(childSnapshot.val().frequency);
    console.log('Frequency Snapshot: ', frequencyChild);

    // Save firstTrain Variable as Moment
    var firstTrainMoment = moment(firstTrainChild, 'HH:mm A').subtract(1, 'years');
    // Difference between time
    var diffTime = moment().diff(moment(firstTrainMoment), 'minutes');
    // Remainder of Time
    var tRemainder = diffTime % frequencyChild;
    console.log('remainder: ', tRemainder);
    // Minutes Until Next Train
    var minutesAway = frequencyChild - tRemainder;
    console.log('minutes away: ', minutesAway);
    // Next Train Time
    var nextArrival = moment().add(minutesAway, 'minutes').format('hh:mm A');
    console.log('next arrival: ', nextArrival);

    // Take Information from Firebase Snapshots to Show in HTML
    // Store in Variables and Create a New Table Row
    var trainRow = $('<tr>');
    var newTrainName = $('<td>');
    newTrainName.text(trainNameChild);
    var newTrainDestination = $('<td>');
    newTrainDestination.text(destinationChild)
    var newFrequency = $('<td>');
    newFrequency.text(frequencyChild);
    var newTrainArrival = $('<td>');
    newTrainArrival.text(nextArrival)
    var newTimeLeft = $('<td>')
    newTimeLeft.text(minutesAway);

    // Append to Train Row
    trainRow.append(newTrainName);
    trainRow.append(newTrainDestination);
    trainRow.append(newFrequency);
    trainRow.append(newTrainArrival);
    trainRow.append(newTimeLeft);

    // Append to HTML
    $('#add-train-route').append(trainRow);    
})


