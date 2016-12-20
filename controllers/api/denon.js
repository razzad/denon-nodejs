var router = require('express').Router();
var auth = require('basic-auth');
var Validator = require('jsonschema').Validator;
var commandSchema = require('../../models/commandSchema.json');
var denonCommand = require('../denonCommands.js');

router.post('/', function (req, res) {

  var command = req.body;
  var credentials = auth(req);
  var authorized =false;
  
  if (!credentials || credentials.name !== ( process.env.username ||'robert') || credentials.pass !== ( process.env.PW ||'secret')) {
    authorized =false;
  } else {
    authorized =true;
  }


  if (!authorized){
    res.header('WWW-Authenticate','Basic realm="JenB0b"');
    return res.status(401).send();
  }else{
    var jv = new Validator();
    
    var commandValid= jv.validate(command, commandSchema);
    //console.log(commandValid);
    if (Object.keys(commandValid.errors).length ){
      return res.status(400).json(command);
    }
    else{
      var commandString= command.command;
      var parameter = command.parameter;
      denonCommand(commandString, parameter);


      return res.status(200).json(command);
    }
    
  }

});




module.exports = router;