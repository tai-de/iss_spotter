const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("ERR - Something went wrong: ", error);
  }

  for (const passing in passTimes) {
    const pass = passTimes[passing];
    const time = new Date(0);
    time.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`~~~ Pass # ${Number(passing) + 1} ~~~`);
    console.log(`> will be on ${time}`);
    console.log(`> will last for ${duration} seconds!`);
    console.log(`~~~ ~~~~~~~~ ~~~\n`);
  }

});
