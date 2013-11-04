'use strict';

var install = document.getElementById('install-app');

install.addEventListener('click', function (ev) {
  var manifestUrl =
      'http://telefonicaid.github.io/CrossPlatform-AlarmClock/install/' + 
      'package.manifest';
  if (navigator.mozApps) {
    var req = navigator.mozApps.installPackage(manifestUrl);
    req.onsuccess = function () { 
      install.textContent = 'Alarm Clock is being installed';
      install.setAttribute('disabled', true);
    };
    req.onerror = function () {
      if (req.error.name === 'REINSTALL_FORBIDDEN') {
        alert('The Alarm Clock app is already installed.');
        install.textContent = 'Alarm Clock already installed';
        install.setAttribute('disabled', true);
      }
      console.log('Error when installing the app: ' + req.error.name);
    };
  } else {
    window.open(manifestUrl, '_top');
  }
});
