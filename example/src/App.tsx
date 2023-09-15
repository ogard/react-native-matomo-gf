import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import {
  multiply,
  trackSearch,
  initTracker,
  setCustomDimension,
  trackDownloadLink,
  trackOutlink,
  trackScreen,
} from 'react-native-matomo-gf';

const siteId = 1;
const url = 'https://your-matomo-domain.tld/matomo.php';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(9, 10).then(setResult);
    initTracker({ url, siteId });
    setCustomDimension({ id: 6, value: 'APP' });
    setCustomDimension({ id: 7, value: 'en' });
    trackScreen({ path: 'entry', title: 'Entry' });
    trackScreen({ path: 'search', title: 'Hotel Search' });
    trackSearch({
      query: '', // event shouldn't be tracked, because mandatory field is an empty string
      category: 'Hotel Search',
      resultCount: null,
      url: 'search', // important to pass on iOS in order to preserve last screen path
    });
    trackSearch({
      query: 'Search keyword 1',
      category: 'Hotel Search',
      resultCount: null,
      url: 'search', // important to pass on iOS in order to preserve last screen path
    });
    trackSearch({
      query: 'Search keyword 2',
      category: 'Hotel Search',
      resultCount: null,
      url: 'search', // important to pass on iOS in order to preserve last screen path
    });
    trackScreen({ path: 'hotel-jungbrunn', title: 'Hotel Jungbrunn' });
    trackDownloadLink('https://b2c.api.dev.gastfreund.net/somefile.zip');
    trackOutlink('https://helloworld.com/news/70');
    trackScreen({ path: 'hotel-jungbrunn/23456', title: 'Hello world' });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
