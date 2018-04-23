import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Button,
  Text,
  Form,
  Input,
  Item,
  Content,
  Container,
  Label,
  Card,
  CardItem,
  Left,
  Right,
  Thumbnail,
  Body,
  Icon
} from 'native-base';
import firebase from 'react-native-firebase';
import styles from "../../styles";
import ProfilePic from '../../assets/img/profilePic.jpg';

export default class SmallListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      img: null
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: user
        });
        this._getFollows(user);
      }
    });
  }

  _getFollows = user => {
    let friendList = [];
    firebase.database().ref(`users/${user.uid}/Friends`).once('value', (snap) => {
      friendList = [];
      snap.forEach((friends) => {
        friendList.push(friends.key)
      });
      this.setState({
        friends: friendList
      });
    });
  };

  toggleFollow = (list, id) => {
    const refDB = firebase.database();
    if(list.includes(id)) {
        refDB.ref(`users/${this.state.currentUser.uid}/Friends`)
          .equalTo(`${id}`).on('value', (snap) =>{
          snap.ref.remove();
          this._getFollows(this.state.currentUser);
      });
    } else {
      refDB.ref(`users/${this.state.currentUser.uid}/Friends`).update({
        [id]: true
      }, () => {
        this._getFollows(this.state.currentUser);
      });
    }
  };
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

  render() {
    return(
      <View>
        {this._getImage(this.props.id)}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail
                source={this.state.img ? this.state.img : ProfilePic}
              />
              <Body>
              <Text>{`${this.props.firstname} ${this.props.secondname}`}</Text>
              </Body>
            </Left>
            <Button
              rounded={this.state.friends.includes(this.props.id)}
              bordered={this.state.friends.includes(this.props.id)}
              info
              onPress={() => {
                this.toggleFollow(this.state.friends, this.props.id);
              }}
            >
              <Text>{this.state.friends.includes(this.props.id) ? 'Unfollow' : 'Follow'}</Text>
            </Button>
          </CardItem>
        </Card>
      </View>
    );
  }
}