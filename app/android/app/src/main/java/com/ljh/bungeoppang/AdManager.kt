package com.ljh.bungeoppang

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.RequestConfiguration
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform

/** Loads one interstitial and one rewarded ad ahead of time; every call must run on the main thread. */
object AdManager {
    private const val INTERSTITIAL_GAP_MS = 120_000L   // shortcut: fixed gap between interstitials, tune after seeing retention
    private var interstitial: InterstitialAd? = null
    private var rewarded: RewardedAd? = null
    private var lastInterstitial = 0L
    private var started = false

    fun start(activity: Activity) {
        if (started) return
        started = true
        val ump = UserMessagingPlatform.getConsentInformation(activity)
        // EEA/UK consent form; outside those regions this finishes at once with no UI.
        ump.requestConsentInfoUpdate(activity, ConsentRequestParameters.Builder().build(), {
            UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { initAds(activity) }
        }, { initAds(activity) })
    }

    private fun initAds(ctx: Context) {
        // target age 13+ (Play Console too): not child-directed, ads up to teen rating
        MobileAds.setRequestConfiguration(MobileAds.getRequestConfiguration().toBuilder()
            .setTagForChildDirectedTreatment(RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_FALSE)
            .setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_T).build())
        MobileAds.initialize(ctx) { loadInterstitial(ctx); loadRewarded(ctx) }
    }

    private fun loadInterstitial(ctx: Context) {
        InterstitialAd.load(ctx, BuildConfig.AD_INTERSTITIAL, AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) { interstitial = ad }
                override fun onAdFailedToLoad(e: LoadAdError) { interstitial = null }
            })
    }

    private fun loadRewarded(ctx: Context) {
        RewardedAd.load(ctx, BuildConfig.AD_REWARDED, AdRequest.Builder().build(),
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) { rewarded = ad }
                override fun onAdFailedToLoad(e: LoadAdError) { rewarded = null }
            })
    }

    /** done(true) only if an ad was actually shown. */
    fun showInterstitial(activity: Activity, done: (Boolean) -> Unit) {
        val ad = interstitial
        if (ad == null || System.currentTimeMillis() - lastInterstitial < INTERSTITIAL_GAP_MS) {
            if (ad == null) loadInterstitial(activity)
            return done(false)
        }
        interstitial = null
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() { lastInterstitial = System.currentTimeMillis(); loadInterstitial(activity); done(true) }
            override fun onAdFailedToShowFullScreenContent(e: AdError) { loadInterstitial(activity); done(false) }
        }
        ad.show(activity)
    }

    /** done(true) only if the player earned the reward (watched to the end). */
    fun showRewarded(activity: Activity, done: (Boolean) -> Unit) {
        val ad = rewarded
        if (ad == null) { loadRewarded(activity); return done(false) }
        rewarded = null
        var earned = false
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() { loadRewarded(activity); done(earned) }
            override fun onAdFailedToShowFullScreenContent(e: AdError) { loadRewarded(activity); done(false) }
        }
        ad.show(activity) { earned = true }
    }
}
