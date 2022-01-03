//the object to hold time slot information
let timeSlots = [];

//displays the current day at the top of the page
$(currentDay).text(moment().format("dddd, MMMM Do"));

//checks the time at the moment of load
let loadTime = moment().format("HH mm ss");
loadTime = loadTime.split(" ");

//calculates the time difference for the first hour
let timeDiff = (60 * (59 - loadTime[1]) + (60 - loadTime[2])) * 1000;

//saves the content in the time slot when the save button is clicked
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
  console.log("Auditted!");
  //gets the current time each time the audit is launched
  let currentHour = moment().format("HH");
  //gets an array of the time slots
  let times = $(".description");
  //loops through the array
  times.each(function () {
    //gets the attribute of each time slot as it is looped through
    let time = $(this).attr("id");
    time = parseInt(time);
    //assigns the proper color class to each time slot
    if (time < currentHour) {
      /* gets the text currently entered
      (needs work because of the diff between 
      val and text in textarea and div) */
      let text = $(this).text().trim();
      //turns the textarea into a div if the time has passed
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

//the first audit that is dependent on load time
let startHourlyAudit = () => {
  hourInterval();
  plannerAudit();
};

//launches an audit every hour on the hour
let hourInterval = () => {
  setInterval(function () {
    plannerAudit();
  }, 1000 * 60 * 60);
};

//sets a timeout to begin hourly audits on the hour
let firstHour = setTimeout(startHourlyAudit, timeDiff);

let loadTimeSlots = () => {
  timeSlots = JSON.parse(localStorage.getItem("timeSlots"));

  //if nothing in localStorage, create a new array
  if (!timeSlots) {
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
    ];
  }

  //goes through each time slot and loads in text from saved file
  $.each(timeSlots, function (timeSlot) {
    let id = timeSlots[timeSlot].id;
    let text = timeSlots[timeSlot].text;
    $(`#${id}`).text(text);
  });

  //does an audit
  plannerAudit();
};

//saves the time slots to local storage
let saveTimeSlots = function () {
  localStorage.setItem("timeSlots", JSON.stringify(timeSlots));
};

//loads saved time slots
loadTimeSlots();
