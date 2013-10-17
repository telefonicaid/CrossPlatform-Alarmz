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
