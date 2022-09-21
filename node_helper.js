var NodeHelper = require("node_helper");

const request = require('request');

module.exports = NodeHelper.create({

	oldData: {
        tmp: "--",
		apower: "--",
		updated: "--",
		total: "--"
	},

	start: function() {

	},

	// Frontend module pings the node helper to fetch data from Shelly PM
	socketNotificationReceived: function (notification, payload) {
		if (notification == "GetShelly"){
			//Parameters: notification can be anything (not used), payload must be the URL of the Shelly PM status api
			self = this;
			request(payload, {json: true, forever: true, timeout: 2500 }, (err, res, body) => {
				if (err) { return console.log(err); }

				currentdate = new Date();
				// var options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
				var options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
				var printed_date = new Intl.DateTimeFormat('de', options).format(currentdate);

				payload= {
					apower: body['switch:0'].apower,
					tmp: body['switch:0'].temperature.tC,
					updated: printed_date,
					total: self.oldData.total
				}
				//console.log("Sending Shelly data to FE module", payload);
				self.oldData.apower = payload.apower;
				self.oldData.tmp = payload.tmp;
				self.oldData.updated = payload.updated;
				self.oldData.total = payload.total;

				self.sendSocketNotification('ShellyPDData', payload)
			});
		}

		if (notification == "GetShellyCloud") {
			self = this

			payload= {
				apower: self.oldData.apower,
				tmp: self.oldData.tmp,
				updated: self.oldData.updated,
				total: 1000
			}
			self.oldData.apower = payload.apower;
			self.oldData.tmp = payload.tmp;
			self.oldData.updated = payload.updated;
			self.oldData.total = payload.total;
			self.sendSocketNotification('ShellyCloudData', payload)

		}


	}
});
