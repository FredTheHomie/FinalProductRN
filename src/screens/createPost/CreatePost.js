import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import {
  View,
  Text,
  Button,
  Icon
} from 'native-base';
import firebase from 'react-native-firebase';

export default class CreatePost extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      text: ''
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user
        });
      }
    });
  }

  _handlePostCounter = (text) => {
    this.setState({
      text: text
    });
  };

  get _postLength() {
    return 140 - this.state.text.length;
  }

  get _postLengthColor() {
    if(this._postLength > 100) {
      return 'black';
    } else if(this._postLength < 100 && this._postLength > 30) {
      return 'orange';
    } else if(this._postLength <= 30) {
      return 'red';
    }
  }

  _handleClose = () => {
    Keyboard.dismiss();
    this.props.navigator.dismissModal({
      animationType: 'slide-down'
    });
  };

  handleCreatePost = () => {
    firebase.database().ref('users/' + this.state.user.uid + '/posts').push({
      post: this.state.text,
      time: firebase.database.ServerValue.TIMESTAMP,
      likes: 0
    }).then(() => {
      this._handleClose();
    });
  };

  render(){
    return(
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={this._handleClose}>
            <Icon
              name='close'
              style={styles.close}
            />
          </TouchableOpacity>
          <TextInput
            multiline={true}
            maxLength={140}
            placeholder={'Speak your mind'}
            onChangeText={(text) => this._handlePostCounter(text)}
            autoFocus
            style={styles.input}
          />
          <Text
            style={[styles.counter, {color: this._postLengthColor}]}
          >
            {this._postLength}
          </Text>
          <Button
            style={styles.button}
            rounded
            onPress={this.handleCreatePost}
          >
            <Text>Send</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  wrapper: {
    height: '55%',
    width: '90%',
    paddingTop: 5
  },
  input: {
    height: '40%',
    width: '100%',
    fontSize: 18
  },
  button: {
    alignSelf: 'flex-end',
    bottom: 0,
    position: 'absolute'
  },
  counter: {
    alignSelf: 'flex-end',
    bottom: 0,
    position: 'absolute',
    marginBottom: 50
  },
  close: {
    alignSelf: 'flex-end'
  }
});