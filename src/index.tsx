import { NativeModules, Platform } from 'react-native';

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
 * @param url    Tracking HTTP API endpoint, for example, https://matomo.yourdomain.tld/matomo.php
 * @param siteId id of your site in the backend
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
 * @param id             accepts values greater than 0
 * @param value is limited to 255 characters, you can pass null to delete a value
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
 * @param path  Example: "/user/settings/billing"
 * @param title Example: Help / Feedback will create the Action Feedback in the category Help.
 *              The title of the action being tracked. It is possible to use slashes / to set one or several categories for this action.
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
 * @param category (required) this String defines the event category.
 *                 You might define event categories based on the class of user actions,
 *                 like clicks or gestures or voice commands, or you might define them based upon the
 *                 features available in your application (play, pause, fast forward, etc.).
 * @param action   (required) this String defines the specific event action within the category specified.
 *                 In the example, we are basically saying that the category of the event is user clicks,
 *                 and the action is a button click.
 * @param name     (optional) Defines a label associated with the event.
 *                 For example, if you have multiple Button controls on a screen, you might use the label to specify the specific View control identifier that was clicked.
 * @param value    (optional) Defines a numeric value associated with the event.
 *                 For example, if you were tracking "Buy" button clicks, you might log the number of items being purchased, or their total cost.
 * @param path     (optional) The path under which this event occurred.
 *                 Example: "/user/settings/billing", if you pass NULL, the last path set by #trackScreenView will be used.
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
  MatomoGf.trackEvent(category, action, { name, value, url });
};

export default {
  initTracker,
  setAppOptOut,
  setUserId,
  setCustomDimension,
  trackScreen,
  trackEvent,
};
