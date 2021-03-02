import React from 'react'
import { View, Text, Modal, Vibration, Keyboard, FlatList, TouchableOpacity, Alert, Dimensions, StatusBar } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';
import { OutlinedTextField } from 'react-native-material-textfield';
import { Button, Icon } from 'react-native-elements';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from '../assets/styles'

var moment = require('moment')
var db = openDatabase({ name: 'GreenHouse.db' });
const width = Dimensions.get('window').width;

export default To_Do = ({ route, navigation }) => {
    const { item } = route.params;
    let [flatListItems, setFlatListItems] = React.useState([]);
    let [title, setTitle] = React.useState('');
    let [description, setDescription] = React.useState('');
    let [date, setDate] = React.useState('');
    let [prompt, showPrompt] = React.useState(false);
    let [message, showMessage] = React.useState(true);
    let [datepicker, showDatePicker] = React.useState(false);
    let [error1, setError1] = React.useState('');
    let [error2, setError2] = React.useState('');
    let [error3, setError3] = React.useState('');
    let [ui_patch, patch_ui] = React.useState(2);
    const Description_field = React.useRef(null)
    const Date_field = React.useRef(null);
    const refresh_list = () => {
        //refresh cheyyunnu list
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM `' + item.toString() + '`', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                    temp.push(results.rows.item(i));
                temp.forEach(element => {
                    console.log(element.date)
                })
                if (typeof temp !== 'undefined' && temp.length > 0) {
                    setFlatListItems(temp.reverse());
                    showMessage(false);
                } else {
                    showMessage(true);
                }
            });
        });
    }
    const mark_as_done = (id) => {
        Vibration.vibrate(40);
        Alert.alert(
            'Mark As Done',
            'Are you sure want to mark this task as done and remove it?',
            [
                { text: "Cancel", style: 'cancel', onPress: () => { } },
                {
                    text: 'Mark As Done',
                    style: 'destructive',
                    onPress: () => [
                        //delete the item from DB
                        db.transaction((tx) => {
                            tx.executeSql(
                                'DELETE FROM `' + item.toString() + '` WHERE todo_id=?',
                                [id],
                                () => {
                                    refresh_list();
                                }
                            );
                        }),
                    ],
                },
            ]
        );
    }
    const save = () => {
        Keyboard.dismiss();
        //user input check cheyy
        if (error3) {
            Vibration.vibrate([100, 100, 100, 100])
            return;
        }
        if (!title || !description || !date) {
            if (!title) {
                setError1("Enter a Name");
                Vibration.vibrate([100, 100, 100, 100])
                return;
            } if (!description) {
                setError2("Enter a description")
                Vibration.vibrate([100, 100, 100, 100])
                return;
            } if (!date) {
                setError3("Pick a date")
                Vibration.vibrate([100, 100, 100, 100])
                return;
            }
        } else {
            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO `' + item.toString() + '` (title, description, date) VALUES (?,?,?)',
                    [title, description, date.toISOString()],
                    () => {
                        refresh_list();
                        showPrompt(false);
                        setName('');
                        setIP('');
                        setDate('');
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
                'CREATE TABLE IF NOT EXISTS `' + item.toString() + '`(todo_id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(50), description VARCHAR(255), date VARCHAR(200))',
                []
            );
        })
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name=`" + item.toString() + "`",
                [],
            );
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

    const date_selected = (dt) => {
        showDatePicker(false);
        Date_field.current.setValue(moment(dt).format("MMMM Do YYYY"));
        if (dt < new Date()) { setError3('Date has already passed'); return }
        if (dt > new Date()) { setError3('') }
        setDate(dt);
    }

    let listItemView = (item, index) => {
        const dt = new Date();
        const dt1 = Date.parse(item.date);
        dt.setTime(dt1);
        return (
            <TouchableOpacity onPress={() => navigation.navigate('To Do Details', { title: item.title, description: item.description, date: item.date })} onLongPress={() => mark_as_done(item.todo_id)}>
                <View style={styles.todo_card_root}>
                    <View style={{ flex: 0.2 }}></View>
                    <View style={{ flex: 3 }}>
                        <View style={{ flex: 0.5 }}></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.todo_card_heading}>{item.title}</Text>
                            <Text style={styles.todo_card_description}>{item.description}</Text>
                        </View>
                        <View style={{ flex: 0.5 }}></View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{ flex: 0.5 }}></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.to_do_day}>{moment(dt).format("D")}</Text>
                            <Text style={styles.to_do_month}>{moment(dt).format("MMM")}</Text>
                        </View>
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar
                animated={true}
                backgroundColor={prompt?'rgba(0,0,0,0.5)':"white"}
                barStyle="dark-content" />
            {message ?
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.blank_message}>Click + to add something</Text>
                </View> :
                <View>
                    <View style={{ flex: 0.2 }}>
                        <Text style={styles.to_do_lp_message}>Long press on a task to mark it as done</Text>
                    </View>
                    <View style={{ flex: 10, width: width }}>
                        <FlatList
                            style={{ alignSelf: 'stretch', height: 540, marginTop: 10 }}
                            data={flatListItems}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => listItemView(item, index)}
                        />
                    </View>
                </View>
            }
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
                        <View style={[styles.prompt, { height: 300 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.prompt_heading}>Add a Task</Text>
                            </View>
                            <View style={{ flex: 1 }, styles.prompt_form}>
                                <OutlinedTextField
                                    label='Name'
                                    onChangeText={title => setTitle(title)}
                                    onSubmitEditing={() => { Description_field.current.focus() }}
                                    textContentType='givenName'
                                    maxLength={12}
                                    returnKeyType="next"
                                    tintColor={global.accent}
                                    error={error1}
                                />
                                <OutlinedTextField
                                    ref={Description_field}
                                    label='Description'
                                    onChangeText={description => setDescription(description)}
                                    onSubmitEditing={save}
                                    multiline={true}
                                    tintColor={global.accent}
                                    error={error2}
                                />
                                <TouchableOpacity onPress={() => { setError3(''); showDatePicker(true) }}>
                                    <OutlinedTextField
                                        ref={Date_field}
                                        label='Date'
                                        editable={false}
                                        tintColor={global.accent}
                                        error={error3}
                                    />
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={datepicker}
                                    mode="date"
                                    onConfirm={date_selected}
                                    onCancel={() => showDatePicker(false)}
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