var Nerd = require('./models/nerd');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================	
	app.get('/getCountries', function(req, res) {
		
		/* Nerd.find(function(err, nerds) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(nerds); // return all nerds in JSON format
            }); */
			
			Nerd.find({}, function(err, nerds) {
				if (err)
                    res.send(err);

                res.json(nerds); // return all nerds in JSON format
			});
	});
	
	
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/views/index.html');
	});

};