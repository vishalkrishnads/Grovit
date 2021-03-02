import { Dimensions, StyleSheet } from 'react-native'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({

    //header start
    header_container: {
        elevation: 1,
    },
    header_date: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'gray'
    },
    header_weathercondition: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold'
    },
    date_badge: {
        marginTop: height / 40
    },
    meta_container: {
        flex: 1,
        marginLeft: width / 20,
        marginBottom: 40,
        alignItems: 'center'
    },
    meta_value: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 28
    },
    meta_description: {
        color: 'gray',
        fontWeight: 'bold'
    },
    loader: {
        alignItems: 'center',
        marginLeft: width / 2.5
    },
    //header end

    // HOME SCREEN START    

    //Add a House prompt start
    modal: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1
    },
    prompt: {
        backgroundColor: 'white',
        width: width / 1.25,
        height: 300,
        alignItems: 'center',
        borderRadius: 50
    },
    prompt_heading: {
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 10
    },
    prompt_form: {
        width: width / 2
    },
    prompt_button: {
        backgroundColor: 'white'
    },
    //Add a House Prompt end

    //Card start
    card_root: {
        margin: 20,
        marginBottom: 0,
        backgroundColor: 'white',
        height: 200,
        borderRadius: 30
    },
    card_image_container: {
        width: width - 40,
        height: '100%',
    },
    card_image: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    card_badge: {
        flex: 5,
        backgroundColor: global.accent,
        borderRadius: 50,
        height: 30
    },
    card_name: {
        marginLeft: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
    blank_message: {
        fontWeight: 'bold',
        color: 'gray',
        marginTop: height / 3.5
    },
    card_network_status: {
        fontSize: 15,
        color: 'gray',
        fontWeight: 'bold',
        marginLeft: 5
    },
    //Card end

    //Home Button start
    addButton: {
        height: 70,
        width: 70,
        marginBottom: 20,
        borderRadius: 100,
    },
    bottom: {
        height: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    //Home Add Button end

    // HOME SCREEN END

    // DETAILS SCREEN START

    //Details Main Image start
    details_image_container: {
        flex: 1,
        marginTop: 20,
        marginLeft: 15
    },
    details_image: {
        width: width - 30,
        height: height / 3,
        borderRadius: 30
    },
    //Details Main Image end

    // Details page cards start
    details_cards_container: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        marginBottom: 0
    },
    details_card: {
        flex: 1,
        width: width / 3,
        height: height / 5,
        margin: 10,
        marginBottom: 0,
        borderRadius: 30,
    },
    details_card_badge: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5
    },
    // Details page card end

    //Details assistant start
    mic_button_container: {
        // height: 0.5,
        flex: 0,
        height: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    assistant_prompt: {
        flex: 1,
        backgroundColor: 'white',
        width: width - 50,
        borderRadius: 50,
    },
    assistant_name: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 18
    },
    message: {
        height: 'auto',
        backgroundColor: 'grey',
        margin: 20,
        padding: 10,
        borderRadius: 50
    },
    message_text: {
        color: 'white',
        fontSize: 15
    },
    //DETAILS SCREEN END

    //WATERING SCREEN START

    //Circular Progress start
    progress_container: {
        margin: 20,
        flexDirection: 'row'
    },
    water_progress: {
        fontSize: 50,
        color: global.accent
    },
    moisture_badge: {
        fontSize: 18,
        color: 'gray',
        fontWeight: 'bold'
    },
    //Circular Progress end

    //Light and Water screen cards start
    li_water_card: {
        flex: 1,
        width: '90%',
        height: 100,
        borderRadius: 30,
        backgroundColor: 'white',
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row'
    },
    li_water_card_badge: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    li_water_card_description: {
        color: 'gray',
        fontSize: 15,
        fontWeight: 'bold'
    },
    //Light and water screen cards end

    //PROFILE SCREEN START
    profile_pic: {
        borderRadius: 150,
        width: 250,
        height: 250,
        margin: 10
    },
    profile_name: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'black'
    },
    profile_card: {
        flex: 1,
        width: '90%',
        height: 100,
        borderRadius: 30,
        backgroundColor: 'white',
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row'
    },
    profile_card_badge: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    profile_card_data: {
        color: 'gray',
        fontSize: 20,
        marginRight: 20
    },
    //PROFILE SCREEN END

    //TODO SCREENS START

    //To Do Cards start
    todo_card_root: {
        width: '93%',
        height: 100,
        backgroundColor: 'white',
        margin: 15,
        borderRadius: 30,
        flexDirection: 'row'
    },
    todo_card_heading: {
        fontSize: height / 40,
        fontWeight: 'bold',
        color: 'black'
    },
    todo_card_description: {
        color: 'gray',
        fontSize: height / 60,
        flexShrink: 1
    },
    //To Do Cards end

    //To Do Elaborated screen start
    to_do_heading: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 40,
        marginTop: 0,
        color: 'black'
    },
    to_do_content_holder: {
        backgroundColor: 'white',
        width: '90%',
        height: height / 2,
        alignSelf: 'center',
        borderRadius: 30
    },
    to_do_date: {
        color: 'gray',
        alignSelf: 'center',
        fontSize: 20,
        marginBottom: 10
    },
    to_do_content: {
        margin: 20,
        fontSize: 15,
        color: 'black'
    },
    to_do_day: {
        fontSize: 22,
        color: 'gray',
        alignSelf: 'center'
    },
    to_do_month: {
        fontSize: 15,
        color: 'gray'
    },
    to_do_lp_message: {
        margin: 10,
        alignSelf: 'center',
        color: 'gray'
    },
    //To Do Elaborated screen end

    //TODO SCREENS END

    //TIPS SCREENS START
    tips_card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 30,
        height: 100,
        width: width - 20,
        flexDirection: 'row',
        marginBottom: 10
    },
    tips_card_image: {
        height: 80,
        width: 80,
        borderRadius: 50,
        margin: 10,
        marginLeft: 20
    },
    tips_card_heading: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold'
    },
    tips_card_description: {
        fontSize: 15,
        color: 'gray',
        flexShrink: 1,
        marginRight: 10
    },
    tips_image: {
        width: 150,
        height: 150,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: 10
    },
    // TIPS SCREENS END

    //ANALYTICS SCREEN START
    analytics_card: {
        flex: 1,
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 30,
        height: height / 2.8
    },
    analytics_heading_container: {
        flex: 1,
        flexDirection: 'row',
        margin: 20,
        alignItems: 'flex-start'
    },
    analytics_heading: {
        fontSize: 25,
        marginTop: 10,
        marginLeft: 5
    },
    analytics_graph_container: {
        flex: 3,
        margin: 20,
        marginTop: 0
    },
})