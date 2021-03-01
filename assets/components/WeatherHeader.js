import React from 'react'
import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import GetLocation from 'react-native-get-location'
import * as Progress from 'react-native-progress';
import styles from '../components/styles'

const images = [
    require('../img/Icons/01d.png'),
    require('../img/Icons/01n.png'),
    require('../img/Icons/02d.png'),
    require('../img/Icons/02n.png'),
    require('../img/Icons/03d.png'),
    require('../img/Icons/04d.png'),
    require('../img/Icons/09d.png'),
    require('../img/Icons/10d.png'),
    require('../img/Icons/10n.png'),
    require('../img/Icons/11d.png'),
    require('../img/Icons/13d.png'),
    require('../img/Icons/50d.png')
]

const imageselector = (code) => {
    var image;
    switch (code) {
        case '01d':
            image = images[0]
            break
        case '01n':
            image = images[1]
            break
        case '02d':
            image = images[2]
            break
        case '02n':
            image = images[3]
            break
        case '03d':
            image = images[4]
            break
        case '03n':
            image = images[4]
            break
        case '04d':
            image = images[5]
            break
        case '04n':
            image = images[5]
            break
        case '09d':
            image = images[6]
            break
        case '09n':
            image = images[7]
            break
        case '10d':
            image = images[7]
            break
        case '10n':
            image = images[8]
            break
        case '11d':
            image = images[9]
            break
        case '11n':
            image = images[9]
            break
        case '13d':
            image = images[10]
            break
        case '13n':
            image = images[10]
            break
        case '50d':
            image = images[11]
            break;
        case '50n':
            image = images[11]
    }
    return image
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
                            source={imageselector(json.current.weather[0].icon)}
                            style={{ width: 120, height: 120 }}
                        />)
                        setCondition(json.current.weather[0].main)
                        setprecip(json.daily[0].rain)
                        changeloaded(true)
                    })
            })
            .catch(error => {
                const { code, message } = error;
                console.error("Location error code: "+code)
                console.error("Location error message: "+message)
            })
    }, [])
    return (
        <SafeAreaView style={styles.header_container}>
            {loaded ? <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        {/* <Image 
                            source={{uri: icon}} 
                            style={{width: 120, height: 120}}
                        /> */}
                        {icon}
                        <View style={styles.date_badge}>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flex: 1 }}><Text style={styles.header_date}>{moment(new Date()).format("MMMM Do, dddd")}</Text><Text style={styles.header_weathercondition}>{Condition}</Text></View>
                            <View style={{ flex: 1 }}></View>
                        </View>
                    </View>
                    <View style={{ flex: 4 }}></View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={styles.meta_container}><Text style={styles.meta_value}>{humidity}%</Text><Text style={styles.meta_description}>Humidity</Text></View>
                    <View style={styles.meta_container}><Text style={styles.meta_value}>{Temperature}&deg;C</Text><Text style={styles.meta_description}>Temperature</Text></View>
                    <View style={styles.meta_container}><Text style={styles.meta_value}>{Precipitation}mm</Text><Text style={styles.meta_description}>Precipitation</Text></View>
                </View>
            </View> :
                <View style={styles.loader}>
                    <Progress.CircleSnail indeterminate={true} size={50} color={'green'} />
                </View>}
        </SafeAreaView>
    );
}