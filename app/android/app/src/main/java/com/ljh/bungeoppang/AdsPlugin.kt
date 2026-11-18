package com.ljh.bungeoppang

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/** JS side: Capacitor.Plugins.Ads.interstitial() -> {shown}, Capacitor.Plugins.Ads.rewarded() -> {rewarded} */
@CapacitorPlugin(name = "Ads")
class AdsPlugin : Plugin() {
    override fun load() { activity.runOnUiThread { AdManager.start(activity) } }

    @PluginMethod
    fun interstitial(call: PluginCall) = activity.runOnUiThread {
        AdManager.showInterstitial(activity) { call.resolve(JSObject().put("shown", it)) }
    }

    @PluginMethod
    fun rewarded(call: PluginCall) = activity.runOnUiThread {
        AdManager.showRewarded(activity) { call.resolve(JSObject().put("rewarded", it)) }
    }
}
