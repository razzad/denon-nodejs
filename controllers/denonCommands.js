"use strict";
 module.exports = function (command, parameter){
// Initialization 
   const Denon = require('denon-client');
   var endpoint = ( process.env.endpoint || '192.168.0.171');
/**
 * Denon is now an object containing DenonClient and Options.
 * Use the DenonClient to send requests. Use the Options to define the data.
 */


   const denonClient = new Denon.DenonClient(endpoint);

//console.log("received command "+ command +' '+ parameter);

denonClient
  .connect()
  .then( function(){
 
if (command == 'volume') {

     denonClient.setVolume(parameter); 
     denonClient.disconnect();
}


  })
  .catch((error) => {
    // Oh noez. 
    console.error(error);
  });

  
 
 /*
// Connecting 
denonClient
  .connect()
  .then(() => {
    // Tasty promise chains.. 
    // 
    // You are free to send any command now. 
 
    return denonClient.setInput(Denon.Options.InputOptions.Aux1);
  })
  .then(() => {
 
    return denonClient.setSurround(Denon.Options.SurroundOptions.Stereo);
  })
  .then(() => {
 
    return denonClient.setVolume(98); // Destroy neighborhood 
  })
  .catch((error) => {
    // Oh noez. 
    console.error(error);
  });

}
*/
 };