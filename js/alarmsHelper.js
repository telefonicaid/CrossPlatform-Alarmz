'use strict';

var AlarmsHelper = (function() {

        function ring() {
                updateAlarmList();
                navigator.vibrate(2000);
                alert('RING!!!');
        }

        if (navigator.mozAlarms) {
          navigator.mozHasPendingMessage('alarm');
          navigator.mozSetMessageHandler('alarm', function (mozAlarm) {
                  var req = navigator.mozApps.getSelf();
                        req.onsuccess = function() {
                                req.result.launch();
                                setTimeout(ring);
                        };
                });
        } else {
                // How can I know whether my app is launched from Alarm or not?
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
                var date = new Date();
                date.setHours(time.hour, time.minute, 0, 0);
                var request = navigator.alarms.add(date, 'ignoreTimezone');

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
