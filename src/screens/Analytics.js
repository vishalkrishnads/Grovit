import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { WebView } from 'react-native-webview'
import { openDatabase } from 'react-native-sqlite-storage';
import styles from '../assets/styles'

var db = openDatabase({ name: 'GreenHouse.db' });

export default Analytics = ({ route, navigation }) => {
    const { item } = route.params;
    let [id, setID] = React.useState('')
    let [api_key, setKey] = React.useState('')
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT id, api_key FROM Houses where house_id = ?',
                    [item],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            setKey(results.rows.item(0).api_key)
                            setID(results.rows.item(0).id)
                        } else {
                            Alert.alert('No such house enrolled');
                        }
                    }
                );
            });
        });
        return unsubscribe;
    }, [route, navigation])
    return (
        <ScrollView>
            <View style={styles.analytics_card}>
                <View style={styles.analytics_heading_container}>
                    <Icon name={'droplet'} color={'green'} type={'feather'} size={50} />
                    <Text style={styles.analytics_heading}>Watering</Text>
                </View>
                <View style={styles.analytics_graph_container}>
                    <WebView
                        javaScriptEnabled={true}
                        source={{
                            html: `
                            <iframe width="950" height="420" style="border: 0px solid #cccccc;" src="https://thingspeak.com/channels/`+id+`/charts/3?bgcolor=%23ffffff&color=%23008000&api_key=`+api_key+`&dynamic=true&results=60&type=line&update=15&width=900&height=450"></iframe>
                        `}}
                    />
                </View>
            </View>
            <View style={styles.analytics_card}>
                <View style={styles.analytics_heading_container}>
                    <Icon name={'sun'} color={'green'} type={'feather'} size={50} />
                    <Text style={styles.analytics_heading}>Light usage</Text>
                </View>
                <View style={styles.analytics_graph_container}>
                    <WebView
                        javaScriptEnabled={true}
                        source={{
                            html: `
                            <iframe width="950" height="420" style="border: 0px solid #cccccc;" src="https://thingspeak.com/channels/`+id+`/charts/1?bgcolor=%23ffffff&color=%23008000&api_key=`+api_key+`&dynamic=true&results=60&type=line&update=15&width=900&height=450"></iframe>
                        `}}
                    />
                </View>
            </View>
        </ScrollView>
    );
}