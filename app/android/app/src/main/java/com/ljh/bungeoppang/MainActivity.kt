package com.ljh.bungeoppang

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(AdsPlugin::class.java)   // must come before super.onCreate
        registerPlugin(BillingPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
