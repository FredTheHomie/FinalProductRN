import React, { Component } from 'react';
import {
  ListView,
  Animated,
  Text,
  FlatList
} from 'react-native';
import {
  View,
  Fab,
  Icon
} from 'native-base';
import firebase from 'react-native-firebase';
import ListItem from '../../components/listItem/ListItem';
import Styles from '../../styles';
import { Navigation } from 'react-native-navigation'
import ProfilePic from '../../assets/img/profilePic.jpg';

export default class Timeline extends Component {
  constructor(props){
    super(props);

    //alert(dataSource);
    this.state = {
      dataSource: null,
      currentUser: null,
      list: 0,
      users: []
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: user,
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
          })
        });
        firebase.database().ref(`users/${user.uid}`).on('value', (snap) => {
          this.setState({
            firstname: snap.val().firstname,
            secondname: snap.val().secondname
          })
        });
      }
    });
  }

  _handleCreatePost = () => {
    Navigation.showModal({
      screen: "mmu_social.CreatePost", // unique ID registered with Navigation.registerScreen
      title: "Modal", // title of the screen as appears in the nav bar (optional)
      passProps: {}, // simple serializable object that will pass as props to the modal (optional)
      navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
      animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  };

  _listenForTasks() {
    const refDB = firebase.database();
    let posts = [];

    refDB.ref(`users/${this.state.currentUser.uid}/posts`).on('value', (snap) => {
      posts = [];
      snap.forEach((child) => {
        posts.push({
          post: child.val().post,
          firstname: this.state.firstname,
          secondname: this.state.secondname,
          profilePic: this.state.currentUser.uid,
          key: Math.random()
        });
      });
      refDB.ref('users/' + this.state.currentUser.uid + '/Friends').on('value', (dataSnapshot) => {
        dataSnapshot.forEach((child) => {
          refDB.ref('users/' + child.key).on('value', (dataSnapshot1) => {
            //console.log(dataSnapshot1.val().firstname);
            refDB.ref('users/' + child.key + '/posts').on('value', (dataSnapshot2) => {
              let val = dataSnapshot2.val();
              Object.keys(val).forEach((key) => {

                posts.push({
                  post: val[key].post,
                  firstname: dataSnapshot1.val().firstname,
                  secondname: dataSnapshot1.val().secondname,
                  profilePic: child.key,
                  key: Math.random() //Temporary Fix
                });
                //
              });
              return this.setState({
                dataSource: this.state.dataSource.cloneWithRows(posts)
              });
            });
          });
        });
      });
    });
  }


  componentDidMount() {
    this._listenForTasks();
  }

  _renderItem(task) {
    return (
      <ListItem task={task} />
    );
  }

  render() {
    return (
      <View style={Styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          style={Styles.listView}
        />
        <View style={Styles.addIcon}>
          <Fab onPress={this._handleCreatePost}>
            <Icon name='add'/>
          </Fab>
        </View>
      </View>
    );
  }
}