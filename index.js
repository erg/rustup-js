var child_process = require('child_process');
var https = require("https");
var fs = require('fs');
var util = require("util");
var chmod = require('chmod');

var options = {
  host: 'sh.rustup.rs',
  port: 443,
  path: '/'
};

let url = 'https://sh.rustup.rs';
let dest = './rustup.sh';

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  }).on('error', function(err) {
    fs.unlink(dest);
    if (cb) cb(err.message);
  });
};

download(url, dest, function() {
  console.log('downloaded', dest);
  chmod(dest, 755);

  // --default-toolchain nightly
  var rustup = child_process.spawn(dest, ['-y'], {stdio: 'inherit', shell: true});
});
