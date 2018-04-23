import React, { Component } from 'react';
import {
  FlatList
} from 'react-native';
import {
  View,
  Text,
  Header,
  Item,
  Input,
  Icon
} from 'native-base';
import firebase from 'react-native-firebase';
import SmallListItem from '../../components/listItem/SmallListItem';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      data: [],
      friends: [],
      refresh: 0
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

  _handleSearch = (text: string) => {
    //alert(this.state.friends);
    let data = [];
    firebase.database().ref('users').orderByChild('firstname').startAt(text).endAt(text + "\uf8ff").once('value', (snap) => {
      data = [];
      snap.forEach((user) => {
        console.log(user.key);
        if(user.key !== this.state.currentUser.uid) {
          data.push({
            firstname: user.val().firstname,
            secondname: user.val().secondname,
            key: user.key
          });
        }
      });
      if(text === '') {
        this.setState({
          data: []
        })
      } else {
        this.setState({
          data: data
        })
      }
    });
  };

  render() {
    return(
      <View>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search by name..."
              onChangeText={(text) => this._handleSearch(text)}
            />
            <Icon name="ios-people" />
          </Item>
        </Header>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => {
            return(
              <SmallListItem
                firstname={item.firstname}
                secondname={item.secondname}
                id={item.key}
              />
            );
          }}
        />
      </View>
    );
  }
}