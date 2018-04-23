import React from 'react';
import {
  View,
  Image} from 'react-native';

const Logo = props => (
  <View>
    <Image
      style={props.style}
      source={props.source}
    />
  </View>
);

export default Logo;