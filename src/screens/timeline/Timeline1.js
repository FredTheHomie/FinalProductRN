import React, { Component } from 'react';
import {
  FlatList,
  ListView,
  StyleSheet
} from 'react-native';
import {
  List
} from 'react-native-elements'
import {
  View,
  Text,
  Fab,
  Icon
} from 'native-base';
import firebase from 'react-native-firebase';
import ListItem1 from '../../components/listItem/ListItem1';
import Styles from '../../styles';
import { Navigation } from 'react-native-navigation'

export default class Timeline1 extends Component {
  constructor(props){
    super(props);

    this.state = {
      currentUser: null,
      data: [],
      data2: [],
      refreshing: false,
      firstname: null,
      secondname: null,
      start: false
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: user
        });
        firebase.database().ref(`users/${user.uid}`).on('value', (snapshot) => {
          firebase.database().ref(`users/${user.uid}/friends`).on('value', (snap) => {
            snap.forEach((child) => {
              this.setState({
                friends: [...this.state.friends, child],
                firstname: snapshot.val().firstname,
                secondname: snapshot.val().secondname
              })
            });
          });
        });
      }
    });
  }

  componentDidMount() {
    this._listenForTasks();
    this._listenForTasks2();
  }

  checkLike = (user, id) => {
    let count = [];
    firebase.database().ref(`users/${user}/posts/${id}/likedBy`).on('value', (snap) => {
      count = [];
      snap.forEach((child) => {
        alert('true');
        if(child.key === this.state.currentUser.uid) {
        }
      });
    });
  };

  _listenForTasks2() {
    const refDB = firebase.database();
    let posts = [];
    let like = [];
    //alert(this.state.friends);
    refDB.ref(`users/${this.state.currentUser.uid}/posts`).on('value', (snap) => {
      posts = [];
      snap.forEach((child) => {
        firebase.database().ref(`users/${this.state.currentUser.uid}/posts/${child.key}/likedBy`).once('value', (snap) => {
          like = [];
          snap.forEach((pls) => {
            like.push(pls.key)
          });
        posts.push({
          post: child.val().post,
          firstname: this.state.firstname,
          secondname: this.state.secondname,
          profilePic: this.state.currentUser.uid,
          likes: child.val().likes,
          likedBy: like,
          time: child.val().time,
          key: child.key
        });
          this.setState({
            data2: posts
          });
      });
      });
    });
  }

  _listenForTasks() {
    const refDB = firebase.database();
    let posts = [];
    let like = [];

      refDB.ref('users/' + this.state.currentUser.uid + '/Friends').once('value', (dataSnapshot) => {
        posts = [];
        like = [];
        dataSnapshot.forEach((child) => {

          refDB.ref('users/' + child.key).once('value', (dataSnapshot1) => {
            //console.log(dataSnapshot1.val().firstname);
            refDB.ref('users/' + child.key + '/posts').once('value', (dataSnapshot2) => {
              let val = dataSnapshot2.val();
              Object.keys(val).forEach((key) => {
                refDB.ref(`users/${child.key}/posts/${key}/likedBy`).once('value', (snap) => {
                  like = [];
                  snap.forEach((pls) => {
                    like.push(pls.key)
                  });
                  posts.push({
                    post: val[key].post,
                    firstname: dataSnapshot1.val().firstname,
                    secondname: dataSnapshot1.val().secondname,
                    profilePic: child.key,
                    likes: val[key].likes,
                    likedBy: like,
                    time: val[key].time,
                    key: key
                  });
                  this.setState({
                    data: posts
                  });
                });
              });
            });
          });
        });
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

  handleRefresh = () => {
    this.setState({
      refreshing: true,
      data: []
    }, () => {
      const refDB = firebase.database();
      let posts = [];
      let like = [];
      refDB.ref('users/' + this.state.currentUser.uid + '/Friends').once('value', (dataSnapshot) => {
        posts = [];
        dataSnapshot.forEach((child) => {
          refDB.ref('users/' + child.key).once('value', (dataSnapshot1) => {
            //console.log(dataSnapshot1.val().firstname);
            refDB.ref('users/' + child.key + '/posts').once('value', (dataSnapshot2) => {
              let val = dataSnapshot2.val();
              Object.keys(val).forEach((key) => {
                refDB.ref(`users/${child.key}/posts/${key}/likedBy`).once('value', (snap) => {
                  like = [];
                  snap.forEach((pls) => {
                    like.push(pls.key)
                  });
                  posts.push({
                    post: val[key].post,
                    firstname: dataSnapshot1.val().firstname,
                    secondname: dataSnapshot1.val().secondname,
                    profilePic: child.key,
                    likes: val[key].likes,
                    likedBy: like,
                    time: val[key].time,
                    key: key
                  });
                  this.setState({
                    data: posts
                  });
                });
              });
            });
          });
        });
      });
      this.setState({
        refreshing: false
      })
    });
  };

  handleUpdate= () => {
    const refDB = firebase.database();
    let posts = [];
    let like = [];
    refDB.ref('users/' + this.state.currentUser.uid + '/Friends').once('value', (dataSnapshot) => {
      posts = [];
      dataSnapshot.forEach((child) => {
        refDB.ref('users/' + child.key).once('value', (dataSnapshot1) => {
          //console.log(dataSnapshot1.val().firstname);
          refDB.ref('users/' + child.key + '/posts').once('value', (dataSnapshot2) => {
            let val = dataSnapshot2.val();
            Object.keys(val).forEach((key) => {
              refDB.ref(`users/${child.key}/posts/${key}/likedBy`).once('value', (snap) => {
                like = [];
                snap.forEach((pls) => {
                  like.push(pls.key)
                });
                posts.push({
                  post: val[key].post,
                  firstname: dataSnapshot1.val().firstname,
                  secondname: dataSnapshot1.val().secondname,
                  profilePic: child.key,
                  likes: val[key].likes,
                  likedBy: like,
                  time: val[key].time,
                  key: key
                });
                this.setState({
                  data: posts
                });
              });
            });
          });
        });
      });
    });
  };

  sortData = (list) => {
    return list.sort(function(a,b) {
      return a.date < b.date ? -1 : 1;
    });
  };

  render() {

    return (
      <View style={styles.container}>
        <FlatList
          data={this.sortData([...this.state.data, ...this.state.data2]).reverse()}
          renderItem={({item}) => {
            return(
              <ListItem1
                firstname={item.firstname}
                secondname={item.secondname}
                post={item.post}
                profilePic={item.profilePic}
                likes={item.likes}
                id={item.key}
                likedBy={item.likedBy}
                refresh={this.handleUpdate}
                timestamp={item.time}
              />
            );
          }}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
        />
        <View style={styles.addIcon}>
          <Fab onPress={this._handleCreatePost}>
            <Icon name='add'/>
          </Fab>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  addIcon: {
    alignSelf: 'flex-end'
  }
});