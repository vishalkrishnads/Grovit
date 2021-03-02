import React from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity, Alert, RefreshControl, Vibration } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import * as Progress from 'react-native-progress';
import { Icon } from 'react-native-elements';
import { openDatabase } from 'react-native-sqlite-storage';
import styles from '../assets/styles'

var db = openDatabase({ name: 'GreenHouse.db' });

export default Watering = ({ route, navigation }) => {
    const { item } = route.params
    let [loaded, setLoaded] = React.useState(false);
    let [refreshing, setRefreshing] = React.useState(false)
    let [changing, setChanging] = React.useState(false);
    let [ON, setON] = React.useState(false);
    let [OFF, setOFF] = React.useState(false);
    let [Auto, setAuto] = React.useState(false);
    let [water_level, change_level] = React.useState(0);
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
            "error": `Cannot open your tap as we lost connection with your house.`
        },
        "OFF": {
            "hook": OFF,
            "value": '0',
            "change": (function run() {
                setAuto(false)
                setON(false)
                setOFF(true)
            }),
            "error": `Cannot close your tap as we lost connection with your house. If it's leaking water, please disconnect power immediately`
        },
        "Auto": {
            "hook": Auto,
            "value": '0.5',
            "change": (function run() {
                setON(false)
                setOFF(false)
                setAuto(true)
            }),
            "error": `Cannot switch your water tap to Auto as we lost connection with your house. If it's leaking water, please disconnect power immediately.`
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
                            set_id(results.rows.item(0).id)
                            fetch(`https://api.thingspeak.com/channels/${results.rows.item(0).id}/fields/1/last.json?api_key=${results.rows.item(0).api_key}`)
                                .then((response) => response.json())
                                .then((json) => {
                                    fetch(`https://api.thingspeak.com/channels/${results.rows.item(0).id}/fields/3/last.json?api_key=${results.rows.item(0).api_key}`)
                                        .then((res) => res.json())
                                        .then((jn) => {
                                            change_level(parseInt(jn.field3))
                                            setLoaded(true)
                                        }).catch(() => { Alert.alert('Oops', 'Cannot get the current water level from this house') })
                                    switch_map[value_map[json.field1]].change()
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
        setLoaded(false);
        fetch(`https://api.thingspeak.com/channels/${id}/fields/1/last.json?api_key=${apikey}`)
            .then((response) => response.json())
            .then((json) => {
                fetch(`https://api.thingspeak.com/channels/${id}/fields/3/last.json?api_key=${apikey}`)
                    .then((response) => response.json())
                    .then((json) => {
                        change_level(parseInt(json.field3))
                        setLoaded(true)
                        setRefreshing(false)
                    }).catch(() => { Alert.alert('Oops', 'Cannot get the current water level from this house. Check your internet connections'); setRefreshing(false); setLoaded(true) })
                switch_map[value_map[json.field1]].change()
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
                fetch(`https://api.thingspeak.com/update?api_key=${apikey}&field1=${switch_map[fn].value}`)
                    .then((response) => response.json())
                    .then((json) => {
                        fetch(`https://api.thingspeak.com/channels/${id}/fields/1/last.json?api_key=${apikey}`)
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
            {changing ? <Progress.Bar indeterminate={true} color={'green'} width={600} height={4} borderRadius={0} borderWidth={0} /> : null}
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={styles.progress_container}>
                    <ProgressCircle
                        percent={water_level}
                        radius={160}
                        borderWidth={15}
                        color={water_level < 40 ? 'red' : global.accent}
                        shadowColor="gray"
                        bgColor="#f2f2f2"
                    >
                        <View style={{ flex: 0.75 }}></View>
                        {loaded ?
                            <View style={{ flex: 1.5, alignItems: 'center' }}>
                                <Icon name={'droplet'} type={'feather'} size={50} color={water_level < 40 ? 'red' : global.accent} />
                                <Text style={styles.water_progress}>{water_level}%</Text>
                                <Text style={styles.moisture_badge}>Soil Moisture Level</Text>
                            </View> :
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ flex: 1 }}><Progress.CircleSnail indeterminate={true} size={50} color={'green'} /></View>
                                <View style={{ flex: 1 }}></View>
                            </View>
                        }
                        <View style={{ flex: 1 }}></View>
                    </ProgressCircle>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Card
                        name='Auto'
                        description='House will open tap automatically when water level falls below 50%'
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Card
                        name='ON'
                        description='House will keep the water tap open until you manually turn it OFF'
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Card
                        name='OFF'
                        description='House will keep the water tap closed until you manually turn it back ON'
                    />
                </View>
            </View>
        </ScrollView>
    );
}