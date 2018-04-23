import { Navigation } from 'react-native-navigation';
import AuthLogin from './src/screens/auth/authLogin';
import SignUp from './src/screens/signup/Signup';
import Timeline from './src/screens/timeline/Timeline';
import Profile from './src/screens/profile/Profile';
import CreatePost from './src/screens/createPost/CreatePost';
import SplashScreen from './src/screens/splashScreen/SplashScreen';
import Settings from './src/screens/settings/Settings';
import Reauthenticate from './src/screens/reauthenticate/Reauthenticate';
import ForgotPassword from './src/screens/forgotPassword/ForgotPassword';
import Timeline1 from './src/screens/timeline/Timeline1';
import Search from './src/screens/search/Search';
import FriendProfile from './src/screens/friendProfile/FriendProfile';

// Register Screens

Navigation.registerComponent('mmu_social.AuthLogin', () => AuthLogin);
Navigation.registerComponent('mmu_social.SignUp', () => SignUp);
Navigation.registerComponent('mmu_social.Timeline', () => Timeline);
Navigation.registerComponent('mmu_social.Profile', () => Profile);
Navigation.registerComponent('mmu_social.CreatePost', () => CreatePost);
Navigation.registerComponent('mmu_social.SplashScreen', () => SplashScreen);
Navigation.registerComponent('mmu_social.Settings', () => Settings);
Navigation.registerComponent('mmu_social.Reauthenticate', () => Reauthenticate);
Navigation.registerComponent('mmu_social.ForgotPassword', () => ForgotPassword);
Navigation.registerComponent('mmu_social.Timeline1', () => Timeline1);
Navigation.registerComponent('mmu_social.Search', () => Search);
Navigation.registerComponent('mmu_social.FriendProfile', () => FriendProfile);

// Start app

 /* Navigation.startTabBasedApp({
    tabs: [
      {
        screen: 'mmu_social.Timeline',
        label: 'Timeline',
        title: 'Timeline'
      },
      {
        screen: 'mmu_social.Profile',
        label: 'Profile',
        title: 'Profile'
      }
    ]
  });*/

Navigation.startSingleScreenApp({
  screen: {
    screen: 'mmu_social.AuthLogin',
    title: 'Login'
  }
});

