# Grovit
This project combines the possibilities of IoT microcontrollers, mobile apps and cloud computing services to make house farming and gardening a breeze for busy professionals. This README will guide you through to give you an understanding about the structure of the project, covering the basics of the cicuit and then explaining how to use this app to control the device and grow your plants. If you want to build the app from source, then please refer to the contributing guide.

<a><img src="https://github.com/vishalkrishnads/Grovit/blob/master/.github/Screenshots/adding.png?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishalkrishnads/Grovit/blob/master/.github/Screenshots/home.png?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishalkrishnads/Grovit/blob/master/.github/Screenshots/details.png?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishalkrishnads/Grovit/blob/master/.github/Screenshots/watering.png?raw=true" height="420" width="200" ></a>

## What's this?
This project consists of a device equipped with moisture and light sensors with the facility to grow greenhouse and indoor plants inside of it as well as a mobile app and a cloud server. While growing a plant, the users can leave the headache of watering and lighting them regularly entirely to the device. With the powerful software running inside the app, users will be able to monitor and control the water and lighting that their plant recieves, as well as view monthly overall performance graphs of the plants, get tips, set to do lists for each device and much more.

## Prerequisites
* A smartphone running Android 8.0+
* A good internet connection
* Dummy credentials for a [ThingSpeak](https://thingspeak.com) channel. If you don't wanna create an account for yourself, use our credentials:
  * ID: 1371522
  * Password: FWSEJN2A2UOMPZ6H
* Optionally, set up the cicuit as explained in the cicuits section 

## Setting up the app
1. Install the app on your android device by following this link
2. Open it and grant all necessary permissions
3. Add a device using the dummy credentials or by creating a ThingSpeak channel with 4 fields and then using it's credentials. While creating a channel, please follow the same pattern as that of our [demo channel](https://thingspeak.com/channels/1315722).
4. Select the device that you added
5. Now, you can interact with your device through Grovi, a virtual assistant or by directly switching values from the app.

## Setting up your microcontrollers (optional)
1. Complete the connections as per the circuit diagram and upload the `NodeMCU.ino` found in the `controllers/` directory in this repo. If you're using Arduino to power the relay, upload `Arduino.ino` to the arduino too.
2. Power up the cicuit

## Testing
Now, you should be able to switch the Lights and water tap ON & OFF from the app itself. If you have set up the microcontrollers, once they've connected to Wi-Fi, you should be able to see the lights and water pump responding to your commands from the app.
