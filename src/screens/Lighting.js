import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Switch, Alert, RefreshControl, Vibration } from 'react-native'
import { Icon } from 'react-native-elements'
import { openDatabase } from 'react-native-sqlite-storage';
import ProgressBar from 'react-native-progress/Bar';
import styles from '../assets/styles'

var db = openDatabase({ name: 'GreenHouse.db' });

export default Lighting = ({ route, navigation }) => {
    const { item } = route.params;
    let [loaded, setLoaded] = React.useState(false);
    let [refreshing, setRefreshing] = React.useState(false)
    let [changing, setChanging] = React.useState(false);
    let [Color, set_color] = React.useState(false)
    let [ON, setON] = React.useState(false);
    let [OFF, setOFF] = React.useState(false);
    let [Auto, setAuto] = React.useState(false);
    let [id, set_id] = React.useState('');
    let [apikey, set_apikey] = React.useState('')
    const switch_map = {
        "ON": {
            "hook": ON,
            "value": '1',
            "change": (function run() {
                setAuto(false)
                setOFF(false)
                setON(true)
            }),
            "error": `Cannot turn ON your lights as we lost connection with your house.`
        },
        "OFF": {
            "hook": OFF,
            "value": '0',
            "change": (function run() {
                setAuto(false)
                setON(false)
                setOFF(true)
            }),
            "error": `Cannot turn OFF your light as we lost connection with your house.`
        },
        "Auto": {
            "hook": Auto,
            "value": '0.5',
            "change": (function run() {
                setON(false)
                setOFF(false)
                setAuto(true)
            }),
            "error": `Cannot switch your light to Auto as we lost connection with your house.`
        }
    }
    const value_map = { '1': "ON", '0': "OFF", '0.5': "Auto" }
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT id, api_key FROM Houses where house_id = ?',
                    [item],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            set_apikey(results.rows.item(0).api_key)
                            set_id(results.rows.item(0).id);
                            fetch(`https://api.thingspeak.com/channels/${results.rows.item(0).id}/fields/2/last.json?api_key=${results.rows.item(0).api_key}`)
                                .then((response) => response.json())
                                .then((json) => {
                                    fetch(`https://api.thingspeak.com/channels/${results.rows.item(0).id}/fields/4/last.json?api_key=${results.rows.item(0).api_key}`)
                                        .then((res) => res.json())
                                        .then((jn) => {
                                            switch_map[value_map[json.field2]].change()
                                            jn.field4 === '1' ? set_color(true) : set_color(false)
                                            setLoaded(true);
                                        }).catch(() => { })
                                }).catch(() => {
                                    Alert.alert(
                                        'Error',
                                        'Cannot connect to house. Please check your internet connection',
                                        [
                                            {
                                                text: 'Okay',
                                                style: 'destructive',
                                                onPress: () => [
                                                    navigation.goBack(),
                                                ],
                                            },
                                        ]
                                    );
                                })
                        } else {
                            Alert.alert('No such house enrolled');
                        }
                    }
                );
            });
        });
        return unsubscribe;
    }, [route, navigation])
    const refresh = () => {
        setLoaded(false)
        fetch(`https://api.thingspeak.com/channels/${id}/fields/2/last.json?api_key=${apikey}`)
            .then((response) => response.json())
            .then((json) => {
                fetch(`https://api.thingspeak.com/channels/${results.rows.item(0).id}/fields/4/last.json?api_key=${results.rows.item(0).api_key}`)
                    .then((res) => res.json())
                    .then((jn) => {
                        switch_map[value_map[json.field2]].change()
                        jn.field4 === '1' ? set_color(true) : set_color(false)
                        setLoaded(true);
                        setRefreshing(false);
                    }).catch(() => { })
            }).catch(() => {
                Alert.alert(
                    'Error',
                    'Cannot connect to house. Please check your internet connection',
                    [
                        {
                            text: 'Okay',
                            style: 'destructive',
                            onPress: () => [
                                navigation.goBack(),
                            ],
                        },
                    ]
                );
            })
    }
    const switch_handler = (fn) => {
        setChanging(true)
        if (switch_map.hasOwnProperty(fn)) {
            if (switch_map[fn].hook) { switch_handler("OFF") } else {
                fetch(`https://api.thingspeak.com/update?api_key=${apikey}&field2=${switch_map[fn].value}`)
                    .then((response) => response.json())
                    .then((json) => {
                        fetch(`https://api.thingspeak.com/channels/${id}/fields/2/last.json?api_key=${apikey}`)
                            .then((res) => res.json())
                            .then((jn) => {
                                if (jn.entry_id == json) {
                                    switch_map[fn].change()
                                } else {
                                    Vibration.vibrate([100, 100, 100, 100]);
                                    Alert.alert('Error', "15 second delay window isn't over. Please wait 15 secods before trying again")
                                }
                            }).catch(() => {
                                Alert.alert(
                                    'Error',
                                    'Cannot connect to house. Please check your internet connection',
                                    [
                                        {
                                            text: 'Okay',
                                            style: 'destructive',
                                            onPress: () => [
                                                navigation.goBack(),
                                            ],
                                        },
                                    ]
                                );
                            })
                    })
                    .catch(() => Alert.alert('Uh Oh', switch_map[fn].error))
            }
        }
        setChanging(false)
    }
    const Card = ({ name, description }) => {
        return (
            <TouchableOpacity style={styles.li_water_card} onPress={() => switch_handler(name)}>
                <View style={{ flex: 3 }}>
                    <View style={{ flex: 0.25 }}></View>
                    <View style={{ flex: 1, marginLeft: 20 }}>
                        <Text style={styles.li_water_card_badge}>{name}</Text>
                        <Text style={styles.li_water_card_description}>{description}</Text>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1 }}>
                        <Switch
                            disabled={!loaded}
                            thumbColor={name === "ON" ? ON ? global.accent : "#f4f3f4" : name === "OFF" ? OFF ? global.accent : "#f4f3f4" : Auto ? global.accent : "#f4f3f4"}
                            trackColor={{ true: global.switchtracks }}
                            value={name === "ON" ? ON : name === "OFF" ? OFF : Auto}
                            onValueChange={() => switch_handler(name)}
                        />
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
            </TouchableOpacity>
        );
    }
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); refresh(); }} />}
        >
            {changing ? <ProgressBar indeterminate={true} color={'green'} width={600} height={4} borderRadius={0} borderWidth={0} /> : null}
            <View style={{ flex: 1, margin: 20 }}>
                <Icon name={'sun'} type={'feather'} size={250} color={Color ? 'green' : 'grey'} />
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Card
                        name='Auto'
                        description='House will adjust lights automatically with respect to outside light'
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Card
                        name='ON'
                        description='House will keep the light turned ON until you manually turn it OFF'
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Card
                        name='OFF'
                        description='House will keep the light turned OFF until you manually turn it back ON'
                    />
                </View>
            </View>
        </ScrollView>
    );
}