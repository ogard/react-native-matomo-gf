# Matomo SDK for React Native

React Native wrapper for Matomo iOS and Android SDK.

Integrated SDK-s:

- [iOS SDK](https://github.com/matomo-org/matomo-sdk-ios) version 7.5.2
- [Android SDK](https://github.com/matomo-org/matomo-sdk-android) version 4.1.4

## Running project

Project setup

```shell
yarn
```

Run example app on ios:

```shell
yarn example ios
```

Run example app on android:

```shell
yarn example android
```

## Tracker Usage

Not all features are supported yet. For now you can use following features

### Init tracker

Before using any function below, the tracker must be initialized.

```javascript
Matomo.initTracker({
  url: 'https://your-matomo-domain.tld/matomo.php',
  siteId: 1,
});
```

### Set User ID

Providing the tracker with a user ID lets you connect data collected from multiple devices and multiple browsers for the same user. A user ID is typically a non empty string such as username, email address or UUID that uniquely identifies the user. The User ID must be the same for a given user across all her devices and browsers.
If user ID is used, it must be persisted locally by the app and set directly on the tracker each time the app is started.

If no user ID is used, the SDK will generate, manage and persist a random id for you.

```javascript
Matomo.setUserId('123e4567-e89b-12d3-a456-426655440000');
```

Passing `null` will delete the current user ID.

```javascript
Matomo.setUserId(null);
```

### Custom Dimensions

The Matomo SDK currently supports Custom Dimensions for the Visit Scope. Using Custom Dimensions you can add properties to the whole visit, such as "Did the user finish the tutorial?", "Is the user a paying user?" or "Which version of the Application is being used?" and such. Before sending custom dimensions please make sure Custom Dimensions are [properly installed and documented](https://matomo.org/docs/custom-dimensions/). You will need the ID of your configured Dimension.

After that you can set a new Dimension,

```javascript
Matomo.setCustomDimension({ id: 1, value: 'abc' });
```

or remove an already set dimension.

```javascript
Matomo.setCustomDimension({ id: 1, value: null });
```

Dimensions in the Visit Scope will be sent along every Page View or Event. Custom Dimensions are not persisted by the SDK and have to be re-configured upon application startup.

### Track screen views

To send a screen view set the screen path and titles on the tracker.

```javascript
Matomo.trackScreen({ path: '/your_activity', title: 'Title' });
```

### Track events

To collect data about user's interaction with interactive components of your app, like button presses or the use of a particular item in a game use trackEvent.

```javascript
Matomo.trackEvent({
  category: 'category',
  action: 'action',
  name: 'label',
  value: 1000,
});
```

### Setting App Opt Out

The MatomoTracker SDK supports opting out of tracking. Note that this flag must be set each time the app starts up and will default to false. To set the app-level opt out, use:

```javascript
Matomo.setAppOptOut(true);
```

### Track site search

To collect data about searched query in the app, use:

```javascript
Matomo.trackSearch({
  query: 'the search criteria',
  category: 'some category',
  resultCount: 10,
});
```

### Track out/download links

To collect data about outlinks:

```javascript
Matomo.trackOutlink('https://helloworld.com/news/70');
```

To collect data about download links:

```javascript
Matomo.trackDownloadLink('https://helloworld.com/files/news.pdf');
```

## Installation

```sh
npm install react-native-matomo-gf
```

## Usage

```js
import Matomo from 'react-native-matomo-gf';

Matomo.initTracker({
  url: 'https://your-matomo-domain.tld/matomo.php',
  siteId: 1,
});

Matomo.trackScreen({ path: 'Home/Requests', title: null });
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
