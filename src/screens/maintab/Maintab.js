import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Icon } from 'native-base';
import { Platform } from 'react-native';
import MMULogo from '../../assets/img/mmu.png';

const tab1 = Platform.OS === 'ios' ? {
  screen: 'mmu_social.Timeline1',
  label: 'Timeline',
  title: 'Timeline'
  } :
  {
    screen: 'mmu_social.Timeline1',
    label: 'Timeline',
    title: 'Timeline',
    icon: MMULogo
  };

const tab2 = Platform.OS === 'ios' ? {
    screen: 'mmu_social.Search',
    label: 'Search Users',
    title: 'Search Users'
  } :
  {
    screen: 'mmu_social.Search',
    label: 'Search Users',
    title: 'Search Users',
    icon: MMULogo
  };

const tab3 = Platform.OS === 'ios' ? {
    screen: 'mmu_social.Profile',
    label: 'Profile',
    title: 'Profile'
  } :
  {
    screen: 'mmu_social.Profile',
    label: 'Profile',
    title: 'Profile',
    icon: MMULogo
  };

const tab4 = Platform.OS === 'ios' ? {
    screen: 'mmu_social.Settings',
    label: 'Settings',
    title: 'Settings'
  } :
  {
    screen: 'mmu_social.Settings',
    label: 'Settings',
    title: 'Settings',
    icon: MMULogo
  };

const Maintab = () => {
  Navigation.startTabBasedApp({
    tabs: [
      tab1,
      tab2,
      tab3,
      tab4
    ]
  });
};

export default Maintab;