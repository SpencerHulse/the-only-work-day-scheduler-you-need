//the object to hold time slot information
let timeSlots = [];

//checks the time at the moment of load
let loadTime = moment().format("HH mm ss");
//creates an array that separates hours, minutes, and seconds
loadTime = loadTime.split(" ");

//calculates the time difference between load and the first flat hour
let timeDiff = (60 * (59 - loadTime[1]) + (60 - loadTime[2])) * 1000;

/* saves the content in the time slot when the save button is clicked
it then loads to ensure persistence through time change */
$("button").on("click", function () {
  buttonID = $(this).attr("id");
  slotID = parseInt(buttonID) + 9;
  slotText = $(`#${slotID}`).val();
  timeSlots[buttonID].text = slotText;

  saveTimeSlots();
  loadTimeSlots();
});

//checks the time slots against the current time
let plannerAudit = () => {
  //gets the current hour each time the audit is launched
  let currentHour = moment().format("HH");
  let currentDate = moment().format("dddd, MMMM Do");

  //performs a load to reset the time slots at the start of a new day
  if (currentDate !== timeSlots[9].listDate) {
    console.log("A new day, a new wipe. " + currentDate);
    window.location.reload();
    return;
  }

  //gets an array of all the time slots
  let times = $(".description");
  //loops through the array
  times.each(function () {
    //gets the attribute of each time slot as it is looped through
    let time = $(this).attr("id");
    //converts the attr id into a number
    time = parseInt(time);
    //assigns the proper color class to each time slot
    if (time < currentHour) {
      // gets the text currently entered
      let text = $(this).text().trim();
      //turns the textarea into a div if the time has passed to prevent editing
      let timeSlotDiv = $("<div>")
        .addClass("col-10 description past")
        .attr("id", time)
        .text(text);
      $(this).replaceWith(timeSlotDiv);
    } else if (time == currentHour) {
      $(this).removeClass("future").addClass("present");
    } else {
      $(this).addClass("future");
    }
  });
};

//the first audit done on the nearest hour after load
let startHourlyAudit = () => {
  hourInterval();
  plannerAudit();
};

//launches an audit at the start of every hour
let hourInterval = () => {
  setInterval(function () {
    plannerAudit();
  }, 1000 * 60 * 60);
};

//sets a timeout to launch the first audit on the nearest flat hour
let firstHour = setTimeout(startHourlyAudit, timeDiff);

//loads the time slots in local storage
let loadTimeSlots = () => {
  //converts data from the localStorage string
  timeSlots = JSON.parse(localStorage.getItem("timeSlots"));

  //displays the current day at the top of the page
  let currentDate = moment().format("dddd, MMMM Do");
  $("#currentDay").text(currentDate);

  //if nothing in localStorage or if it is a new day, create a new array
  if (!timeSlots || timeSlots[9].listDate !== currentDate) {
    timeSlots = [
      { id: 9, text: "" },
      { id: 10, text: "" },
      { id: 11, text: "" },
      { id: 12, text: "" },
      { id: 13, text: "" },
      { id: 14, text: "" },
      { id: 15, text: "" },
      { id: 16, text: "" },
      { id: 17, text: "" },
      { listDate: currentDate },
    ];
    //performs a save to wipe the old if it is a new day
    saveTimeSlots();
  }

  //goes through each time slot and loads in text
  $.each(timeSlots, function (timeSlot) {
    //gets the id
    let id = timeSlots[timeSlot].id;
    //gets the text
    let text = timeSlots[timeSlot].text;
    //assigns the text to the time slot using the id
    $(`#${id}`).text(text);
  });

  //performs an initial audit
  plannerAudit();
};

//saves the time slots to local storage
let saveTimeSlots = function () {
  localStorage.setItem("timeSlots", JSON.stringify(timeSlots));
};

//loads saved time slots
loadTimeSlots();
