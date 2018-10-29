const Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

const meteor = require('child_process').spawn('meteor',[],{cwd:'./test/server'});

// Instantiate a Mocha instance.
const mocha = new Mocha();

const testDir = './test'

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file){
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function(file){
    mocha.addFile(
        path.join(testDir, file)
    );
});

meteor.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  if (data.indexOf('App running at: http://localhost:3000/')>-1) {
    mocha.run(function(failures){
      meteor.kill('SIGINT');
      process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
    });
  }
});
