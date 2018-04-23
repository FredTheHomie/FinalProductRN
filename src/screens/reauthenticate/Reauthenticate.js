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
import firebase from 'react-native-firebase';

export default class Reauthenticate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      password: null,
      error: false
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

  _handlePasswordChange = (text: string) => {
    this.setState({
      password: text
    });
  };

  _handleAuth = () => {
    /*const credential = firebase.auth.EmailAuthProvider.credential(this.state.currentUser.email, this.state.password);

    firebase.auth().currentUser.reauthenticateWithCredential(credential).then(() => {
      this._handleClose();
    }).catch((err) => {
      alert(err);
    });*/
    firebase.auth().signInWithEmailAndPassword(this.state.currentUser.email, this.state.password)
      .then(() => {
        this._handleClose();
      })
      .catch(function(error) {
        //const errorCode = error.code;
        alert(error);
      });
  };

  render() {
    return(
      <ScrollView>
        <TouchableOpacity onPress={this._handleClose}>
          <Icon
            name='close'
            style={styles.close}
          />
        </TouchableOpacity>
        <View style={styles.heading}>
          <H1> Please Re-Authenticate </H1>
        </View>
          <Item stackedLabel error={this.state.error}>
            <Icon name='lock' />
            <Label> Password </Label>
            <Input
              autoFocus
              onChangeText={(text) => this._handlePasswordChange(text)}
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
  }
});