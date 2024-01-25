var NodeHelper = require("node_helper");

const request = require('request');

module.exports = NodeHelper.create({

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

		if (notification == "GetShellyData"){
			request(payload.uri, {json: true, timeout: 2500 }, (err, res, body) => {
				if (err) { return console.log(err); }
				payload= {
					apower: body['em:0'].total_act_power,
					apowertoday: body['emdata:0'].total_act,
					updated: printed_date,
				}
				self.sendSocketNotification('ShellyData', payload);
			});
		}
	}
});
