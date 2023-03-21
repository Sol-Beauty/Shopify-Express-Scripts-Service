const NodeGeocoder = require('node-geocoder');


const options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https',
  apiKey: 'AIzaSyAReTp8wkBMBI2EugYomR0v_NCJlKS4Ask', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};


/**
 * Address Repository
 */
var rep = {};


rep.generateAddress = (data) => {
  const country  = data.country ? data.country: '';
  const zip  = data.zip ? data.zip: '';
  const state  = data.state ? data.state: '';
  const city  = data.city ? data.city: '';
  const address1  = data.address1 ? data.address1: '';
  const address2  = data.address2 ? data.address2: '';
  
  return (address1+ ' '+ zip+' '+ address2+ ' '+ city+ ' '+ state+ ' '+ country).trim();
}

rep.validate = async (data) => {
  const address = rep.generateAddress(data);
  const geocoder = NodeGeocoder(options);
  const res = await geocoder.geocode(address);
  return res;
}

module.exports = rep;
