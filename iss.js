const request = require("request");

const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const parsedResults = JSON.parse(body);

    if (!parsedResults.success) {
      const errMsg = `Success status was ${parsedResults.success}. Server returned: [${parsedResults.message}] when fetching data for IP ${parsedResults.ip}.`;
      callback(Error(errMsg), null);
      return;
    }
    const { latitude, longitude } = parsedResults;
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const { latitude, longitude } = coords;
  request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when ISS flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const flyoverTimes = JSON.parse(body).response;

    callback(null, flyoverTimes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("ERR - Something went wrong: ", error);
      return;
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        console.log("ERR - Something went wrong: ", error);
        return;
      }

      fetchISSFlyOverTimes(coords, (error, flyoverData) => {
        if (error) {
          console.log("ERR - Something went wrong: ", error);
          return;
        }
        callback(null, flyoverData);
      });

    });

  });

};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };