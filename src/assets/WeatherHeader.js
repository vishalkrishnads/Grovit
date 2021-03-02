import React from 'react'
import { View, Text, Image } from 'react-native'
import GetLocation from 'react-native-get-location'
import * as Progress from 'react-native-progress';
import styles from '../assets/styles'

const images = {
    '01d': require('../img/Icons/01d.png'),
    '01n': require('../img/Icons/01n.png'),
    '02d': require('../img/Icons/02d.png'),
    '02n': require('../img/Icons/02n.png'),
    '03d': require('../img/Icons/03d.png'),
    '03n': require('../img/Icons/03n.png'),
    '04d': require('../img/Icons/04d.png'),
    '04n': require('../img/Icons/04n.png'),
    '09d': require('../img/Icons/09d.png'),
    '09n': require('../img/Icons/09n.png'),
    '10d': require('../img/Icons/10d.png'),
    '10n': require('../img/Icons/10n.png'),
    '11d': require('../img/Icons/11d.png'),
    '11n': require('../img/Icons/11n.png'),
    '13d': require('../img/Icons/13d.png'),
    '13n': require('../img/Icons/13n.png'),
    '50d': require('../img/Icons/50d.png'),
    '50n': require('../img/Icons/50n.png')
}

var moment = require('moment');
export default WeatherHeader = () => {
    let [icon, setIcon] = React.useState(null);
    let [humidity, sethumidity] = React.useState('');
    let [Temperature, settemp] = React.useState('');
    let [Condition, setCondition] = React.useState('');
    let [Precipitation, setprecip] = React.useState('');
    let [loaded, changeloaded] = React.useState(false)
    React.useEffect(() => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {
                let url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + location.latitude + '&lon=' + location.longitude + '&units=metric&appid=90e5ab7481cf91623139e049919e2dd2'
                fetch(url)
                    .then((response) => response.json())
                    .then((json) => {
                        settemp(json.current.temp)
                        sethumidity(json.current.humidity)
                        setIcon(<Image
                            source={images[json.current.weather[0].icon]}
                            style={{ width: 120, height: 120 }}
                        />)
                        setCondition(json.current.weather[0].main)
                        setprecip(json.daily[0].rain)
                        changeloaded(true)
                    })
            })
            .catch(error => {
                const { code, message } = error;
                console.error("Location error code: " + code)
                console.error("Location error message: " + message)
            })
    }, [])
    return (
        <View>
            {loaded ? <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', flex: 5 }}>
                    <View style={{ flex: 0.5 }}></View>
                    <View style={{ flex: 10, flexDirection: 'row' }}>
                        {icon}
                        <View style={styles.header_date_container}>
                            <View style={{ flex: 1 }}><Text style={styles.header_date}>{moment(new Date()).format("MMMM Do, dddd")}</Text><Text style={styles.header_weathercondition}>{Condition}</Text></View>
                        </View>
                    </View>
                </View>
                <View style={styles.meta_box}>
                    <View style={styles.meta_container}><Text style={styles.meta_value}>{humidity}%</Text><Text style={styles.meta_description}>Humidity</Text></View>
                    <View style={styles.meta_container}><Text style={styles.meta_value}>{Temperature}&deg;C</Text><Text style={styles.meta_description}>Temperature</Text></View>
                    <View style={styles.meta_container}><Text style={styles.meta_value}>{Precipitation}mm</Text><Text style={styles.meta_description}>Precipitation</Text></View>
                </View>
            </View> :
                <View style={styles.loader}>
                    <Progress.CircleSnail indeterminate={true} size={50} color={'green'} />
                </View>}
        </View>
    );
}