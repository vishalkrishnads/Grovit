import React from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import styles from '../components/styles'

export default Tips_Elaborated = ({ route, navigation }) => {
    const { title } = route.params;
    const { description } = route.params;
    const { image } = route.params
    return (
        <ScrollView>
            <View style={{ flex: 0.5, flexDirection: 'row' }}>
                <View style={{ flex: 0.7 }}></View>
                <View style={{ flex: 1, flexDirection: 'row', height: 160 }}>
                    <Image source={image} style={styles.tips_image}/>
                </View>
                <View style={{ flex: 0.7 }}>
                </View>
            </View>
            <View style={{ flex: 2 }}>
                <View style={{marginLeft: 10, marginRight: 20}}>
                    <Text style={[styles.to_do_heading, {fontSize: 22, textAlign: 'center'}]}>{title}</Text>
                </View>
                <View style={[styles.to_do_content_holder, {marginTop: 10}]}>
                    <Text style={styles.to_do_content}>{description}</Text>
                </View>
            </View>
        </ScrollView>
    );
}