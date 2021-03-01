import React from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions, Modal, Vibration } from 'react-native'
import { Button, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import SpeechAndroid from 'react-native-android-voice'
import Tts from 'react-native-tts'
import styles from '../components/styles';

var moment = require('moment');
var db = openDatabase({ name: 'GreenHouse.db' });
const height = Dimensions.get('window').height

const Card = ({ badge, icon, color, patch, onpress }) => {
    return (
        <TouchableOpacity onPress={onpress} style={[styles.details_card, { backgroundColor: color }]}>
            <View style={{ flex: 3 }}>
                <View style={{ flex: 0.5 }}></View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 2 }}>
                            <Icon name={icon} type={'feather'} size={40} color={color === 'white' ? 'black' : 'white'} />
                        </View>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: patch, alignItems: 'flex-end' }}>
                            <Text style={[styles.details_card_badge, { color: color === 'white' ? 'black' : 'white' }]}>{badge}</Text>
                        </View>
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
            </View>
        </TouchableOpacity>
    );
}

export default Details = ({ route, navigation }) => {
    const date = new Date()
    const { item } = route.params;
    const { trigger } = route.params;
    let [modal, show_modal] = React.useState(false);
    let [message, set_message] = React.useState('')
    let [response, set_response] = React.useState('')
    React.useEffect(() => {
        if (trigger) {
            show_modal(true)
            listen()
        } else { }
    }, [])
    const listen = async () => {
        set_message('')
        set_response('')
        try {
            const spoken = await SpeechAndroid.startSpeech("Talk to Grovi", SpeechAndroid.ENGLISH_INDIA);
            set_message(spoken)
            Dialogflow_V2.requestQuery(
                spoken,
                result => speak(result),
                error => console.log(error)
            );
        } catch (error) {
            show_modal(false)
        }
    }
    const speak = (response) => {
        if (response.queryResult.fulfillmentText) {
            console.log("Response: " + response.queryResult.fulfillmentText)
            console.warn("Intent triggered: " + response.queryResult.intent.displayName)
            switch (response.queryResult.intent.displayName) {
                case "Date":
                    var text = response.queryResult.fulfillmentText.replace("date", moment(date).format("MMMM Do, dddd"))
                    set_response(text)
                    Tts.speak(text)
                    break;
                case "Lights ON":
                    fetch('http://68.183.81.209/write/1?value=1')
                        .then(() => {
                            set_response(response.queryResult.fulfillmentText)
                            Tts.speak(response.queryResult.fulfillmentText)
                        }).catch(() => {
                            let error = "Oops! I couldn't turn ON the lights. Please check your connection and try again."
                            set_response(error)
                            Tts.speak(error)
                        })
                    break;
                case "Lights OFF":
                    fetch('http://68.183.81.209/write/1?value=0')
                        .then(() => {
                            set_response(response.queryResult.fulfillmentText)
                            Tts.speak(response.queryResult.fulfillmentText)
                        }).catch(() => {
                            let error = "Oops! I couldn't turn OFF the lights. Please check your connection and try again."
                            set_response(error)
                            Tts.speak(error)
                        })
                    break;
                case "Lights Auto":
                    fetch('http://68.183.81.209/write/1?value=3')
                        .then(() => {
                            set_response(response.queryResult.fulfillmentText)
                            Tts.speak(response.queryResult.fulfillmentText)
                        }).catch(() => {
                            let error = "Oops! I couldn't set the lighting to auto. Please check your connection and try again."
                            set_response(error)
                            Tts.speak(error)
                        })
                    break;
                case "Water OFF":
                    fetch('http://68.183.81.209/write/2?value=0')
                        .then(() => {
                            set_response(response.queryResult.fulfillmentText)
                            Tts.speak(response.queryResult.fulfillmentText)
                        }).catch(() => {
                            let error = "Oops! I couldn't turn OFF the tap. Please check your connection and try again."
                            set_response(error)
                            Tts.speak(error)
                        })
                    break;
                case "Water ON":
                    fetch('http://68.183.81.209/write/2?value=1')
                        .then(() => {
                            set_response(response.queryResult.fulfillmentText)
                            Tts.speak(response.queryResult.fulfillmentText)
                        }).catch(() => {
                            let error = "Oops! I couldn't turn ON the tap. Please check your connection and try again."
                            set_response(error)
                            Tts.speak(error)
                        })
                    break;
                case "Water Auto":
                    fetch('http://68.183.81.209/write/2?value=3')
                        .then(() => {
                            set_response(response.queryResult.fulfillmentText)
                            Tts.speak(response.queryResult.fulfillmentText)
                        }).catch(() => {
                            let error = "Oops! I couldn't set the tap to Auto. Please check your connection and try again."
                            set_response(error)
                            Tts.speak(error)
                        })
                    break;
                case "Level":
                    fetch('http://68.183.81.209/3')
                        .then((res) => res.json())
                        .then((json) => {
                            var text = response.queryResult.fulfillmentText.replace("water_level", json + "%")
                            set_response(text)
                            Tts.speak(text)
                        })
                    break;
                case "Everything":
                    fetch('http://68.183.81.209/write/2?value=3')
                        .then(() => {
                            fetch('http://68.183.81.209/write/1?value=3')
                                .then(() => {
                                    set_response(response.queryResult.fulfillmentText)
                                    Tts.speak(response.queryResult.fulfillmentText)
                                }).catch(() => {
                                    let error = "Oops! I couldn't switch the lighting to Auto. Please check your connection and try again."
                                    set_response(error)
                                    Tts.speak(error)
                                })
                        }).catch(() => {
                            let error = "Oops! I couldn't switch the water tap to Auto. Please check your connection and try again."
                            set_response(error)
                            Tts.speak(error)
                        })
                    break;
                // case "ToDo":
                //     Alert.alert("Error undu aliyo. Will fix before 29th.")
                //     db.transaction((tx) => {
                //         tx.executeSql('SELECT * FROM `' + item.toString() + '`', [], (tx, results) => {
                //             var temp = [];
                //             for (let i = 0; i < results.rows.length; ++i)
                //                 temp.push(results.rows.item(i));
                //             if (typeof temp === 'undefined' && temp.length < 0) {
                //                 var text = "You don't have anything in your To Do list"
                //                 set_response(text)
                //                 Tts.speak(text)
                //             }
                //             else {
                //                 var txt = '' 
                //                 temp.forEach(element => {
                //                     var dt = Date.parse(element.date)
                //                     if(date.getDate()===dt.getDate()){
                //                         if(!txt){
                //                             txt.concat(element.title)
                //                         }else{
                //                             txt.concat(", "+element.title)
                //                         }
                //                     }
                //                 })
                //                 console.log("txt: "+txt)
                //                 if(!txt){
                //                     var text = "You have no tasks left for today"
                //                 }else{
                //                     var text = response.queryResult.fulfillmentText.replace("list", txt)
                //                 }
                //                 set_response(text)
                //                 Tts.speak(text)
                //             }
                //         });
                //     });
                //     break;
                default:
                    set_response(response.queryResult.fulfillmentText)
                    Tts.speak(response.queryResult.fulfillmentText)
            }
        } else {
            const error_message = "Sorry, I'm not confident enough to answer that. Please try again."
            set_response(error_message)
            Tts.speak(error_message)
            const evnt = Tts.addEventListener('tts-finish', () => listen());
            return evnt;
        }
    }
    React.useEffect(() => {
        Dialogflow_V2.setConfiguration(
            "grovit-hvfg@appspot.gserviceaccount.com",
            "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFNkTLTrp8iLOK\nHGpFKPF9JGaBxg0+ytfFRBknnI8Fc/PsHYHIeptrI8jp0RYNaJWbbjvWqVSI7DUL\nCoHGRM78eDzsN+Vz5qxg4VdirUUGsk9mnIRIfN/lOlsswRn5atD7eLGVi5E1fgz0\nrNCu1AO6okjoEpKJA3/zhCz49fSRI8C6tfTAJ0Q0SXIE5T/QeGIdgMbM+rXcz7Gf\nb8lZJgiykWwValYdrkMDvrHTChaf32FGtF+A3V7A1bm7oqL4KxOSeylv3yVrqcu1\nkR7UAXzgS9+G7sRKhTdv2y6RdqFFSj3BnEpz3+RJM3NMUqss3aWJtq2zVxhXZaTB\nprQbE3TLAgMBAAECggEAHzf4ivCTD9y6Ay59WiZhmAxXl8qI1TxaDNW7X6xmbZgN\n8H45Scmy6bJ3/x+ErKm2KS05lsEmayhtOyq2IXNKCuhjyIcOsRq+hfWWFj5Uk3tN\nm3JCdJEkBk8HGN4WpQeWPoC8J+64lW23UlI7FLnmPziqbuZlwP/HVP7C+cRBq2nk\nt4EQ2NsLsSBaBEVHlkgnL9LW/3p/ueBvewz9LuKXKB1Z0vTZpvCqgfkfY1Eqpvmb\nqHYgKM4moOxJIbQEvnwfq6TKjWzukc+V14oAaFnrO2rWSXH0dYzMFl5Rm9e712EA\n1m7E7NB3OnSnA+9hj//a9+oOPDcNojyB6r4tI2mK9QKBgQDup+Teu4W1aNFDZ7a+\nw26hTurSebei5EWd9ZgpV6oJQFuoLpIQ02vof2t3TfX9oYaQ/pSaEP9oRYw5ZgTg\nqEme7sAwvBRxUbNslZJ7wUpTXLSzkpPoBGpq0ezXh/VKe6AebBApAafStT2zZ5gp\n3+9wmSMBAJXCq3Nnfaky5VQgjQKBgQDTi1Opgf/kfWsmUeNhwqi3S4TlOmOHulb9\nKMzsGNVV+rqrzFOGJ+PiG4LU8WqpUb64w47okJeKGm+15/Pw3O5rQZIUJh2XBvhw\nyjNSQ2FvonVWBRqYLjydPDEwAhs5xCDuc+u3WaHXPwD6UuWHDY1w65Eqk1xA7KfA\nWZ3KNhzwtwKBgQCW/yE+j1Tsz3G/fQpRriL76ouGOb6nUFh/tZjdZ3rMuayEP1rp\nTGs0whHDfU8LdzxF1t08kU6XsZEj69lgLvnNle+Bpi4k+HVWWVhB9qzJC5nFGBN+\ns/SEu2dngrz+sDNBrEuZNlPxa/yq2vuaWvYKvsk35B/c+E9fBlGcQx60LQKBgAEj\nsfqqwZcYedhF/qSLKN9736ZgbyLPBSLt8lSfOZ7x78l3G0gQtPCF12mQN1PcJdvW\n6dEk3jwXMlzXd//nIL2hJ8lF/0jN986buDUMOd0hEeK5uk/xh9AM//LTQBRKkybV\npwJg0DdZlobCpYvZrdZa3nhNPOT4oVqu4OOy8Or3AoGADdWVO52505wpxcjjbvI/\nsSOwJzwgZIPXqL1CRHqQNh7Lz/1qBWig4w1zedL9PfOStTQuuhia1a8OYMoZCFSs\ni4Tpz/rS+ihvfL4wDwNszC+27UWgBhriowKmpsq/9D8gyGJsx3yrm8xHIDwhYEaW\nnpQRFMqD4BB+uDvX2i+g0Tc=\n-----END PRIVATE KEY-----\n",
            Dialogflow_V2.LANG_ENGLISH_US,
            "grovit-hvfg"
        )
    }, [])
    return (
        <View style={{flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 10 }}>
                <View style={styles.details_image_container}>
                    <Image
                        source={require('../img/GreenHouse.jpg')}
                        style={styles.details_image}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.details_cards_container}>
                        <Card badge={'Lighting'} icon={'sun'} onpress={() => navigation.navigate('Lighting', { item: item })} color={global.accent} patch={1.2} />
                        <Card badge={'Watering'} icon={'droplet'} onpress={() => navigation.navigate('Watering', { item: item })} color={global.accent} patch={1.4} />
                    </View>
                    <View style={[styles.details_cards_container]}>
                        <Card badge={'To Do'} icon={'bar-chart'} onpress={() => navigation.navigate('To-Do', { item: item })} color={'white'} patch={0.8} />
                        <Card badge={'Analytics'} icon={'activity'} onpress={() => navigation.navigate('Analytics', { item: item })} color={'white'} patch={1.4} />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.mic_button_container}>
                <Button
                    buttonStyle={[styles.addButton, { backgroundColor: global.accent, marginBottom: height/8 }]}
                    icon={
                        <Icon name='mic' type='material' size={40} color='white' />
                    }
                    onPress={async () => {
                        Vibration.vibrate(40);
                        show_modal(true);
                        listen()
                    }}
                />
            </View>
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={modal}
            >
                <View style={styles.modal}>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1.5, alignItems: 'center' }}>
                        <View style={styles.assistant_prompt}>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Image
                                        source={require('../img/logo.png')}
                                        style={{ height: 40, width: 40, marginTop: 10 }}
                                    />
                                </View>
                                <View style={{ flex: 9, justifyContent: 'center' }}>
                                    <Text style={styles.assistant_name}>GROVI</Text>
                                </View>
                                <Button
                                    buttonStyle={{ flex: 2, backgroundColor: 'transparent', marginRight: 20, marginTop: 20 }}
                                    icon={
                                        <Icon name={'close'} type={'material'} color={'grey'} size={30} />
                                    }
                                    onPress={() => show_modal(false)}
                                />
                            </View>
                            <View style={{ flex: 4 }}>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    {message ?
                                        <View style={styles.message}>
                                            <Text style={styles.message_text}>{message}</Text>
                                        </View> : null}
                                </View>
                                <View style={{ flex: 1 }}>
                                    {response ?
                                        <View style={[styles.message, { backgroundColor: global.accent, marginRight: 40 }]}>
                                            <Text style={[styles.message_text, { marginLeft: 10 }]}>{response}</Text>
                                        </View> : null}
                                </View>
                            </View>
                            <View style={{ flex: 4, justifyContent: 'center' }}>
                                <Button
                                    buttonStyle={{ width: 80, alignSelf: 'center', backgroundColor: 'transparent' }}
                                    icon={
                                        <Icon name={'mic'} type={'material'} color={'grey'} size={40} />
                                    }
                                    onPress={() => {
                                        listen()
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
            </Modal>
        </View>
    );
}