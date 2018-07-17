import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  View,
  Text,
  Thumbnail,
  Fab,
  Icon,
  Item,
  Input,
  Content,
  Container,
  Label,
  Button,
  H1,
  H3
} from 'native-base';
//import LinearGradient from 'react-native-linear-gradient';
import ProfilePic from '../../assets/img/profilePic.jpg';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import Snackbar from 'react-native-snackbar';
import { Navigation } from "react-native-navigation";
import {
  validateEmail,
  validatePassword
} from "../../logic/validation/login";

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

let currentUser = null;

const uploadImage = (uri, mime = 'image/jpg') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    let uploadBlob = null;

    const imageRef = firebase.storage().ref('images').child(currentUser.uid + '/profile_pictures');

    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob;
        return imageRef.put(uri, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
      })
  })
};

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      img: null,
      firstNameForm: null,
      secondNameForm: null,
      emailValid: true,
      emailForm: null,
      passwordValid: false,
      passwordForm: null,
      secondPasswordForm: null,
      secondPasswordValid: false
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({
          currentUser: user
        });
        currentUser = user;
        this._getImage(user.uid);
        firebase.database().ref('users/' + user.uid).on('value', (dataSnapshot) => {
          //(dataSnapshot1.val().firstname);
          this.setState({
            firstNameForm: dataSnapshot.val().firstname,
            secondNameForm: dataSnapshot.val().secondname,
            emailForm: dataSnapshot.val().email
          });
        });
      }
      //alert(user.uid)
    });
  }

  _getImage(userId) {
    firebase.storage().ref('images/' + userId + '/profile_pictures')
      .getDownloadURL().then((url) => {
      this.setState({
        img: {uri: url}
      });
      //alert('yes');
    }).catch(() => {
      //alert('no')
    });
  }

  backgroundDisplay = () => {
    return this.state.img ?
      <Thumbnail
        large
        source={{uri: this.state.img.uri}}
        style={styles.dp}
      /> :
      <Thumbnail
        large
        source={ProfilePic}
        style={styles.dp}
      />;
  };

  imagePickerHandler = () => {
    ImagePicker.showImagePicker({title: 'Pick avatar'}, (res) => {
      if(res.didCancel) {

      } else {
        const source = { uri: res.uri};
        this.setState({
          img: source
        });
        //alert(this.state.img.uri.toString())
        firebase.database().ref('users/' + this.state.currentUser.uid).push({
          profilePic: this.state.img.uri.toString()
        }).then(() => {
          uploadImage(this.state.img.uri.toString());
        });
      }
    });
  };

  _handleFirstNameChange = (text: string) => {
      this.setState({
        firstNameForm: text
      });
  };

  _handleSecondNameChange = (text: string) => {
    this.setState({
      secondNameForm: text
    });
  };

  _handleUpdateName = () => {
    if(this.state.firstNameForm !== '' && this.state.secondNameForm !== '') {
      const ref = firebase.database().ref('users/' + this.state.currentUser.uid);
      //alert(this.state.currentUser.uid);
      ref.update({
        firstname: this.state.firstNameForm,
        secondname: this.state.secondNameForm
      }).then(() => {
        Snackbar.show({
          title: 'Name Updated',
          duration: Snackbar.LENGTH_SHORT
        });
      });
    }
  };

  _reuthenticate = () => {
    Navigation.showModal({
      screen: "mmu_social.Reauthenticate", // unique ID registered with Navigation.registerScreen
      title: "Reauthenticate", // title of the screen as appears in the nav bar (optional)
      passProps: {}, // simple serializable object that will pass as props to the modal (optional)
      navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
      animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  };

  _handleEmailChange = (text: string) => {
    this.setState({
      emailForm: text
    });
    if(validateEmail(text) === true){
      //this.setState({email: text});
      this.setState({
        emailValid: true
      });
    }else
      this.setState({emailValid: false});
  };

  _handlefirstPasswordChange = (text: string) => {
    this.setState({
      passwordForm: text
    });
    if(validatePassword(text) === true){
      //this.setState({email: text});
      this.setState({
        passwordValid: true
      });
    }else
      this.setState({passwordValid: false});
  };

  _handlesecondPasswordChange = (text: string) => {
    this.setState({
      secondPasswordForm: text
    });
    if(text === this.state.passwordForm){
      //this.setState({email: text});
      this.setState({
        secondPasswordValid: true
      });
    }else
      this.setState({secondPasswordValid: false});
  };

  handleEmailUpdate = () => {
    if(this.state.emailValid === true) {
      const ref = firebase.auth().currentUser;
      const refDb = firebase.database().ref('users/' + this.state.currentUser.uid);

      ref.updateEmail(this.state.emailForm).then(() => {
        refDb.update({
          email: this.state.emailForm
        }).then(() => {
          Snackbar.show({
            title: 'Email Updated',
            duration: Snackbar.LENGTH_SHORT
          });
        });
      }).catch((err) => {
        if(err.code === 'auth/requires-recent-login') {
          this._reuthenticate();
        }
      });
    }
  };

  handlePasswordUpdate = () => {
    if(this.state.passwordValid === true && this.state.secondPasswordValid === true) {
      const ref = firebase.auth().currentUser;

      ref.updatePassword(this.state.passwordForm).then(() => {
          Snackbar.show({
            title: 'Password Updated',
            duration: Snackbar.LENGTH_SHORT
        });
      }).catch((err) => {
        if(err.code === 'auth/requires-recent-login') {
          this._reuthenticate();
        }
      });
    } else {
      this.setState({
        passwordForm: '',
        secondPasswordForm: ''
      })
    }
  };

  handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      Navigation.startSingleScreenApp({
        screen: {
          screen: 'mmu_social.AuthLogin',
          title: 'Login'
        }
      });
    });
  };

  handleDeleteAccount = () => {
      const ref = firebase.auth().currentUser;

      ref.delete().then(() => {
        Navigation.startSingleScreenApp({
          screen: {
            screen: 'mmu_social.AuthLogin',
            title: 'Login'
          }
        });
      }).catch((err) => {
        if(err.code === 'auth/requires-recent-login') {
          this._reuthenticate();
        }
      });
  };

  handleDeleteConfirm = () => {
    Alert.alert(
      'Are you sure?',
      'This can NOT be undone',
      [
        {text: 'Cancel', onPress: null},
        {text: 'Delete', onPress: this.handleDeleteAccount}
      ]
    )
  };

  render() {
    return(
      <ScrollView>
        <View>
          <View
            //colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradient}
          >
          </View>
          <View style={styles.header}>
            {this.backgroundDisplay()}
            <Text style={styles.name}>Ranj Salih</Text>
          </View>
          <View style={styles.fabAlign}>
            <Fab style={styles.fab} onPress={this.imagePickerHandler}>
              <Icon
                name='camera'
              />
            </Fab>
          </View>
            <Content>
              <View style={styles.heading}>
                <H1>Update Name</H1>
              </View>
              <Item stackedLabel error={this.state.firstNameForm === ''}>
                <Icon name='person' />
                <Label> First Name </Label>
                <Input
                  value={this.state.firstNameForm}
                  onChangeText={(text) => this._handleFirstNameChange(text)}
                />
              </Item>
              <Item stackedLabel error={this.state.secondNameForm === ''}>
                <Icon name='person' />
                <Label> First Name </Label>
                <Input
                  value={this.state.secondNameForm}
                  onChangeText={(text) => this._handleSecondNameChange(text)}
                />
              </Item>
              <Button block style={styles.button} onPress={this._handleUpdateName}>
                <Text>Update Name</Text>
              </Button>
              <View style={styles.heading}>
                <H1>Update Email</H1>
              </View>
              <Item stackedLabel error={this.state.emailValid === false}>
                <Icon name='mail' />
                <Label> Email </Label>
                <Input
                  value={this.state.emailForm}
                  onChangeText={(text) => this._handleEmailChange(text)}
                />
              </Item>
              <Button block style={styles.button} onPress={this.handleEmailUpdate}>
                <Text>Update Email</Text>
              </Button>
              <View style={styles.heading}>
                <H1>Update Password</H1>
              </View>
              <Item stackedLabel error={this.state.passwordValid === false && this.state.passwordForm !== null}>
                <Icon name='lock' />
                <Label> New Password </Label>
                <Input
                  onChangeText={(text) => this._handlefirstPasswordChange(text)}
                />
              </Item>
              <Item stackedLabel error={this.state.secondPasswordValid === false && this.state.secondPasswordForm !== null}>
                <Icon name='lock' />
                <Label> Confirm Password </Label>
                <Input
                  onChangeText={(text) => this._handlesecondPasswordChange(text)}
                />
              </Item>
              <Button block style={styles.button} onPress={this.handlePasswordUpdate}>
                <Text>Update Password</Text>
              </Button>
              <TouchableOpacity onPress={this.handleSignOut}>
                <View style={styles.heading}>
                  <H3>Logout</H3>
                </View>
              </TouchableOpacity>
              <Button full danger onPress={this.handleDeleteConfirm}>
                <Text>Delete Account</Text>
              </Button>
            </Content>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    marginTop: 30
  },
  gradient: {
    height: 150,
    backgroundColor: 'blue'
  },
  dp: {
  },
  name: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    fontSize: 20
  },
  fabAlign: {
    marginTop: 45,
    alignSelf: 'flex-end'
  },
  fab: {
    backgroundColor: 'gray',
    elevation: 30
  },
  heading: {
    alignItems: 'center',
    opacity: .5,
    marginBottom: 15
  },
  button: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: 20,
    margin: 30
  }
});