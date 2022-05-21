import { StatusBar } from 'expo-status-bar'
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native'
const { width, height } = Dimensions.get('window')

const images = {
  a: 'https://i.pinimg.com/474x/9d/82/df/9d82df87946d6b54951de75bfe685077.jpg',
  ab: 'https://i.pinimg.com/736x/ab/69/6e/ab696ef8b52a5b1ebb7ac488abba5ab2.jpg',
  abc: 'https://i.pinimg.com/originals/70/3a/12/703a125e9098ca1e1a507164a6fc0ba2.jpg',
  abcd: 'https://1.bp.blogspot.com/-1ikZ_j8219k/XbbMoqjKDNI/AAAAAAAAdiQ/rHgzrW5Opd0klPGNaIznrT4NabUCCO-ywCLcBGAsYHQ/s2560/audi-a1-1080x1920-abt-sportsline-4k-2019-18914.jpg',
  abcde:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzrr-QTOyufN8wNysbAcMCe-Nc5_oqJSiQcA&usqp=CAU',
  abcdef:
    'https://i.pinimg.com/originals/e8/1f/32/e81f32f6552e1f7dbed73f44fb54a32f.jpg'
}

const data = Object.keys(images).map(i => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef()
}))

const Tab = React.forwardRef(({ item, onItemPress }, ref) => {
  const styles = StyleSheet.create({
    title: {
      color: 'white',
      fontSize: 84 / data.length,
      fontWeight: 'bold',
      textTransform: 'uppercase'
    }
  })

  return (
    <TouchableOpacity onPress={onItemPress}>
      <View ref={ref}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  )
})

const Tabs = ({ data, scrollX, onItemPress }) => {
  const [measures, setMeasures] = React.useState([])
  const containerRef = React.useRef()
  React.useEffect(() => {
    const m = []
    data.forEach(item => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({
            x,
            y,
            width,
            height
          })

          if (m.length === data.length) {
            setMeasures(m)
          }
        }
      )
    })
  })

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      width,
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 10
    },
    box: {
      flex: 1,
      justifyContent: 'space-evenly',
      flexDirection: 'row'
    }
  })

  return (
    <View style={styles.container}>
      <View ref={containerRef} style={styles.box}>
        {data.map((item, index) => (
          <Tab
            {...{
              key: item.key,
              item,
              ref: item.ref,
              onItemPress: () => onItemPress(index)
            }}
          />
        ))}
      </View>
      {measures.length > 0 && <Indicator {...{ measures, scrollX }} />}
    </View>
  )
}

const Indicator = ({ measures, scrollX }) => {
  const inputRange = data.map((_, i) => i * width)
  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map(measure => measure.width)
  })
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map(measure => measure.x + 10)
  })

  const styles = StyleSheet.create({
    indicator: {
      position: 'absolute',
      height: 4,
      width: '5%', // indicatorWidth,
      left: 0,
      bottom: 0,
      backgroundColor: 'white',
      transform: [{ translateX }],
      borderTopLeftRadius: 100,
      borderTopRightRadius: 100
    }
  })
  return <Animated.View style={styles.indicator} />
}

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current
  const ref = React.useRef()
  const onItemPress = React.useCallback(itemIndex => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width
    })
  })

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <Animated.FlatList
        ref={ref}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        data={data}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        keyExtractor={item => item.key}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.image }}
                style={{ flex: 1, resizeMode: 'cover' }}
              />
              <View
                styule={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: 'rgba(0,0,0,0.3)' }
                ]}
              />
            </View>
          )
        }}
      />
      <Tabs {...{ scrollX, data, onItemPress }} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
