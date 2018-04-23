import React, {
  Component
} from 'react';
import {
  View,
  Text,
  Alert
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
      }
    });
  }

  _handleLiked = () => {
    if(this.state.liked) {
      this.setState({
        liked: false,
        likes: this.state.likes - 1
      });
    } else
      this.setState({
        liked: true,
        likes: this.state.likes + 1
      });
  };

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
    firebase.storage().ref('images/' + userId + '/profile_pictures1')
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

  render() {
    return (
      <View style={styles.listItem}>
        {this._getImage(this.props.task.profilePic)}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={this.state.img ? this.state.img : ProfilePic} />
              <Body>
              <Text>{`${this.props.task.firstname} ${this.props.task.secondname}`}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Text>
              {this.props.task.post}
            </Text>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent onPress={this._handleLiked}>
                <Icon
                  active={this.state.liked}
                  name="thumbs-up"
                />
                <Text>{this.state.likes}</Text>
              </Button>
            </Left>
            <Body>
            <Button transparent onPress={this._handleRepost}>
              <Icon
                active={this.state.repost}
                name="repeat"
              />
              <Text>{`${this.state.numberOfReposts} reposts`}</Text>
            </Button>
            </Body>
            <Right>
              <Text>11h ago</Text>
            </Right>
          </CardItem>
        </Card>
      </View>

    );
  }
}

module.exports = ListItem;