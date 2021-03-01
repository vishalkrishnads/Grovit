import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from '../components/styles'

var moment = require('moment');

export default To_Do_Elaborated = ({ route, navigation }) => {
    const { title } = route.params;
    const { description } = route.params;
    const { date } = route.params
    const dt = new Date();
    const dt1 = Date.parse(date);
    dt.setTime(dt1);
    return (
        <ScrollView>
            <View style={{ flex: 0.5, flexDirection: 'row' }}>
                <View style={{ flex: 0.7 }}></View>
                <View style={{ flex: 1, flexDirection: 'row', height: 160 }}>
                    <Icon name={'align-justify'} type={'feather'} color={'gray'} size={180} />
                    <View>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 1 }}>
                            <Icon name={'clock'} type={'feather'} color={'green'} size={50} />
                        </View>
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
                <View style={{ flex: 0.7 }}>
                </View>
            </View>
            <View style={{ flex: 2 }}>
                <Text style={styles.to_do_heading}>{title}</Text>
                <Text style={styles.to_do_date}>Due {moment(dt).format("dddd, MMMM D, YYYY")}</Text>
                <View style={styles.to_do_content_holder}>
                    <Text style={styles.to_do_content}>{description}</Text>
                </View>
            </View>
        </ScrollView>
    );
}