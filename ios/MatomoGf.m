#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MatomoGf, NSObject)

+(BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXTERN_METHOD(multiply:(float)a
                  withB:(float)b
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(initTracker:(NSString*)url id:(NSNumber* _Nonnull)id)

RCT_EXTERN_METHOD(setAppOptOut:(BOOL _Nonnull) optOut)

RCT_EXTERN_METHOD(setUserId:(NSString? _Nullable)userId)

RCT_EXTERN_METHOD(setCustomDimension:(NSNumber* _Nonnull)index value:(NSString? _Nullable)value)

RCT_EXTERN_METHOD(trackScreen:(NSString* _Nonnull)path title:(NSString* _Nullable)title)

RCT_EXTERN_METHOD(trackEvent:(NSString* _Nonnull)category
                  action:(NSString* _Nonnull)action
                  values:(NSDictionary* _Nonnull)values
                  )

RCT_EXTERN_METHOD(trackSearch:(NSString* _Nonnull)query values:(NSDictionary* _Nonnull)values)

RCT_EXTERN_METHOD(trackOutlink:(NSString* _Nonnull)url)

RCT_EXTERN_METHOD(trackDownloadLink:(NSString* _Nonnull)url)

@end
