# Grovit
### [Get the app](https://drive.google.com/file/d/1Ok9KaMp1aSh3Tp1zmp3DB-eL4I84cjbG/view?usp=sharing)
This project combines the possibilities of IoT microcontrollers, mobile apps and cloud computing services to make house farming and gardening a breeze for busy professionals. This README will guide you through to give you an understanding about the structure of the project, covering the basics of the circuit and then explaining how to use this app to control the device and grow your plants. If you want to build the app from source, then please refer to the contributing guide.

<a><img src="https://github.com/vishalkrishnads/Grovit/blob/master/.github/Screenshots/adding.png?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishalkrishnads/Grovit/blob/master/.github/Screenshots/home.png?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishalkrishnads/Grovit/blob/master/.github/Screenshots/details.png?raw=true" height="420" width="200" ></a>
<a><img src="https://github.com/vishalkrishnads/Grovit/blob/master/.github/Screenshots/watering.png?raw=true" height="420" width="200" ></a>

## Disclaimer
This software was developed for the CSI InApp International Project Awards 2021 being conducted in partnership with the Kerala Technological University. If you're a judge of the competition and are visiting this repo for judging, kindly note the following:
* Although this is open to outsiders to contribute via GitHub, it should be noted that we as a team, haven't received and/or accepted any contributions for this repo as of now. All pull requests, whether open or closed, can be viewed by going to the [Pull Requests](https://github.com/vishalkrishnads/Grovit/pulls) tab of this repo. 
* We have abided by the rules of the competition and haven't changed and/or improved anything on or after the last date for the submission of abstracts, 10th April, 2021. All the commits of this repo are available [here](https://github.com/vishalkrishnads/Grovit/commits/master) to check. You can also directly go to the commits page of this repo to check yourself, if you prefer.

## What's this?
This project consists of a device equipped with moisture and light sensors with the facility to grow greenhouse and indoor plants inside of it as well as a mobile app and a cloud server. While growing a plant, the users can leave the headache of watering and lighting them regularly entirely to the device. With the powerful software running inside the app, users will be able to monitor and control the water and lighting that their plant recieves, as well as view monthly overall performance graphs of the plants, get tips, set to do lists for each device and much more.

## Prerequisites
* A smartphone running Android 8.0+
* A good internet connection
* Dummy credentials for a [ThingSpeak](https://thingspeak.com) channel. If you don't wanna create an account for yourself, use our credentials:
  * ID: 1315722
  * Password: FWSEJN2A2UOMPZ6H
* Optionally, set up the cicuit as explained in the cicuits section 

## Setting up the app
1. Install the app on your android device by following [this link](https://drive.google.com/file/d/1Ok9KaMp1aSh3Tp1zmp3DB-eL4I84cjbG/view?usp=sharing) from the device to start the installation automatically.
2. Open it and grant all necessary permissions
3. Add a device using the dummy credentials or by creating a ThingSpeak channel with 4 fields and then using it's credentials. While creating a channel, please follow the same pattern as that of our [demo channel](https://thingspeak.com/channels/1315722).
4. Select the device that you added
5. Now, you can interact with your device through Grovi, a virtual assistant or by directly switching values from the app.
If you want way more granular control over the app or want to build it from source, check out the [directory structure & contribution guide](https://github.com/vishalkrishnads/Grovit/blob/master/.github/Code%20Structure.md).

## Setting up your microcontrollers (optional)
1. Complete the connections as per the [circuit guide](https://github.com/vishalkrishnads/Grovit/blob/master/.github/Circuitry.md) and upload the `microcontroller.ino` found in the `microcontroller/` directory in this repo.
2. Power up the cicuit

## Testing
Now, you should be able to switch the Lights and water tap ON & OFF from the app itself. If you have set up the microcontrollers, once they've connected to Wi-Fi, you should be able to see the lights and water pump responding to your commands from the app.

## Grovi
Grovi is our virtual assistant built into the app itself. It can do many things such as controlling the light and water pump, tell you the weather and do much more. You can activate Grovi for each farm from within the details of that farm by clicking on the green mic button. You can ask her things like:
* Turn on the lights
* Take care of everything
* What's the climate?

## Features
The app has many features to assist gardeners which includes, but is not limited to:
1. To Do Lists
2. Ability to add tips from expert farmers for the not-so experienced ones to follow
3. Monthly Analytics & graphs for water usage and lighting history
4. Ability to implement account based data saving and cloud storage within the app
