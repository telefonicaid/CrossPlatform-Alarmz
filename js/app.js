'use strict';

utils.navigation.init('[data-position="current"]', 100);

window.addEventListener('hashchange', function (ev) {
  if (location.hash !== 'panel1') {
    document.getElementById('panel1').removeAttribute('aria-selected');
  }
});

document.getElementById('alarm-new').addEventListener('click', function (ev) {
  utils.navigation.go('#alarm-new-details');
});

document.getElementById('alarm-new-details-back').addEventListener('click', function (ev) {
  ev.preventDefault();
  utils.navigation.back();
});

document.getElementById('alarm-new-details-done').addEventListener('click', function (ev) {
  ev.preventDefault();

  var time = document.getElementById('time').value;
  if (!time || time.trim().length === 0) {
    utils.navigation.back();
    return;
  }

  document.getElementById('show-alarms').removeAttribute('disabled');
  AlarmsHelper.addAlarm(time, utils.navigation.back);
});

function resetAlarmList() {
  var alarmList = document.querySelector('#alarm-list ul');
  alarmList.innerHTML = '';
}

function addAlarmItem(alarm) {
  var alarmList = document.querySelector('#alarm-list ul');
  var alarmLI = document.createElement('li');
  var alarmP = document.createElement('p');
  var alarmLabel = document.createElement('label');
  alarmLabel.classList.add('pack-checkbox');
  var alarmInput = document.createElement('input');
  alarmInput.setAttribute('type', 'checkbox');
  alarmInput.setAttribute('checked', true);
  var alarmSpan = document.createElement('span');
  alarmLabel.appendChild(alarmInput);
  alarmLabel.appendChild(alarmSpan);
  alarmP.appendChild(alarmLabel);
  var alarmStr;
  if (alarm) {
    var alarmDate = new Date(alarm.date);
    alarmStr = (alarm.data ? alarm.data + ': ' : '') +
      alarmDate.getDate() + '/' + (alarmDate.getMonth() + 1) + '/' +
      alarmDate.getFullYear() + ' ' +
      (alarmDate.getHours() < 10 ? '0' + alarmDate.getHours() :
        alarmDate.getHours()) + ':' +
      (alarmDate.getMinutes() < 10 ? '0' + alarmDate.getMinutes() :
       alarmDate.getMinutes());
  } else {
    alarmLabel.classList.add('hidden');
    alarmStr = 'NO ALARMS';
  }
  var alarmText = document.createTextNode(alarmStr);
  alarmP.appendChild(alarmText);
  alarmLI.appendChild(alarmP);
  alarmList.appendChild(alarmLI);
}

function updateAlarmList() {
  var alarmsRequest = navigator.alarms.getAll();
  alarmsRequest.onsuccess = function (ev) {
    resetAlarmList();
    if (this.result.length) {
      document.getElementById('show-alarms').removeAttribute('disabled');
      var i, alarms = this.result;
      for (i = 0; i < alarms.length; i++) {
        addAlarmItem(alarms[i]);
      }
    } else {
      document.getElementById('show-alarms').setAttribute('disabled', true);
      addAlarmItem();
    }
  };
  alarmsRequest.onerror = function (error) {
    console.log("ERROR");
  };
}

document.getElementById('show-alarms').addEventListener('click', function (ev) {
  updateAlarmList();
  utils.navigation.go('#alarm-list');
});

document.getElementById('alarm-list-back').addEventListener('click', function (ev) {
  utils.navigation.back();
});

document.getElementById('alarm-list-done').addEventListener('click', function (ev) {
  utils.navigation.back();
});

var stopWatchStart = document.getElementById('stopwatch-start');
var stopWatchReset = document.getElementById('stopwatch-reset');
var stopWatchMin = document.getElementById('stopwatch-min');
var stopWatchSec = document.getElementById('stopwatch-sec');
var stopWatchInterval, stopWatchStatus = 'stopped';
stopWatchStart.addEventListener('click', function (ev) {
  var min, sec;
  if (stopWatchStatus === 'running') {
    clearInterval(stopWatchInterval);
    stopWatchStatus = 'paused';
    stopWatchStart.textContent = 'Resume';
    stopWatchStart.classList.remove('recommend');
  } else {
    stopWatchStatus = 'running';
    stopWatchStart.textContent = 'Pause';
    stopWatchStart.classList.add('recommend');
    stopWatchReset.removeAttribute('disabled');
    stopWatchInterval = setInterval(function () {
      min = parseInt(stopWatchMin.textContent, 10);
      sec = parseInt(stopWatchSec.textContent, 10);
      if (sec === 59) {
        stopWatchMin.textContent = ((min < 10) ? '0' : '') + (min + 1);
        stopWatchSec.textContent = '00';
      } else {
        stopWatchSec.textContent = ((sec < 10) ? '0' : '') + (sec + 1);
      }
    }, 1000);
  }
});
stopWatchReset.addEventListener('click', function (ev) {
  stopWatchStatus = 'stopped';
  clearInterval(stopWatchInterval);
  stopWatchStart.textContent = 'Start';
  stopWatchStart.classList.remove('recommend');
  stopWatchReset.setAttribute('disabled', true);
  stopWatchMin.textContent = '00';
  stopWatchSec.textContent = '00';
});
