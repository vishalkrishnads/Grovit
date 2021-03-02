import React from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity, Alert, Vibration } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { Icon, Button } from 'react-native-elements'
import { openDatabase } from 'react-native-sqlite-storage'
import styles from '../components/styles'

const Stack = createStackNavigator();
var db = openDatabase({ name: 'GreenHouse.db' });

const Card = ({ name, icon, primary_data, extra_data }) => {
  return (
    <TouchableOpacity style={styles.profile_card}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 2, marginLeft: 20 }}>
          <Icon name={icon} type={'feather'} size={40} color={'gray'} />
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={{ flex: 3 }}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Text style={styles.profile_card_badge}>{name}</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
        <Text style={styles.profile_card_data}>{primary_data}</Text>
      </View>
    </TouchableOpacity>
  );
}

const Content = ({navigation}) => {
  let [active, setActive] = React.useState('')
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM Houses', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setActive(temp.length);
        });
      });
    });
    return unsubscribe;
  }, [navigation])
  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image source={require('../img/GreenHouse.jpg')} style={styles.profile_pic} />
        <Text style={styles.profile_name}>Raman</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Card name={'Username'} icon={'user'} primary_data={'@raman12'} />
        <Card name={'Crops of interest'} icon={'feather'} primary_data={'Beans'} />
        <Card name={'Active Houses'} icon={'home'} primary_data={active} />
      </View>
      <View style={{flex: 3}}>
        <Button
        title={'Sign Out'}
        onPress={()=>{Vibration.vibrate(40); Alert.alert('Warning', 'This function is temporarily unavailable.')}}
        buttonStyle={{alignSelf: 'center', width: 100, margin: 10, borderRadius: 50, backgroundColor: global.accent}}
        />
      </View>
    </ScrollView>
  );
}

export default Profile = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile_Screen" component={Content} options={{
        headerTitleAlign: 'center',
        title: 'Profile'
      }} />
    </Stack.Navigator>
  );
}