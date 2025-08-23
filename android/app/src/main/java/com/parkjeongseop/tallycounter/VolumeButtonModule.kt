package com.parkjeongseop.tallycounter

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class VolumeButtonModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    companion object {
        var instance: VolumeButtonModule? = null
    }
    
    init {
        instance = this
    }
    
    override fun getName(): String {
        return "VolumeButtonModule"
    }
    
    fun sendVolumeUpEvent() {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("VolumeUp", null)
    }
    
    fun sendVolumeDownEvent() {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("VolumeDown", null)
    }
}