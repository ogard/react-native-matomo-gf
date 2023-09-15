import { NativeModules, Platform } from 'react-native';

const guardEmptyString = (strValue: string | null | undefined): null | string =>
  strValue != null && strValue.length > 0 ? strValue : null;

const LINKING_ERROR =
  `The package 'react-native-matomo-gf' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const MatomoGf = NativeModules.MatomoGf
  ? NativeModules.MatomoGf
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Example function
 *
 * @param a First value
 * @param b Second value
 * @returns Promise of the result
 */
export const multiply = (a: number, b: number): Promise<number> => {
  return MatomoGf.multiply(a, b);
};

/**
 * Initialize the tracker - first method that needs to be invoked.
 *
 * @param params        The argument of the function
 * @param params.url    Tracking HTTP API endpoint, for example, https://matomo.yourdomain.tld/matomo.php
 * @param params.siteId id of your site in the backend
 */
export const initTracker = ({
  url,
  siteId,
}: {
  url: string;
  siteId: number;
}): void => {
  MatomoGf.initTracker(url, siteId);
};

/**
 * Use this to disable this Tracker, e.g. if the user opted out of tracking.
 * The Tracker will persist the choice and remain disable on next instance creation.<p>
 *
 * @param optOut true to disable reporting
 */
export const setAppOptOut = (optOut: boolean): void => {
  MatomoGf.setAppOptOut(optOut);
};

/**
 * Defines the User ID for this request.
 * User ID is any non empty unique string identifying the user (such as an email address or a username).
 * To access this value, users must be logged-in in your system so you can
 * fetch this user ID from your system, and pass it to Matomo.
 * <p>
 * When specified, the User ID will be "enforced".
 * This means that if there is no recent visit with this User ID, a new one will be created.
 * If a visit is found in the last 30 minutes with your specified User ID,
 * then the new action will be recorded to this existing visit.
 *
 * @param userId passing null will delete the current user-id.
 */
export const setUserId = (userId: null | string): void => {
  MatomoGf.setUserId(userId);
};

/**
 * Custom dimension per screen.
 * Requires <a href="https://plugins.matomo.org/CustomDimensions">Custom Dimensions</a> plugin (server-side)
 *
 * @param params         The argument of the function
 * @param params.id      accepts values greater than 0
 * @param params.value   is limited to 255 characters, you can pass null to delete a value
 */
export const setCustomDimension = ({
  id,
  value,
}: {
  id: number;
  value: null | string;
}): void => {
  MatomoGf.setCustomDimension(id, value);
};

/**
 * To track a screenview.
 *
 * @param params The argument of the function
 * @param params.path  Example: "/user/settings/billing"
 * @param params.title Example: Help / Feedback will create the Action Feedback in the category Help.
 *                     The title of the action being tracked. It is possible to use slashes / to set one or several categories for this action.
 */
export const trackScreen = ({
  path,
  title,
}: {
  path: string;
  title: null | string;
}): void => {
  MatomoGf.trackScreen(path, title);
};

/**
 * Events are a useful way to collect data about a user's interaction with interactive components of your app,
 * like button presses or the use of a particular item in a game.
 *
 * @param params          The argument of the function
 * @param params.category (required) this String defines the event category.
 *                        You might define event categories based on the class of user actions,
 *                        like clicks or gestures or voice commands, or you might define them based upon the
 *                        features available in your application (play, pause, fast forward, etc.).
 * @param params.action   (required) this String defines the specific event action within the category specified.
 *                        In the example, we are basically saying that the category of the event is user clicks,
 *                        and the action is a button click.
 * @param params.name     (optional) Defines a label associated with the event.
 *                        For example, if you have multiple Button controls on a screen, you might use the label to specify the specific View control identifier that was clicked.
 * @param params.value    (optional) Defines a numeric value associated with the event.
 *                        For example, if you were tracking "Buy" button clicks, you might log the number of items being purchased, or their total cost.
 * @param params.url      (optional) The path under which this event occurred. Example: "/user/settings/billing".
 *                        If you pass NULL, on Android the last path set by #trackScreenView will be used, on iOS the bundle id will be used
 */
export const trackEvent = ({
  category,
  action,
  name,
  value,
  url,
}: {
  category: string;
  action: string;
  name: null | string;
  value: null | number;
  url: null | string;
}): void => {
  const eventCategory = guardEmptyString(category);
  const eventAction = guardEmptyString(action);

  if (eventCategory !== null && eventAction !== null) {
    const eventName = guardEmptyString(name);
    const eventUrl = guardEmptyString(url);

    MatomoGf.trackEvent(category, action, {
      name: eventName,
      value,
      url: eventUrl,
    });
  }
};

/**
 * Tracks an site search
 *
 * @param params               The argument of function
 * @param params.query         (required) Searched query in the app
 * @param params.category      (optional) You can optionally specify a search category with this parameter.
 * @param params.resultCount   (optional) We recommend to set the search count to the number of search results displayed on the results page. When keywords are tracked with a count of 0, they will appear in the "No Result Search Keyword" report
 * @param params.url           (optional) The path under which this event occurred. Example: "/user/settings/billing"
 *                             If you pass NULL, on Android the last path set by #trackScreenView will be used, on iOS the bundle id will be used
 */
export const trackSearch = ({
  query,
  category,
  resultCount,
  url,
}: {
  query: string;
  category: null | string;
  resultCount: null | number;
  url: null | string;
}): void => {
  const eventQuery = guardEmptyString(query);

  if (eventQuery) {
    const eventCategory = guardEmptyString(category);
    const eventUrl = guardEmptyString(url);

    MatomoGf.trackSearch(query, {
      category: eventCategory,
      resultCount,
      url: eventUrl,
    });
  }
};

/**
 * Track download url
 *
 * @param url  (required) The url of the download file
 */
export const trackDownloadLink = (url: string) => {
  const eventUrl = guardEmptyString(url);

  if (eventUrl) {
    MatomoGf.trackDownloadLink(url);
  }
};

/**
 * Track outlink
 *
 * @param url  (required) The url of the outlink
 */
export const trackOutlink = (url: string) => {
  const eventUrl = guardEmptyString(url);

  if (eventUrl) {
    MatomoGf.trackOutlink(eventUrl);
  }
};

/**
 * Sends a download event for this app.
 * This only triggers an event once per app version unless you force it.
 */
export const trackAppDownload: () => void = MatomoGf.trackAppDownload;

export default {
  initTracker,
  setAppOptOut,
  setUserId,
  setCustomDimension,
  trackScreen,
  trackEvent,
  trackSearch,
  trackOutlink,
  trackDownloadLink,
  trackAppDownload,
};
