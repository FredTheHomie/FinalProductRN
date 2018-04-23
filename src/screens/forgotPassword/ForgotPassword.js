import React, { Component } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
  View,
  H1,
  Icon,
  Input,
  Item,
  Label,
  Content,
  Button,
  Text
} from 'native-base';
import {
  validateEmail
} from "../../logic/validation/login";
import firebase from 'react-native-firebase';
import Snackbar from 'react-native-snackbar';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      email: null,
      validation: false,
      emailValid: false
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: user
        });
      }
    });
  }

  _handleClose = () => {
    Keyboard.dismiss();
    this.props.navigator.dismissModal({
      animationType: 'slide-down'
    });
  };

  _handleEmailChange = (text: string) => {
    if(validateEmail(text) === true) {
      this.setState({
        email: text,
        emailValid: true
      });
    } else
      this.setState({emailValid: false});
  };

  _handleAuth = () => {
    /*const credential = firebase.auth.EmailAuthProvider.credential(this.state.currentUser.email, this.state.password);

    firebase.auth().currentUser.reauthenticateWithCredential(credential).then(() => {
      this._handleClose();
    }).catch((err) => {
      alert(err);
    });*/
    /*firebase.auth().signInWithEmailAndPassword(this.state.currentUser.email, this.state.email)
      .then(() => {
        this._handleClose();
      })
      .catch(function(error) {
        //const errorCode = error.code;
        alert(error);
      });*/
    const ref = firebase.auth();

    this.setState({validation: true});
    setTimeout(() => {
      if(this.state.emailValid === true){
        ref.sendPasswordResetEmail(this.state.email).then(() => {
          alert('done')
        }).catch((err) => {
          alert(err);
        });
      } else {
        Snackbar.show({
          title: 'Please enter a valid Email',
          duration: Snackbar.LENGTH_SHORT
        });
      }
    }, 0);
  };

  render() {
    return(
      <ScrollView style={styles.background}>
        <TouchableOpacity onPress={this._handleClose}>
          <Icon
            name='close'
            style={styles.close}
          />
        </TouchableOpacity>
        <View style={styles.heading}>
          <H1> Please Enter Email </H1>
        </View>
        <Item stackedLabel>
          <Icon name='mail' />
          <Label> Email </Label>
          <Input
            autoFocus
            onChangeText={(text) => this._handleEmailChange(text)}
            error={this.state.emailValid !== true && this.state.validation}
          />
        </Item>
        <View>
          <Button block style={styles.button} onPress={this._handleAuth}>
            <Text>Update Password</Text>
          </Button>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  heading: {
    alignItems: 'center',
    opacity: .5,
    marginBottom: 15
  },
  close: {
    alignSelf: 'flex-end',
    marginRight: '10%',
    marginTop: 20
  },
  button: {
    marginTop: 20
  },
  background: {
    backgroundColor: 'white'
  }
});