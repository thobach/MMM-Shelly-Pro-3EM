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
		self = this;
		var currentdate = new Date();
		var options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
		var printed_date = new Intl.DateTimeFormat('de', options).format(currentdate);
		var month = '' + (currentdate.getMonth() + 1);
		var day = '' + currentdate.getDate();
		var year = currentdate.getFullYear();
		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;
		var cloud_date = [year, month, day].join('');
		var filter_date = [year, month, day].join('-');

		if (notification == "GetShelly"){
			//Parameters: notification can be anything (not used), payload must be the URL of the Shelly PM status api
			request(payload.uri, {json: true, forever: true, timeout: 2500 }, (err, res, body) => {
				if (err) { return console.log(err); }

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

				self.sendSocketNotification('ShellyPDData', payload);
			});
		}

		if (notification == "GetShellyCloud") {
			// siehe https://www.shelly-support.eu/forum/index.php?thread/10983-cloud-api-abfrage-consumption/&pageNo=2
            var dataString = 'channel=0&date_range=day&date=' + cloud_date + '&id=' + payload.deviceId + '&auth_key=' + payload.authKey
			const options = {
				uri: payload.uri,
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: dataString,
				json: true,
				forever: true,
				timeout: 2500
			};
			// console.log(options);
			request.post(options, (err, res, body) => {
				if (err) {
					return console.log(err);
				}
				data = body['data']['history']
				data = data.filter(function(item) {
					if (item.datetime.includes(filter_date)) {
						return true;
					}
					return false
				})
				var power = 0.0
				data.forEach(function(item) {
					if (item.consumption < 0.4) {
						power -= item.consumption
					} else {
						power += item.consumption
					}
				})

                payload= {
					apower: self.oldData.apower,
                    tmp: self.oldData.tmp,
                    updated: self.oldData.updated,
                    total: (power/1000).toFixed(3)
                }
				self.oldData.apower = payload.apower;
				self.oldData.tmp = payload.tmp;
				self.oldData.updated = payload.updated;
				self.oldData.total = payload.total;
				self.sendSocketNotification('ShellyCloudData', payload)
			})
		}
	}
});
