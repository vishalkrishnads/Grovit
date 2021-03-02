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
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT id, api_key FROM Houses where house_id = ?',
                    [item],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            apikey = results.rows.item(0).api_key
                            id = results.rows.item(0).id;
                            if (id === '1275162') {
                                fetch('http://68.183.81.209/1')
                                    .then((response) => response.json())
                                    .then((js) => {
                                        console.log("Light Switch Value: " + js)
                                        fetch('http://68.183.81.209/4')
                                            .then((res) => res.json())
                                            .then((json) => {
                                                console.log("Day night status value: " + json)
                                                if (json === 1) {
                                                    set_color(true)
                                                } else if (json === 0) {
                                                    set_color(false)
                                                }
                                            })
                                        if (js === 1) {
                                            setON(true)
                                        } else if (js === 0) {
                                            setOFF(true)
                                        } else if (js === 3) {
                                            setAuto(true)
                                        }
                                        setLoaded(true);
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
                                fetch('https://api.thingspeak.com/channels/1275162/fields/1/last.json?api_key=' + apikey)
                                    .then((response) => response.json())
                                    .then((json) => {
                                        console.log("Light Switch value: " + json.field1)
                                        if (json.field1 === '1') {
                                            setON(true)
                                        } else if (json.field1 === '0') {
                                            setOFF(true)
                                        } else if (json.field1 === '3') {
                                            setAuto(true)
                                        }
                                        setLoaded(true);
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
        if (id === "1275162") {
            fetch('http://68.183.81.209/1')
                .then((response) => response.json())
                .then((json) => {
                    console.log("Light Switch Value: " + json)
                    fetch('http://68.183.81.209/4')
                        .then((res) => res.json())
                        .then((js) => {
                            if (js === 1) {
                                set_color(true)
                            } else if (js === 0) {
                                set_color(false)
                            }
                        })
                    if (json === 1) {
                        setOFF(false)
                        setAuto(false)
                        setON(true)
                    } else if (json === 0) {
                        setON(false)
                        setAuto(false)
                        setOFF(true)
                    } else if (json === 3) {
                        setON(false)
                        setOFF(false)
                        setAuto(true)
                    }
                    setLoaded(true);
                    setRefreshing(false)
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
            fetch('https://api.thingspeak.com/channels/1275162/fields/1/last.json?api_key=' + apikey)
                .then((response) => response.json())
                .then((json) => {
                    console.log("Light Switch value: " + json.field1)
                    if (json.field1 === '1') {
                        setOFF(false)
                        setAuto(false)
                        setON(true)
                    } else if (json.field1 === '0') {
                        setON(false)
                        setAuto(false)
                        setOFF(true)
                    } else if (json.field1 === '3') {
                        setON(false)
                        setOFF(false)
                        setAuto(true)
                    }
                    setLoaded(true);
                    setRefreshing(false);
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
    }
    const switch_handler = (fn) => {
        setChanging(true)
        if (id === '1275162') {
            if (fn === "ON") {
                if (ON) { switch_handler("OFF") } else {
                    fetch('http://68.183.81.209/write/1?value=1')
                        .then(() => {
                            setAuto(false)
                            setOFF(false)
                            setON(true)
                        })
                }
            } else if (fn === "OFF") {
                if (OFF) { } else {
                    fetch('http://68.183.81.209/write/1?value=0')
                        .then(() => {
                            setAuto(false)
                            setON(false)
                            setOFF(true)
                        })
                }
            } else if (fn === "Auto") {
                if (Auto) { switch_handler("OFF") } else {
                    fetch('http://68.183.81.209/write/1?value=3')
                        .then(() => {
                            setOFF(false)
                            setON(false)
                            setAuto(true)
                        })
                }
            }
        } else {
            if (fn === "ON") {
                if (ON) { switch_handler("OFF") } else {
                    fetch('https://api.thingspeak.com/update?api_key=' + apikey + '&field1=1')
                        .then((response) => response.json())
                        .then((json) => {
                            fetch('https://api.thingspeak.com/channels/1275162/fields/1/last.json?api_key=' + apikey)
                                .then((res) => res.json())
                                .then((jn) => {
                                    if (jn.entry_id == json) {
                                        setAuto(false)
                                        setOFF(false)
                                        setON(true)
                                    } else { Vibration.vibrate([100, 100, 100, 100]); Alert.alert('Error', "15 second delay window isn't over. Please wait 15 secods before trying again") }
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
                        .catch(() => Alert.alert('Uh Oh', 'Cannot turn ON your tap as we lost connection with your house.'))
                }
            } else if (fn === "OFF") {
                if (OFF) { } else {
                    fetch('https://api.thingspeak.com/update?api_key=' + apikey + '&field1=0')
                        .then((response) => response.json())
                        .then((json) => {
                            fetch('https://api.thingspeak.com/channels/1275162/fields/1/last.json?api_key=' + apikey)
                                .then((res) => res.json())
                                .then((jn) => {
                                    if (jn.entry_id == json) {
                                        setAuto(false)
                                        setON(false)
                                        setOFF(true)
                                    } else { Vibration.vibrate([100, 100, 100, 100]); Alert.alert('Error', "15 second delay window isn't over. Please wait 15 secods before trying again") }
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
                        .catch(() => Alert.alert('Uh Oh', "Cannot turn OFF your tap as we lost connection with your house. If it's leaking or overflowing water, please diconnect power from the house immediately."))
                }
            } else if (fn === "Auto") {
                if (Auto) { switch_handler("OFF") } else {
                    fetch('https://api.thingspeak.com/update?api_key=' + apikey + '&field1=0.5')
                        .then((response) => response.json())
                        .then((json) => {
                            fetch('https://api.thingspeak.com/channels/1275162/fields/1/last.json?api_key=' + apikey)
                                .then((res) => res.json())
                                .then((jn) => {
                                    if (jn.entry_id == json) {
                                        setON(false)
                                        setOFF(false)
                                        setAuto(true)
                                    } else { Vibration.vibrate([100, 100, 100, 100]); Alert.alert('Error', "15 second delay window isn't over. Please wait 15 secods before trying again") }
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
                        .catch(() => Alert.alert('Uh Oh', "Cannot switch your tap to Auto as we lost connection with your house. If it's leaking or overflowing water, please diconnect power from the house immediately."))
                }
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