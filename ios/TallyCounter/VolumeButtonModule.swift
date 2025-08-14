import Foundation
import UIKit
import AVFoundation
import MediaPlayer
import React

@objc(VolumeButtonModule)
class VolumeButtonModule: RCTEventEmitter {
  private var audioSession: AVAudioSession?
  private var volumeView: MPVolumeView?
  private var initialVolume: Float = 0.5
  private var isObserving = false
  
  override init() {
    super.init()
    setupVolumeObserver()
  }
  
  private func setupVolumeObserver() {
    do {
      audioSession = AVAudioSession.sharedInstance()
      try audioSession?.setCategory(.playback, options: .mixWithOthers)
      try audioSession?.setActive(true)
      
      volumeView = MPVolumeView(frame: CGRect.zero)
      volumeView?.isHidden = true
      
      if let window = UIApplication.shared.windows.first {
        window.addSubview(volumeView!)
      }
      
      initialVolume = audioSession?.outputVolume ?? 0.5
      
      audioSession?.addObserver(self, forKeyPath: "outputVolume", options: [.new, .old], context: nil)
      isObserving = true
    } catch {
      print("Failed to setup audio session: \(error)")
    }
  }
  
  override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if keyPath == "outputVolume" {
      if let newVolume = change?[.newKey] as? Float,
         let oldVolume = change?[.oldKey] as? Float {
        
        DispatchQueue.main.async { [weak self] in
          if newVolume > oldVolume {
            self?.sendEvent(withName: "VolumeUp", body: nil)
          } else if newVolume < oldVolume {
            self?.sendEvent(withName: "VolumeDown", body: nil)
          }
          
          self?.resetVolume()
        }
      }
    }
  }
  
  private func resetVolume() {
    if let slider = volumeView?.subviews.first(where: { $0 is UISlider }) as? UISlider {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.01) {
        slider.value = 0.5
      }
    }
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func supportedEvents() -> [String]! {
    return ["VolumeUp", "VolumeDown"]
  }
  
  deinit {
    if isObserving {
      audioSession?.removeObserver(self, forKeyPath: "outputVolume")
    }
    volumeView?.removeFromSuperview()
  }
}