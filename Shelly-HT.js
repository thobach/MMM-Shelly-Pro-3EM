Module.register("Shelly-HT",{
	// Default module config.
	defaults: {
		//Just a mock API I used for development
		ShellyHTApiPath: "http://www.mocky.io/v2/5e9999183300003e267b2744",
		RefreshInterval: 30000,
		displayUpdated: true,
		horizontalView: true
	},
	//After startup, we don't have data and might not have it for a long time, until Shelly HT wakes up.
	ShellyHTData: {
		tmp: "--",
		apower: "--",
		// hum: "--",
		// bat: "--",
		updated: "--"
	},
	getStyles: function () {
		return ["Shelly-HT.css", "font-awesome.css"];
	},
	start: function() {
		var self = this;

		// Schedule update timer.
		setInterval(function() {
			self.sendSocketNotification("GetShelly", self.config.ShellyHTApiPath);
			self.updateDom();
		}, this.config.RefreshInterval);

	},
	socketNotificationReceived: function (notification, payload) {
		if (notification = "ShellyHTData"){
			//Log.log(this.name + " received a socket notification: " + notification + " - Temp: " + payload.tmp + " Hum: " + payload.hum + "Updated: " + payload.updated);
			this.ShellyHTData.tmp = payload.tmp
			// this.ShellyHTData.hum = payload.hum
			// this.ShellyHTData.bat = payload.bat
			this.ShellyHTData.apower = payload.apower
			this.ShellyHTData.updated = payload.updated
		}
	},
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		var apower = this.translate("APOWER")

		// var hum = this.translate("HUMIDITY");
		// var bat = this.translate("BATTERY", {"bat": this.ShellyHTData.bat})
		var tmp = this.translate("TEMPERATURE", {"tmp": this.ShellyHTData.tmp});
		var updated = this.translate("UPDATED", {"upd": this.ShellyHTData.updated})
		ihtml =  "<div class='container'>"
		if (this.config.horizontalView) {
			ihtml += "  <div class='right'><sup>" + apower + "</sup> " + this.ShellyHTData.apower + " Watt</div>"
			// ihtml += "  <div class='right'><sup>" + tmp + "</sup> " + this.ShellyHTData.tmp + " ℃</div>"
		} else {
			ihtml += "  <div class='newline'><sup>" + apower + "</sup>" + this.ShellyHTData.apower + " Watt</div>"
			// ihtml += "  <div class='newline'><sup>" + tmp + "</sup>" + this.ShellyHTData.tmp + " ℃</div>"
		}
		if (this.config.displayUpdated){
			ihtml += "  <p class='bottom'>" + tmp + " ℃ " + updated + "</p>"
		}
		ihtml += "</div>"
		wrapper.innerHTML = ihtml
		return wrapper
	},
	getTranslations: function() {
        return  {
			nl:	'translations/nl.json',
			en: 'translations/en.json',
			de: 'translations/de.json',
		};
	}
});
