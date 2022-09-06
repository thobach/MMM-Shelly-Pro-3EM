//Include this into your config.js file
{
    module: "MMM-Shelly-PM",
    header: "Shelly-PM",
    position: "top_left",
    config: {
        //Your Shelly HT needs to have a fixed IP (or your LAN must be supporting mDNS)
        ShellyApiPath: "http://192.168.0.149/rpc/Shelly.GetStatus",
        RefreshInterval: "5000" //milliseconds
    }
}
