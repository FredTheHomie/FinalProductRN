import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList
} from 'react-native';
import {
  Button,
  Text,
  Container,
  Thumbnail,
  Tab,
  Tabs,
  Card,
  CardItem,
  Left,
  Body,
  Icon,
  Right
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import firebase from 'react-native-firebase';
import { Navigation } from "react-native-navigation";
import ProfilePic from '../../assets/img/profilePic.jpg';
import Styles from '../../styles';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import ListItem1 from '../../components/listItem/ListItem1';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

let currentUser = null;

const uploadImage = (uri, mime = 'image/jpg') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    let uploadBlob = null;

    const imageRef = firebase.storage().ref('images').child(currentUser.uid + '/background_pictures');

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

export default class FriendProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      img: null,
      avatar: null,
      data: [],
      friends: []
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: user
        });
        currentUser = user;
        this._getBackground(user.uid);
        this._getAvatar(user.uid);
        firebase.database().ref(`users/${this.props.id}`).on('value', (snapshot) => {
            this.setState({
              firstname: snapshot.val().firstname,
              secondname: snapshot.val().secondname
          });
        });
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
      }
    });
  }

  _getBackground(userId) {
    firebase.storage().ref('images/' + userId + '/background_pictures')
      .getDownloadURL().then((url) => {
      this.setState({
        img: {uri: url}
      });
    }).catch(() => {

    });
  }

  _getAvatar(userId) {
    firebase.storage().ref('images/' + userId + '/profile_pictures')
      .getDownloadURL().then((url) => {
      this.setState({
        avatar: {uri: url}
      });
    }).catch(() => {

    });
  }

  backgroundDisplay = () => {
    return this.state.img
      ?
      <View style={styles.background}>
        <Image
          style={styles.img}
          source={{uri: this.state.img.uri}}
        />
      </View>
      :
      <View
        style={styles.background}
      >
      </View>;
  };

  componentDidMount() {
    this._listenForTasks2();
  }

  _listenForTasks2() {
    const refDB = firebase.database();
    let posts = [];
    let like = [];

    refDB.ref(`users/${this.props.id}/posts`).on('value', (snap) => {
      posts = [];
      snap.forEach((child) => {
        firebase.database().ref(`users/${this.props.id}/posts/${child.key}/likedBy`).once('value', (snap) => {
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
            data: posts
          });
        });
      });
    });
  }

  _handleReturn = () => {
    Navigation.dismissModal({
      animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
    });
  };

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

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Col style={{zIndex: 999, width: '100%'}}>
            <Row>
              <TouchableOpacity
                style={styles.backIcon}
                onPress={() => {
                  this._handleReturn();
                }}
              >
                <Icon
                  name='backspace'
                  style={{color: 'white'}}
                />
              </TouchableOpacity>
            </Row>
          </Col>
          {this.backgroundDisplay()}
          <View style={styles.nameView}>
            <Thumbnail
              large
              source={this.state.avatar ? this.state.avatar : ProfilePic}
              style={styles.dp}
            />
          </View>
          <Grid style={styles.grid}>
            <Col style={styles.following}>
              <Row style={styles.followingRow}>
                <Text></Text>
              </Row>
              <Row style={styles.followingRow}>
                <Text style={styles.font}></Text>
              </Row>
            </Col>
            <Col style={styles.followers}>
              <Row style={styles.followersRow}>
                <Text></Text>
              </Row>
              <Row style={styles.followersRow}>
                <Text style={styles.font}></Text>
              </Row>
            </Col>
          </Grid>
          <Text style={styles.name}>{`${this.state.firstname} ${this.state.secondname}`}</Text>
          <View>
            <Button
              style={styles.button}
              rounded={this.state.friends.includes(this.props.id)}
              bordered={this.state.friends.includes(this.props.id)}
              info
              onPress={() => {
                this.toggleFollow(this.state.friends, this.props.id);
              }}
            >
              <Text style={{color: this.state.friends.includes(this.props.id) ? 'blue' : 'white'}}>{this.state.friends.includes(this.props.id) ? 'Unfollow' : 'Follow'}</Text>
            </Button>
          </View>
        </View>
        <View style={Styles.container}>
          <FlatList
            data={this.state.data}
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
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: 250
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  background: {
    width: '100%',
    height: 250,
    //backgroundColor: 'orange',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    overflow: 'hidden'
  },
  dp: {
    //position: 'absolute',
    //backgroundColor: 'white',
  },
  name: {
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 15
  },
  nameView: {
    backgroundColor: 'white',
    position: 'absolute',
    marginTop: 200,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 5,
    shadowOpacity: .5,
    elevation: 20,
    borderRadius: 39
  },
  grid: {
    backgroundColor: 'rgba(0,0,0,0)',
    width: '100%',
  },
  following: {
    /*flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',*/
    marginLeft: -30,
    marginTop: -7,
    height: 50,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 5,
    shadowOpacity: .4
  },
  followingRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  followersRow: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  followers: {
    height: 50,
    marginTop: -7,
    marginRight: -30,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 5,
    shadowOpacity: .4,
    elevation: 20
  },
  font: {
    fontSize: 19
  },
  icon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 999,
    alignSelf: 'flex-end',
    marginRight: '5%',
    marginTop: 10
  },
  backIcon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 999,
    marginLeft: '5%',
    marginTop: 10
  },
  button: {
    marginBottom: 15,
    color: 'blue'
  }
});