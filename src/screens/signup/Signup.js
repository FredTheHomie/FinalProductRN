import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import {
  Content,
  Thumbnail,
  Container,
  Fab,
  View,
  Icon,
  Input,
  Form,
  Item,
  Label,
  Picker,
  Button,
  Text
} from 'native-base'
import {
  validateEmail,
  validatePassword
} from "../../logic/validation/login";
import ProfilePic from '../../assets/img/profilePic.jpg';
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import Snackbar from 'react-native-snackbar';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

//const user = firebase.auth().currentUser;
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

export default class SignUp extends Component {
  constructor(props){
    super(props);

    this.state = {
      avatar: null,
      avatarPicked: false,
      currentGender: 'male',
      genderSelected: false,
      currentDate: '',
      datePicked: false,
      validation: false,
      emailValid: false,
      passwordValid: false,
      firstNameValid: false,
      secondNameValid: false,
      emailForm: '',
      passwordForm: '',
      firstNameForm: '',
      secondNameForm: ''
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      currentUser = user;
    });
  }

  imagePickerHandler = () => {
    ImagePicker.showImagePicker({title: 'Pick avatar'}, (res) => {
      if (res.didCancel) {
        if(!this.state.avatarPicked){
          this.setState({
            avatar: ProfilePic
          });
        }
      }
      else if (res.error) {
        if(!this.state.avatarPicked){
          this.setState({
            avatar: ProfilePic
          });
        }
      } else {
        const source = { uri: res.uri};
        this.setState({
          avatar: source,
          avatarPicked: true
        });
      }
    });
  };

  onValueChange(value: string) {
    this.setState({
      currentGender: value,
      genderSelected: true
    });
  }

  _handleSignUp = () => {
    this.setState({validation: true});
    setTimeout(() => {
      if(this.state.emailValid && this.state.passwordValid &&
        this.state.firstNameValid && this.state.secondNameValid &&
        this.state.currentDate !== ''){
        firebase.auth().createUserWithEmailAndPassword(this.state.emailForm, this.state.passwordForm).catch(function(error) {
          //const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        }).then(() => {
          firebase.database().ref('users/' + currentUser.uid).set({
            email: currentUser.email,
            firstname: this.state.firstNameForm,
            secondname: this.state.secondNameForm,
            gender: this.state.currentGender,
            dob: this.state.currentDate
          });
        }).then(() => {
          if(this.state.avatarPicked)
            uploadImage(this.state.avatar.uri.toString());
        });
      } else if(!this.state.emailValid){
        Snackbar.show({
          title: 'Please enter a valid Email',
          duration: Snackbar.LENGTH_SHORT
        });
      } else if(!this.state.passwordValid){
        Snackbar.show({
          title: 'Password must incl. at least 1 number, special character, & capital letter',
          duration: Snackbar.LENGTH_LONG
        });
      } else if(!this.state.firstNameValid || !this.state.secondNameValid
        || (!this.state.firstNameValid && !this.state.secondNameValid)){
        Snackbar.show({
          title: 'Please enter name',
          duration: Snackbar.LENGTH_SHORT
        });
      } else if(this.state.currentDate === ''){
        Snackbar.show({
          title: 'Please enter your date of birth',
          duration: Snackbar.LENGTH_SHORT
        });
      }
    }, 0);
  };

  _handleEmailChange = (text: string) => {
    if(validateEmail(text) === true){
      //this.setState({email: text});
      this.setState({
        emailValid: true,
        emailForm: text
      });
    }else
      this.setState({emailValid: false});
  };


_handlePasswordChange = (text: string) => {
  if(validatePassword(text) === true){
    //this.setState({email: text});
    this.setState({
      passwordValid: true,
      passwordForm: text
    });
  }else
    this.setState({passwordValid: false});
};

  _handleFirstNameChange = (text: string) => {
    if(text !== ''){
      this.setState({
        firstNameValid: true,
        firstNameForm: text
      });
    } else
      this.setState({
        firstNameValid: false
      });
  };

  _handleSecondNameChange = (text: string) => {
    if(text !== ''){
      this.setState({
        secondNameValid: true,
        secondNameForm: text
      });
    } else
      this.setState({
        secondNameValid: false
      });
  };

  _handleDobPicker = (date: string) => {
    this.setState({
      currentDate: date
    });
  };

  render(){
    return(
      <Container style={styles.container}>
        <View style={styles.profilePic}>
            <Thumbnail
              large
              source={this.state.avatar === null ? ProfilePic : this.state.avatar}
            />
            <View style={styles.addIcon}>
              <Fab onPress={this.imagePickerHandler}>
                <Icon name='add'/>
              </Fab>
            </View>
          </View>
        <Form style={styles.form}>
          <Item floatingLabel error={this.state.emailValid !== true && this.state.validation}>
            <Label>Email</Label>
            <Input
              onChangeText={(text) => this._handleEmailChange(text)}
            />
          </Item>
          <Item floatingLabel error={this.state.passwordValid !== true && this.state.validation}>
            <Label>Password</Label>
            <Input
              onChangeText={(text) => this._handlePasswordChange(text)}
              secureTextEntry={true}
            />
          </Item>
          <Item floatingLabel error={this.state.firstNameValid !== true && this.state.validation}>
            <Label>First name</Label>
            <Input
              onChangeText={(text) => this._handleFirstNameChange(text)}
            />
          </Item>
          <Item floatingLabel error={this.state.secondNameValid !== true && this.state.validation}>
            <Label>Second name</Label>
            <Input
              onChangeText={(text) => this._handleSecondNameChange(text)}
            />
          </Item>
          <Item style={styles.item}>
            <Picker
              iosHeader='Select gender'
              mode='dropdown'
              selectedValue={this.state.genderSelected ? this.state.currentGender : 'Male'}
              onValueChange={this.onValueChange.bind(this)}
              style={styles.picker}
            >
              <Item label='Male' value='Male'/>
              <Item label='Female' value='Female'/>
            </Picker>
          </Item>
          <Item style={styles.item} last>
            <DatePicker
              onDateChange={(date) => {this._handleDobPicker(date)}}
            />
          </Item>
          <Button block style={styles.button} onPress={this._handleSignUp}>
            <Text>Sign Up!</Text>
          </Button>
        </Form>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: screenHeight * 0.02
  },
  profilePic: {
    alignItems: 'center',
  },
  addIcon: {
    left: 80,
    top: 30
  },
  form: {
    width: screenWidth,

  },
  item: {
    paddingTop: 10
  },
  button: {
    margin: 35
  },
  picker: {
    width: Platform.OS === 'ios' ? undefined : 120
  }
});