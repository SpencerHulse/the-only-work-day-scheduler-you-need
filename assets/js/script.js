//displays the current day at the top of the page
$(currentDay).text(moment().format("dddd, MMMM Do"));

//checks
/* console.log(moment().format("HH"));
console.log(moment().format("mm ss")); */

let loadTime = moment().format("HH mm ss");
loadTime = loadTime.split(" ");

//calculates the time difference for the first hour
let timeDiff = (60 * (59 - loadTime[1]) + (60 - loadTime[2])) * 1000;

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
      let text = $(this).val().trim();
      let taskDiv = $("<div>").addClass("col-10 description past").text(text);
      $(this).replaceWith(taskDiv);
    } else if (time == currentHour) {
      console.log("The current hour is " + time);
      $(this).addClass("present");
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
let hourInterval = setInterval(function () {
  plannerAudit();
}, 1000 * 60 * 60);

//sets a timeout to begin hourly audits on the hour
let firstHour = setTimeout(startHourlyAudit, timeDiff);

//audit upon load in - might bundle into loadTasks
plannerAudit();
