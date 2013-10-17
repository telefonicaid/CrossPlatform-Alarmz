'use strict';

var AlarmsHelper = (function() {

	if (navigator.mozAlarms) {
	  navigator.mozHasPendingMessage('alarm');
	  navigator.mozSetMessageHandler('alarm', function (mozAlarm) {
		  var req = navigator.mozApps.getSelf();
			req.onsuccess = function() {
				req.result.launch();
				navigator.vibrate(2000);
				alert('RING!!!');
			};
		});
	}

	var parseTime = function(time) {
	  var parsed = time.split(':');
	  var hour = +parsed[0]; // cast hour to int, but not minute yet
	  var minute = parsed[1];

	  // account for 'AM' or 'PM' vs 24 hour clock
	  var periodIndex = minute.indexOf('M') - 1;
	  if (periodIndex >= 0) {
		  hour = (hour == 12) ? 0 : hour;
		  hour += (minute.slice(periodIndex) == 'PM') ? 12 : 0;
		  minute = minute.slice(0, periodIndex);
	  }

	  return {
		  hour: hour,
		  minute: +minute // now cast minute to int
	  };
	};

  function addAlarm(time, callback) {
		time = parseTime(time);
		var myDate = (new Date()).setHours(time.hour, time.minute, 0, 0);

		var request = navigator.alarms.add(myDate, 'ignoreTimezone');

		request.onsuccess = function () {
			console.log("The alarm has been scheduled");
			callback();
		};

		request.onerror = function () {
			console.error("An error occurred: " + this.error.name);
			callback();
		};
	}

  return {
    addAlarm: addAlarm
  };
}());
