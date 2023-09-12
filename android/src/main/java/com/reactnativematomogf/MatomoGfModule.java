package com.reactnativematomogf;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ReadableMap;

import org.matomo.sdk.Matomo;
import org.matomo.sdk.QueryParams;
import org.matomo.sdk.Tracker;
import org.matomo.sdk.TrackerBuilder;
import org.matomo.sdk.extra.TrackHelper;
import org.matomo.sdk.TrackMe;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@ReactModule(name = MatomoGfModule.NAME)
public class MatomoGfModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private static final String TAG = Matomo.tag(MatomoGfModule.class);
    public static final String NAME = "MatomoGf";
    private @Nullable Tracker mMatomoTracker;
    private static final Map<Integer, String> customDimensions = new HashMap<>();

  public MatomoGfModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void multiply(int a, int b, Promise promise) {
        promise.resolve(a * b);
    }

    public static native int nativeMultiply(int a, int b);

    @ReactMethod
    public void initTracker(@NonNull String url, int siteId) {
      TrackerBuilder builder = TrackerBuilder.createDefault(url, siteId);
      mMatomoTracker = builder.build(Matomo.getInstance(getReactApplicationContext()));
    }

    private @Nullable TrackHelper getTrackHelper() {
      if (mMatomoTracker == null) {
        return null;
      }

      TrackHelper trackHelper = TrackHelper.track();
      for(Map.Entry<Integer, String> entry : customDimensions.entrySet()){
        trackHelper = trackHelper.dimension(entry.getKey(), entry.getValue());
      }
      return trackHelper;
    }

    @ReactMethod
    public void setAppOptOut(Boolean isOptedOut) {
      if (mMatomoTracker == null) {
        return;
      }

      mMatomoTracker.setOptOut(isOptedOut);
    }

    @ReactMethod
    public void setUserId(@Nullable String userId) {
      if (mMatomoTracker == null) {
        return;
      }

      mMatomoTracker.setUserId(userId);
    }

    @ReactMethod
    public void setCustomDimension(int id, @Nullable String value){
      if (mMatomoTracker == null) {
        return;
      }

      if(value == null) {
        customDimensions.remove(id);
        return;
      }

      if (value.length() != 0) {
        customDimensions.put(id, value);
      }
    }

    @ReactMethod
    public void trackScreen(@NonNull String screen, @Nullable String title) {
      if (mMatomoTracker == null) {
        return;
      }

      @Nullable TrackHelper trackHelper = getTrackHelper();

      if (trackHelper == null) {
        return;
      }

      trackHelper.screen(screen).title(title).with(mMatomoTracker);
    }

    @ReactMethod
    public void trackEvent(@NonNull String category, @NonNull String action, ReadableMap values) {
      if (mMatomoTracker == null) {
        return;
      }

      String name = null;
      Float value = null;
      String url = null;
      if (values.hasKey("name") && !values.isNull("name")) {
        name = values.getString("name");
      }
      if (values.hasKey("value") && !values.isNull("value")) {
        value = (float)values.getDouble("value");
      }
      if (values.hasKey("url") && !values.isNull("url")) {
        url = values.getString("url");
      }

      TrackHelper trackHelper = getTrackHelper();

      if (trackHelper == null) {
        return;
      }

      trackHelper.event(category, action).name(name).value(value).path(url).with(mMatomoTracker);
    }

    @ReactMethod
    public void trackSearch(@NonNull String query, @NonNull ReadableMap values) {
      if (mMatomoTracker == null) {
        return;
      }

      String category = null;
      int resultCount = 0;
      if (values.hasKey("category") && !values.isNull("category")) {
        category = values.getString("category");
      }
      if (values.hasKey("resultCount") && !values.isNull("resultCount")) {
        resultCount = values.getInt("resultCount");
      }

      TrackHelper trackHelper = getTrackHelper();

      if (trackHelper == null) {
        return;
      }

      trackHelper.search(query).category(category).count(resultCount).with(mMatomoTracker);
    }

  @ReactMethod
  public void trackOutlink(@NonNull String url) {
    if (mMatomoTracker == null) {
      return;
    }

    TrackHelper trackHelper = getTrackHelper();

    if (trackHelper == null) {
      return;
    }

    try {
      URL urlObject = new URL(url);

      trackHelper.outlink(urlObject).with(mMatomoTracker);
    } catch (Exception e) {
      Log.e(TAG, "Unable to parse url in trackOutlink");
    }
  }

  @ReactMethod
  public void trackDownloadLink(@NonNull String url) {
    if (mMatomoTracker == null) {
      return;
    }


    TrackHelper trackHelper = TrackHelper.track(new TrackMe().set(QueryParams.DOWNLOAD, url));
    for(Map.Entry<Integer, String> entry : customDimensions.entrySet()){
      // preserve existing custom dimensions
      trackHelper = trackHelper.dimension(entry.getKey(), entry.getValue());
    }

    try {
      URL urlObject = new URL(url);

      // use outlink tracking to track download link (query parameter for it has been set above)
      trackHelper.outlink(urlObject).with(mMatomoTracker);
    } catch (Exception e) {
      Log.e(TAG, "Unable to parse url in trackDownloadLink");
    }
  }

    @ReactMethod
    public void trackAppDownload() {
      if (mMatomoTracker == null) {
        return;
      }

      TrackHelper trackHelper = getTrackHelper();

      if (trackHelper == null) {
        return;
      }

      trackHelper.download().with(mMatomoTracker);
    }

    @Override
    public void onHostResume() {}

    @Override
    public void onHostPause() {
      if (mMatomoTracker != null) {
        mMatomoTracker.dispatch();
      }
    }
    @Override
    public void onHostDestroy() {}
}
