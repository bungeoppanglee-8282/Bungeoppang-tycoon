package com.ljh.bungeoppang

import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.ConsumeParams
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * Google Play Billing for one-time items. JS side: js/iap.js
 *   setup({ids})            -> {prices:{id:"₩2,200"}, owned:[{id,token,acked}]}   (owned = paid but not yet delivered)
 *   buy({id})               -> {id,token,acked}   rejects with code cancel | pending | fail
 *   finish({token,consume}) -> consume (packs) or acknowledge (permanent items); call only after the game saved the grant
 * Not compiled in the authoring environment (no Android SDK): if Android Studio flags a line, check it against the Billing 8 docs.
 */
@CapacitorPlugin(name = "Billing")
class BillingPlugin : Plugin() {
    private val details = HashMap<String, ProductDetails>()
    private var buyCall: PluginCall? = null

    private val client: BillingClient by lazy {
        BillingClient.newBuilder(context)
            .setListener { result, purchases -> onPurchases(result, purchases) }
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .enableAutoServiceReconnection()
            .build()
    }

    @PluginMethod
    fun setup(call: PluginCall) {
        val ids = call.getArray("ids").toList<String>()
        if (client.isReady) return load(call, ids)
        client.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(r: BillingResult) {
                if (r.responseCode == BillingClient.BillingResponseCode.OK) load(call, ids) else call.reject(r.debugMessage, "fail")
            }
            override fun onBillingServiceDisconnected() {}   // auto-reconnect is on
        })
    }

    private fun load(call: PluginCall, ids: List<String>) {
        val products = ids.map {
            QueryProductDetailsParams.Product.newBuilder().setProductId(it).setProductType(BillingClient.ProductType.INAPP).build()
        }
        client.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(products).build()) { r, res ->
            if (r.responseCode != BillingClient.BillingResponseCode.OK) return@queryProductDetailsAsync call.reject(r.debugMessage, "fail")
            val prices = JSObject()
            for (d in res.productDetailsList) {
                details[d.productId] = d
                d.oneTimePurchaseOfferDetails?.let { prices.put(d.productId, it.formattedPrice) }
            }
            client.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build()) { _, list ->
                val owned = JSArray()
                list.filter { it.purchaseState == Purchase.PurchaseState.PURCHASED }.forEach { owned.put(asJs(it)) }
                call.resolve(JSObject().put("prices", prices).put("owned", owned))
            }
        }
    }

    @PluginMethod
    fun buy(call: PluginCall) {
        val d = details[call.getString("id")] ?: return call.reject("unknown item", "fail")
        if (buyCall != null) return call.reject("busy", "fail")
        buyCall = call
        val p = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(d).build()
        val r = client.launchBillingFlow(activity, BillingFlowParams.newBuilder().setProductDetailsParamsList(listOf(p)).build())
        if (r.responseCode != BillingClient.BillingResponseCode.OK) { buyCall = null; call.reject(r.debugMessage, "fail") }
    }

    private fun onPurchases(r: BillingResult, purchases: List<Purchase>?) {
        val call = buyCall ?: return   // updates with no open buy (e.g. a pending payment finishing later) are picked up by setup() on the next start
        buyCall = null
        when (r.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                val p = purchases?.firstOrNull { it.purchaseState == Purchase.PurchaseState.PURCHASED }
                if (p != null) call.resolve(asJs(p)) else call.reject("pending", "pending")
            }
            BillingClient.BillingResponseCode.USER_CANCELED -> call.reject("cancel", "cancel")
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> call.reject("owned", "owned")   // paid earlier, not delivered yet: JS re-runs setup()
            else -> call.reject(r.debugMessage, "fail")
        }
    }

    @PluginMethod
    fun finish(call: PluginCall) {
        val token = call.getString("token") ?: return call.reject("no token", "fail")
        val done = { r: BillingResult -> if (r.responseCode == BillingClient.BillingResponseCode.OK) call.resolve() else call.reject(r.debugMessage, "fail") }
        if (call.getBoolean("consume") == true)
            client.consumeAsync(ConsumeParams.newBuilder().setPurchaseToken(token).build()) { r, _ -> done(r) }
        else
            client.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(token).build()) { r -> done(r) }
    }

    private fun asJs(p: Purchase) = JSObject().put("id", p.products.first()).put("token", p.purchaseToken).put("acked", p.isAcknowledged)
}
