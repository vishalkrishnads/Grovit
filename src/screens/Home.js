import React from 'react'
import { View, Text, Alert, Dimensions, TouchableOpacity, FlatList, Modal, Keyboard, Vibration, ImageBackground } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { OutlinedTextField } from 'react-native-material-textfield';
import { Button, Icon } from 'react-native-elements';
import { openDatabase } from 'react-native-sqlite-storage';
import WeatherHeader from '../assets/WeatherHeader'
import Details from './Details'
import Watering from './Watering'
import Lighting from './Lighting'
import Analytics from './Analytics'
import To_Do_Elaborated from './ToDo-Elaborated'
import To_Do from './To-Do'
import styles from '../assets/styles'

const Stack = createStackNavigator();
const height = Dimensions.get('window').height;
var db = openDatabase({ name: 'GreenHouse.db' });
var title = '';

const Home = ({ navigation }) => {
    let [flatListItems, setFlatListItems] = React.useState([]);
    let [status, setStatus] = React.useState([]);
    let [name, setName] = React.useState('');
    let [ip, setIP] = React.useState('');
    let [key, setKey] = React.useState('');
    let [prompt, showPrompt] = React.useState(false);
    let [message, showMessage] = React.useState(true);
    let [error1, setError1] = React.useState('');
    let [error2, setError2] = React.useState('');
    let [error3, setError3] = React.useState('');
    let [ui_patch, patch_ui] = React.useState(2);
    const ID = React.useRef(null)
    const KEY = React.useRef(null)

    const refresh_list = () => {
        //refresh cheyyunnu list
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Houses', [], (tx, results) => {
                var temp = [];
                var status_temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                    temp.push(results.rows.item(i));
                status_temp.push(false);
                if (typeof temp !== 'undefined' && temp.length > 0) {
                    setFlatListItems(temp.reverse());
                    setStatus(status_temp);
                    showMessage(false);
                } else {
                    showMessage(true);
                }
            });
        });
    }

    const delete_house = (id) => {
        Vibration.vibrate(40);
        Alert.alert(
            'Confirm Delete',
            'Are you sure want to delete this house?',
            [
                { text: "Cancel", style: 'cancel', onPress: () => { } },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => [
                        //delete the item from DB
                        db.transaction((tx) => {
                            tx.executeSql(
                                'DELETE FROM Houses WHERE house_id=?',
                                [id],
                                () => {
                                    refresh_list();
                                }
                            );
                            tx.executeSql(
                                'DROP TABLE IF EXISTS `' + id.toString() + '`',
                                [],
                            )
                        }),
                    ],
                },
            ]
        );
    }

    const save = () => {
        Keyboard.dismiss();
        //user input check cheyy
        if (!name || !ip || !key) {
            if (!name) {
                setError1("Enter a Name");
            } if (!ip) {
                setError2("Enter your unique ID")
            } if (!key) {
                setError3("Enter your password")
            }
            Vibration.vibrate([100, 100, 100, 100])
            return
        } else {
            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO Houses (house_name, id, api_key) VALUES (?,?,?)',
                    [name, ip, key.toUpperCase()],
                    () => {
                        refresh_list();
                        showPrompt(false);
                        setName('');
                        setIP('');
                        setKey('');
                        setError1('');
                        setError2('');
                        setError3('');
                    }
                );
            });
        }
    }

    React.useEffect(() => {
        //aadhyathe thavana table undakkan (table creation)
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='Houses'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS Houses', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS Houses(house_id INTEGER PRIMARY KEY AUTOINCREMENT, house_name VARCHAR(255), id VARCHAR(7), api_key VARCHAR(16))',
                            []
                        );
                    }
                }
            )
        })
        const unsubscribe = navigation.addListener('focus', () => {
            //aadhyathe pravashyam list undakkunnu
            refresh_list()
        });
        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => {
        patch_ui(1.75)
    };

    const _keyboardDidHide = () => {
        patch_ui(2)
    };

    let listItemView = (item, index) => {
        let temp = status;
        fetch('https://api.thingspeak.com/channels/' + item.id + '/fields/3/last.json?api_key=' + item.api_key)
            .then((response) => response.json())
            .then((json) => {
                if (json === -1) {
                    temp[index] = false
                } else {
                    temp[index] = true;
                }
                setStatus(temp);
            }).catch(() => { temp[index] = false; setStatus(temp) });
        return (
            <TouchableOpacity key={item.house_id} onPress={() => { title = item.house_name, navigation.navigate('Details', { item: item.house_id, trigger: false }) }}>
                <View style={styles.card_root}>
                    <View style={{ flex: 3 }}>
                        <ImageBackground source={require('../img/GreenHouse.jpg')} style={styles.card_image_container} imageStyle={styles.card_image}>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 0.5 }}></View>
                                <View style={{ flex: 5, backgroundColor: global.accent, borderRadius: 50, height: 30 }}>
                                    <Text style={styles.card_name}>{item.house_name}</Text>
                                </View>
                                <View style={{ flex: 6 }}></View>
                            </View>
                            <View style={{ flex: 3 }}></View>
                        </ImageBackground>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 0.5 }}></View>
                        <View style={{ flex: 4 }}>
                            <View style={{ flex: 0.5 }}></View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 0.5 }}></View>
                                <View style={{ flex: 8, flexDirection: 'row' }}>
                                    <Icon name={status[index] ? 'cloud' : 'cloud-off'} type={'feather'} size={20} color={status[index] ? global.accent : 'gray'} />
                                    <Text style={styles.card_network_status}>{status[index] ? 'Online' : 'Offline'}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                        <View style={{ flex: 8, alignItems: 'flex-start' }}>
                            <Button
                                buttonStyle={{ backgroundColor: 'transparent', marginTop: 5 }}
                                icon={
                                    <Icon name={'mic'} type={'material'} color={'grey'}/>
                                }
                                onPress={()=>{title = item.house_name, navigation.navigate('Details', { item: item.house_id, trigger: true })}}
                            />
                        </View>
                        <View style={{ flex: 4 }}>
                            <Button
                                icon={
                                    <Icon
                                        name={'trash'}
                                        size={25}
                                        type={'feather'}
                                        color={'gray'}
                                    />
                                }
                                buttonStyle={styles.prompt_button}
                                onPress={() => delete_house(item.house_id)}
                            />
                        </View>
                        <View style={{ flex: 0.5 }}></View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {message ?
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.blank_message}>Click + to add something</Text>
                </View> :
                <FlatList
                    style={{ alignSelf: 'stretch', height: 540 }}
                    data={flatListItems}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => listItemView(item, index)}
                />}
            {ui_patch === 2 ?
                <View style={styles.bottom}>
                    <Button
                        buttonStyle={[styles.addButton, { backgroundColor: global.accent }]}
                        onPress={() => showPrompt(true)}
                        icon={
                            <Icon name='plus' type='feather' size={40} color='white' />
                        }
                    />
                </View> : null}
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={prompt}
            >
                <View style={styles.modal}>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: ui_patch, alignItems: 'center' }}>
                        <View style={styles.prompt}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.prompt_heading}>Add a device</Text>
                            </View>
                            <View style={{ flex: 1 }, styles.prompt_form}>
                                <OutlinedTextField
                                    label='Device Name'
                                    onChangeText={name => setName(name)}
                                    onSubmitEditing={() => { ID.current.focus() }}
                                    textContentType='givenName'
                                    maxLength={12}
                                    returnKeyType="next"
                                    tintColor={global.accent}
                                    error={error1}
                                />
                                <OutlinedTextField
                                    ref={ID}
                                    label='ID'
                                    onChangeText={ip => setIP(ip)}
                                    onSubmitEditing={() => KEY.current.focus()}
                                    keyboardType='number-pad'
                                    tintColor={global.accent}
                                    maxLength={7}
                                    error={error2}
                                />
                                <OutlinedTextField
                                    ref={KEY}
                                    label='Password'
                                    onChangeText={key => setKey(key)}
                                    onSubmitEditing={save}
                                    tintColor={global.accent}
                                    maxLength={16}
                                    error={error3}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'flex-start', marginRight: 50 }}>
                                <Button title="OK" titleStyle={{ color: global.accent }} onPress={save} buttonStyle={styles.prompt_button} />
                                <Button title="CANCEL" titleStyle={{ color: global.accent }} onPress={() => showPrompt(false)} buttonStyle={styles.prompt_button} />
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
            </Modal>
        </View>
    );
}

export default HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{
                headerTitle: <WeatherHeader />,
                headerStyle: { height: height / 4 }
            }} />
            <Stack.Screen name="Details" component={Details} options={{
                headerTitleAlign: 'center',
                title: title
            }} />
            <Stack.Screen name="Watering" component={Watering} options={{
                headerTitleAlign: 'center',
                title: 'Watering'
            }} />
            <Stack.Screen name="Lighting" component={Lighting} options={{
                headerTitleAlign: 'center',
                title: 'Lighting'
            }} />
            <Stack.Screen name="To-Do" component={To_Do} options={{
                headerTitleAlign: 'center',
                title: 'To Do'
            }} />
            <Stack.Screen name="Analytics" component={Analytics} options={{
                headerTitleAlign: 'center',
                title: 'Analytics & Insights'
            }} />
            <Stack.Screen name="To Do Details" component={To_Do_Elaborated} options={{
                headerTitleAlign: 'center',
                title: 'To Do Task'
            }} />
        </Stack.Navigator>
    );
}