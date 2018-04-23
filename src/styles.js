import {
  StyleSheet
} from 'react-native';

const Styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  listView: {
    flex: 1,
  },
  listItem: {
    flexDirection:'row',
    alignItems:'center',
    padding:5
  },
  listItemTitle: {
    flex: 6,
    color: '#000',
    fontSize: 16,
  },
  listItemAction: {
    flex: 1,
    width: 40,
    height: 40
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    height: 54,
    flexDirection: 'row'
  },
  navbarTitle: {
    color: '#444',
    fontSize: 16,
    fontWeight: "500"
  }
});

module.exports = Styles;