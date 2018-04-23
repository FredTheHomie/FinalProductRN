import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Dimensions,
  ScrollView
} from 'react-native';
import Logo from '../../components/logo/logo';
import {
  Button,
  Text,
  Form,
  Input,
  Item,
  Content,
  Container,
  Label
} from 'native-base'
import LoginForm from '../../components/form/loginForm';
import {
  validateEmail,
  validatePassword
} from "../../logic/validation/login";
import MMULogo from '../../assets/img/mmu.png';
import firebase from 'react-native-firebase';
import Snackbar from 'react-native-snackbar';
import Maintab from '../maintab/Maintab';
import {Navigation} from "react-native-navigation";

const screenWidth = Dimensions.get('window').width;

export default class AuthLogin extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      validation: false,
      emailValid: false,
      passwordValid: false,
      fromEmail: '',
      formPassword: ''
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        Maintab();
      }
    });
  }

  _handlePushToSignUp = () => {
    this.props.navigator.push({
      screen: 'mmu_social.SignUp'
    });
  };

  _handleLogin = () => {
    this.setState({validation: true});
    setTimeout(() => {
      if(this.state.emailValid === true && this.state.passwordValid === true){
        firebase.auth().signInWithEmailAndPassword(this.state.emailForm, this.state.passwordForm)
          .then(() => {
            //Maintab();
          })
          .catch(function(error) {
          //const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        });
      } else if(!this.state.emailValid){
        Snackbar.show({
          title: 'Please enter a valid Email',
          duration: Snackbar.LENGTH_SHORT
        });
      }
    }, 0);
  };

  /*_handleLogin = () => {
    Maintab();
  };*/

  _handleEmailChange = (text: string) => {
      if(validateEmail(text) === true){
        this.setState({
          emailValid: true,
          emailForm: text
        });
      }else
        this.setState({emailValid: false});
    //}
  };

  _handlePasswordChange = (text: string) => {
    //if(this.state.validation){
      if(validatePassword(text) === true){
        //this.setState({email: text});
        this.setState({
          passwordValid: true,
          passwordForm: text
        });
      }else
        this.setState({passwordValid: false});
   // }
  };

  _handleForgotPassword = () => {
    Navigation.showModal({
      screen: "mmu_social.ForgotPassword", // unique ID registered with Navigation.registerScreen
      title: "Forgot Password", // title of the screen as appears in the nav bar (optional)
      passProps: {}, // simple serializable object that will pass as props to the modal (optional)
      navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
      animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Logo
            style={styles.logo}
            source={MMULogo}
          />
          <LoginForm
            formStyle={styles.form}
            emailSuccess={this.state.emailValid !== false}
            emailError={this.state.emailValid === false && this.state.validation !== false}
            passwordSuccess={this.state.passwordValid !== false}
            passwordError={this.state.passwordValid === false && this.state.validation !== false}
            buttonStyle={styles.button}
            changeEmailState={(text) => this._handleEmailChange(text)}
            changePasswordState={(text) => this._handlePasswordChange(text)}
            onPressed={this._handleLogin}
            signUpStyle={styles.signup}
            toSignUp={this._handlePushToSignUp}
            forgotPasswordStyle={styles.forgotPassword}
            toForgotPassword={this._handleForgotPassword}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40
  },
  logo: {
    width: 180,
    height: 210
  },
  form: {
    width: screenWidth,
    marginTop: 70
  },
  button: {
    margin: 35
  },
  signup: {
    marginTop: -30
  },
  forgotPassword: {
    marginTop: -30,
    alignSelf: 'flex-end'
  }
});

