import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';

// To know the size of the screen
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

//Images URI references
const Users = [
  { id: "1", uri: require('./assets/1.jpg') },
  { id: "2", uri: require('./assets/2.jpg') },
  { id: "3", uri: require('./assets/3.jpg') },
  { id: "4", uri: require('./assets/4.jpg') },
  { id: "5", uri: require('./assets/5.jpg') },
];

export default class App extends React.Component {

  constructor() {
    super()
    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    };
    //Rotation and movement
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    });
    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    };
    // Text opacity
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    });
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    });
    // Bottom card opacity and scale
    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })
  };


componentWillMount() {
  //PanResponder => gesture management
  this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
       this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        //Right
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
           toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
           this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
             this.position.setValue({ x: 0, y: 0 })
           });
         });
        }
        //Left
        else if (gestureState.dx < -120) {
           Animated.spring(this.position, {
             toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
           }).start(() => {
             this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
               this.position.setValue({ x: 0, y: 0 })
             });
           });
        }
        //Center
        else {
          Animated.spring(this.position, {
           toValue: { x: 0, y: 0 },
           friction: 4
          }).start()
        };
      }
  });//\this.PanResponder
};//\componentWillMount()

  renderUsers = () => {
    //Display all images, first on top using reverse
    return Users.map((item, i) => {

      if (i < this.state.currentIndex) {
        return null
      }
      //Top card can move
      else if (i == this.state.currentIndex) {
        return (
          // ...this = Spread Attributes: here all the props of state.panResponder
          <Animated.View
            {...this.PanResponder.panHandlers}
            key = {item.id}
            style= {[ this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}
          >
            {/* Text Like/Nope */}
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
            </Animated.View>
            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
            </Animated.View>
            {/* Images */}
            <Image
              style = {{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}}
              source = {item.uri}
            />
          </Animated.View>
        );
      }
      else {
        return (
          <Animated.View
            key = {item.id}
            style= {[{ opacity: this.nextCardOpacity, transform: [{ scale: this.nextCardScale }], height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
            <Image
              style = {{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}}
              source = {item.uri} />
          </Animated.View>
        );
      }
    }).reverse();
  };

  render() {
    return (
      <View style = {{ flex: 1 }}>
        {/* Header */}
        <View style = {{ height: 60 }}>

        </View>
        {/* Content */}
        <View style={{ flex: 1 }}>
          {this.renderUsers()}
        </View>
        {/* Footer */}
        <View style={{ height: 60 }}>

        </View>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
