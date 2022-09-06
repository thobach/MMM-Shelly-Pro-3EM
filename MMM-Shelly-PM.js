Module.register("MMM-Shelly-PM",{
	// Default module config.
	defaults: {
		//Just a mock API I used for development
		ShellyApiPath: "http://www.mocky.io/v2/5e9999183300003e267b2744",
		RefreshInterval: 30000,
		displayUpdated: true,
		horizontalView: true
	},
	// Initialize data after startup
	ShellyPDData: {
		tmp: "--",
		apower: "--",
		updated: "--"
	},
	getStyles: function () {
		return ["MMM-Shelly-PM.css"]; //, "font-awesome.css"];
	},
	start: function() {
		var self = this;

		// Schedule update timer.
		setInterval(function() {
			self.sendSocketNotification("GetShelly", self.config.ShellyApiPath);
			self.updateDom();
		}, this.config.RefreshInterval);

	},
	socketNotificationReceived: function (notification, payload) {
		if (notification = "ShellyPDData"){
			// Log.log(this.name + " received a socket notification: " + notification + " - Temp: " + payload.tmp + " Hum: " + payload.hum + "Updated: " + payload.updated);
			this.ShellyPDData.tmp = payload.tmp
			this.ShellyPDData.apower = payload.apower
			this.ShellyPDData.updated = payload.updated
		}
	},
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		var apower = this.translate("APOWER")
		var tmp = this.translate("TEMPERATURE", {"tmp": this.ShellyPDData.tmp});
		var updated = this.translate("UPDATED", {"upd": this.ShellyPDData.updated})
		ihtml =  "<div class='container'>"
		if (this.config.horizontalView) {
			ihtml += "  <div class='right'><sup>" + apower + "</sup> " + this.ShellyPDData.apower + " Watt</div>"
		} else {
			ihtml += "  <div class='newline'><sup>" + apower + "</sup>" + this.ShellyPDData.apower + " Watt</div>"
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
			en: 'translations/en.json',
			de: 'translations/de.json',
		};
	}
});
