import React, {
  Component
} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import {
  Thumbnail,
  Card,
  CardItem,
  Left,
  Body,
  Icon,
  Right,
  Image,
  Button
} from 'native-base';
import styles from '../../styles';
import ProfilePic from '../../assets/img/profilePic.jpg';
import firebase from 'react-native-firebase';
import {Navigation} from "react-native-navigation";

/*<Thumbnail
  source={ProfilePic}
/>
<Text style={styles.listItemTitle}>{this.props.task.post}</Text>*/

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      likes: 10,
      repost: false,
      numberOfReposts: 4,
      img: null
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({
          currentUser: user
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

  /*checkLike = (user, id) => {
    let count = [];
    firebase.database().ref(`users/${user}/posts/${id}/likedBy`).on('value', (snap) => {
      count = [];
      snap.forEach((child) => {
        if(child.key === this.state.currentUser.uid) {
          return (<Icon
            active={true}
            name="thumbs-up"
          />)
        }
      });
      /*if(count.includes(this.state.currentUser.uid)) {
        return (<Icon
          active={true}
          name="thumbs-up"
        />);
      }*/
    //});
  //};

  handleLiked = (user, noOfLikes, postId, likesList) => {
    if(likesList.includes(this.state.currentUser.uid)){
      firebase.database().ref(`users/${user}/posts/${postId}`).update({
        likes: noOfLikes - 1
      }, () => {
        firebase.database().ref(`users/${user}/posts/${postId}/likedBy`)
          .equalTo(`${this.state.currentUser.uid}`).on('value', (snap) =>{
          snap.ref.remove();
        });
      });
    } else {
      firebase.database().ref(`users/${user}/posts/${postId}/likedBy`).update({
        [this.state.currentUser.uid]: true
      }, () => {
        firebase.database().ref(`users/${user}/posts/${postId}`).update({
          likes: noOfLikes + 1
        });
      });
    }
  };

  /*handleLiked = (user, likes, id) => {
    if(this.state.liked === true) {
      this.setState({
        liked: false,
        likes: this.state.likes - 1
      }, () => {
        firebase.database().ref(`users/${user}/posts/${id}`).update({
          likes: likes - 1
        }, () => {
        });
      });
    } else
      this.setState({
        liked: true
      }, () => {
        firebase.database().ref(`users/${user}/posts/${id}/likedBy`).update({
          [this.state.currentUser.uid]: true
        }, () => {
          firebase.database().ref(`users/${user}/posts/${id}`).update({
            likes: likes + 1
        });
        });
      });
  };*/

  _handleUndoRepost = () => {
    this.setState({
      repost: false,
      numberOfReposts: this.state.numberOfReposts - 1
    });
  };

  _handleRepost = () => {
    if(this.state.repost) {
      Alert.alert(
        'Are you sure?',
        'Undo Repost?',
        [
          {text: 'Cancel', onPress: null},
          {text: 'Undo', onPress: this._handleUndoRepost}
        ]
      );
    } else
      this.setState({
        repost: true,
        numberOfReposts: this.state.numberOfReposts + 1
      });
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



  /*getImage(userId) {
   let img = null;
   firebase.storage().ref(`images/${userId}/profile_pictures`)
     .getDownloadURL().then((url) => {
     img = {uri: url};
     //alert(img.uri);

   }).catch(() => {
     //alert('no')
   });

   return ProfilePic
 }*/
  handleFirstname = (id, name) => {
    return this.state.currentUser.uid === id ?
      this.state.firstname : name
  };

  handleSecondname = (id, name) => {
    return this.state.currentUser.uid === id ?
      this.state.secondname : name
  };

  timeSince(date) {

    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  _handleNavigateToProfile = (id) => {
    if(id !== this.state.currentUser.uid) {
      Navigation.showModal({
        screen: "mmu_social.FriendProfile", // unique ID registered with Navigation.registerScreen
        title: "Profile", // title of the screen as appears in the nav bar (optional)
        passProps: {id}, // simple serializable object that will pass as props to the modal (optional)
        navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
        navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
      });
    }
  };

  //{this.checkLike(this.props.profilePic.uid, this.props.id)}
  render() {
    return (
      <View style={styles.listItem}>
        {this._getImage(this.props.profilePic)}
        <Card>
          <TouchableOpacity
            onPress={() => {
              this._handleNavigateToProfile(this.props.profilePic)
            }}
          >
            <CardItem>
              <Left>
                  <Thumbnail source={this.state.img ? this.state.img : ProfilePic} />
                <Body>
                <Text>{`${this.handleFirstname(this.props.profilePic, this.props.firstname)} ${this.handleSecondname(this.props.profilePic, this.props.secondname)}`}</Text>
                </Body>
              </Left>
            </CardItem>
          </TouchableOpacity>
          <CardItem>
            <Text>
              {this.props.post}
            </Text>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent onPress={() => {
                this.handleLiked(this.props.profilePic, this.props.likes, this.props.id, this.props.likedBy);
                if(this.props.profilePic !== this.state.currentUser.uid)
                  this.props.refresh();
              }}>
                <Icon
                  active={this.props.likedBy.includes(this.state.currentUser.uid)}
                  name="thumbs-up"
                />
                <Text>{this.props.likes}</Text>
              </Button>
            </Left>
            <Right>
              <Text>{this.timeSince(this.props.timestamp)}</Text>
            </Right>
          </CardItem>
        </Card>
      </View>

    );
  }
}

module.exports = ListItem;