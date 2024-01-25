Module.register("MMM-Shelly-Pro-3EM",{
	
	// Default module config.
	defaults: {
		displayUpdated: true,
		horizontalView: true,
		negativeDisplay: false
	},
	
	// Initialize data after startup
	shellyData: {
		apower: "--",
		updated: "--",
		total: "--"
	},
	
	getStyles: function () {
		return ["MMM-Shelly-Pro-3EM.css"];
	},
	
	start: function() {
		var self = this;
		var getShellyData = function(){
			var payload = {
				uri: self.config.shellyURLAndPath
			};
			self.sendSocketNotification("GetShellyData", payload);
		};
		getShellyData();
		setInterval(getShellyData,this.config.refreshInterval);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification == "ShellyData"){
			this.shellyData.apower = payload.apower;
			this.shellyData.total = payload.apowertoday;
			this.shellyData.updated = payload.updated;
		}
		this.updateDom();
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		var apower = this.translate("APOWER");
		var totalday = this.translate("TOTALDAY");
		if (this.config.negativeDisplay && this.shellyData.apower > 0) {
			var apower_unit = this.translate("APOWER_UNIT", {"apower": -Math.round(this.shellyData.apower)});
			var csstype = "generation"
		} else {
			var apower_unit = this.translate("APOWER_UNIT", {"apower": Math.round(this.shellyData.apower)});
			var csstype = "consumption"
		}

		if (this.config.negativeDisplay && this.shellyData.total > 0) {
			var total_unit = this.translate("TOTALDAY_UNIT", {"apower": -Math.round(this.shellyData.total)})
			var totalcsstype = "generation"
		} else {
			var total_unit = this.translate("TOTALDAY_UNIT", {"apower": Math.round(this.shellyData.total)})
			var totalcsstype = "consumption"
		}

		var updated = this.translate("UPDATED", {"upd": this.shellyData.updated})
		ihtml =  "<div class='container'>"
		if (this.config.horizontalView) {
			ihtml += "  <div class='right " + csstype + "'><sup>" + apower + "</sup> " + apower_unit + "</div>"
			ihtml += "  <div class='newline right " + totalcsstype + "'><sup>" + totalday + "</sup> " + total_unit + "</div>"
		} else {
			ihtml += "  <div class='newline " + csstype + "'><sup>" + apower + "</sup>" + apower_unit + "</div>"
			ihtml += "  <div class='newline " + totalcsstype + "'><sup>" + totalday + "</sup> " + total_unit + "</div>"
		}
		if (this.config.displayUpdated){
			ihtml += "  <p class='bottom'>" + updated + "</p>"
		}
		ihtml += "</div><div class='newline'></div>"
		wrapper.innerHTML = ihtml
		return wrapper
	},
	
	getTranslations: function() {
	        return  {
				en: 'translations/en.json',
				de: 'translations/de.json',
			};
		}
	}
);
