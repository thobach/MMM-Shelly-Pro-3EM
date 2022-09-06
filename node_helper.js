var NodeHelper = require("node_helper");

const request = require('request');

module.exports = NodeHelper.create({

	start: function() {

	},

	// Frontend module pings the node helper to fetch data from Shelly HT
	socketNotificationReceived: function (notification, payload) {
		if (notification == "GetShelly"){
			//Parameters: notification can be anything (not used), payload must be the URL of the Shelly HT status api
			self = this;
			request(payload, {json: true }, (err, res, body) => {
				if (err) { return console.log(err); }

				currentdate = new Date();
				// var options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
				var options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
				var printed_date = new Intl.DateTimeFormat('de', options).format(currentdate);

				payload= {
					apower: body['switch:0'].apower,
					tmp: body['switch:0'].temperature.tC,
					updated: printed_date
				}
				//console.log("Sending Shelly data to FE module", payload);

				self.sendSocketNotification('ShellyPDData', payload)
			});
		}
	}
});
