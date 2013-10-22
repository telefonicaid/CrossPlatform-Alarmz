'use strict';

var AlarmsHelper = (function() {

	var ringText = document.getElementById('ring-text');
  var ringTime = document.getElementById('ring-time');

  function ring(alarm) {
    updateAlarmList();
    navigator.vibrate(2000);
    var hours, minutes;
    hours = alarm.date.getHours();
    minutes = alarm.date.getMinutes();
    ringTime.textContent = (hours < 10 ? '0' + hours : hours) + ':' +
      (minutes < 10 ? '0' + minutes : minutes);
		ringText.textContent = alarm.data ? alarm.data.name : '';
    utils.navigation.go('#ring');
  }

	if (navigator.mozAlarms) {
	  navigator.mozHasPendingMessage('alarm');
	  navigator.mozSetMessageHandler('alarm', function (mozAlarm) {
		  var req = navigator.mozApps.getSelf();
			req.onsuccess = function() {
				req.result.launch();
				setTimeout(ring.bind(this, mozAlarm));
			};
		});
	} else {
		// How can I know whether my app is launched from Alarm or not?
		var reqAppControl = tizen.application.getCurrentApplication().
																											 getRequestedAppControl();
		if (reqAppControl) {
			var appCtrl = reqAppControl.appControl;
			if (appCtrl.operation === 'http://tizen.org/appcontrol/operation/alarm') {
				appCtrl.data.forEach(function iter(item) {
					if (item.key === 'http://tizen.org/appcontrol/data/alarm_id') {
						var id = item.value[0];
						var req = WebAlarmAPI.get(id);

						req.onsuccess = function() {
							ring(this.result);
							navigator.alarms.remove(id);
						};
					}
				});
			}
		}
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

  function addAlarm(time, callback, data) {
		time = parseTime(time);
		var date = new Date();
		date.setHours(time.hour, time.minute, 0, 0);
		var request = navigator.alarms.add(date, 'ignoreTimezone', data);

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
