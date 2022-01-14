import MatomoTracker
import Foundation

@objc(MatomoGf)
class MatomoGf: NSObject {
    var tracker: MatomoTracker!

    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }

    @objc public func initTracker(_ url: String, id: NSNumber) {
        let baseUrl: URL? = URL(string:url)
        let siteId = id.stringValue
        guard let unwrappedBaseUrl = baseUrl else {
            return;
         }
        tracker = MatomoTracker(siteId: siteId, baseURL: unwrappedBaseUrl)
    }
    
    @objc public func setAppOptOut(_ optOut: Bool) {
        if (tracker != nil) {
            tracker.isOptedOut = optOut;
        }
    }
    
    @objc public func setUserId(_ userId: String?) {
        if (tracker != nil) {
            tracker.userId = userId
        }
    }
    
    @objc public func setCustomDimension(_ index: NSNumber, value: String?) {
            if (tracker != nil) {
                guard let unwrappedValue = value else {
                    tracker.remove(dimensionAtIndex: index.intValue)
                    return;
                 }

                if (!unwrappedValue.isEmpty) {
                  tracker.setDimension(unwrappedValue, forIndex:index.intValue)
                }
            }
        }
    
    @objc public func trackScreen(_ path: String, title: String?) {
        if (tracker != nil) {
            let views = path.components(separatedBy: "/")
            tracker.track(view: views)
        }
    }
    
    @objc public func trackEvent(_ category: String, action: String, values: NSDictionary) {
        if (tracker != nil) {
            let name = values.object(forKey: "name") as? String
            let value = values.object(forKey: "value") as? NSNumber
            let url = values.object(forKey: "url") as? String
            let nsUrl = url != nil ? URL.init(string: url!) : nil
            tracker.track(eventWithCategory: category, action: action, name: name, number: value, url: nsUrl)
        }
    }
}
