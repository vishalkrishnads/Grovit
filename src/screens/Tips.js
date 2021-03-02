import React from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import { createStackNavigator } from "@react-navigation/stack";
import TIPS from '../assets/Tips'
import styles from '../assets/styles'
import Tips_Elaborated from './Tips-Elaborated'

const Stack = createStackNavigator();

const Content = ({navigation}) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=>navigation.navigate('Tips_Elaborated', {title: item.title, description: item.description, image: item.image})}>
      <View style={styles.tips_card}>
        <View style={{ flex: 2 }}>
          <Image source={item.image} style={styles.tips_card_image} />
        </View>
        <View style={{ flex: 5 }}>
          <View style={{ flex: 0.2 }}></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tips_card_heading}>{item.card_title}</Text>
            <Text style={styles.tips_card_description}>{item.description}</Text>
          </View>
          <View style={{ flex: 0.3 }}></View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
        style={{ margin: 10 }}
        data={TIPS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

export default Tips = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tips_Screen" component={Content} options={{
        headerTitleAlign: 'center',
        title: 'Tips'
      }} />
      <Stack.Screen name="Tips_Elaborated" component={Tips_Elaborated} options={{
        headerTitleAlign: 'center',
        title: 'Tips'
      }} />
    </Stack.Navigator>
  );
}