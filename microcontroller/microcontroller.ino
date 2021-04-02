/*
 * Written for CSInApp competition
 * Sketch for NodeMCU microcontroller of Grovit device
 * Author: Team from St. Thomas Institute Of Science & Technology
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ThingSpeak.h>
#define LIGHT1 D1
#define LIGHT2 D5
#define LIGHT3 D6
#define LIGHT4 D7
#define LIGHT5 D6
#define PUMP D4
#define LDR D0
#define INDICATOR D2

const char *ssid = "<your Wi-FI SSID>";
const char *password = "<your password>";
unsigned long channelnumber = 12345;
const char * APIkey = "xxxxxxxxxxxxxxxx";

WiFiClient client;

int i = 0;

long measure_moisture()
{
  Serial.print("MOISTURE LEVEL : ");
  int value = analogRead(0);
  value = (100 - ((value / 1023.00) * 100));
  Serial.println(value);
  return value;
}

void lights(boolean function) {
  if (function) {
    digitalWrite(LIGHT1, HIGH);
    digitalWrite(LIGHT2, HIGH);
    digitalWrite(LIGHT3, HIGH);
    digitalWrite(LIGHT4, HIGH);
    digitalWrite(LIGHT5, HIGH);
    Serial.print("Lights turned ON");
  } else {
    digitalWrite(LIGHT1, LOW);
    digitalWrite(LIGHT2, LOW);
    digitalWrite(LIGHT3, LOW);
    digitalWrite(LIGHT4, LOW);
    digitalWrite(LIGHT5, LOW);
    Serial.print("Lights turned OFF");
  }
}

int read_field(int field) {
  long payload = ThingSpeak.readLongField(channelnumber, field, APIkey);
  int statusCode = ThingSpeak.getLastReadStatus();
  if (statusCode == 200)
  {
    return payload;
  }
  else
  {
    Serial.println("Unable to read channel / No internet connection");
  }
}

void write_field(int Value, int field)
{
  ThingSpeak.writeField(channelnumber, field, Value, APIkey);
}

void setup()
{
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  pinMode(INDICATOR, OUTPUT);
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(INDICATOR, HIGH);
    delay(1000);
    digitalWrite(INDICATOR, LOW);
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  ThingSpeak.begin(client);
  pinMode(PUMP, OUTPUT);
  pinMode(LIGHT1, OUTPUT);
  pinMode(LIGHT2, OUTPUT);
  pinMode(LIGHT3, OUTPUT);
  pinMode(LIGHT4, OUTPUT);
  pinMode(LIGHT5, OUTPUT);
  pinMode(LDR, INPUT);
}

void loop()
{
  int water_level = (measure_moisture() * 2);
  write_field(water_level, 3);
  int watering_mode = read_field(2);
  int value = digitalRead(LDR);
  if (value == HIGH) {
    Serial.println("It's night");
    write_field(0, 4);
  } else if (value == LOW) {
    Serial.println("It's day");
    write_field(1, 4);
  }
  if (watering_mode == 1)
  {
    Serial.println("Tap is opening");
    digitalWrite(PUMP, LOW);
  }
  else if (watering_mode == 0)
  {
    Serial.println("Tap is closing");
    digitalWrite(PUMP, HIGH);
  }
  else
  {
    Serial.println("Running in Auto mode");
    Serial.println(water_level);
    if (water_level < 50) {
      Serial.println("Tap is opening");
      digitalWrite(PUMP, LOW);
    } else {
      Serial.println("Tap is closing");
      digitalWrite(PUMP, HIGH);
    }
  }

  int lighting_mode = read_field(1);
  if (lighting_mode == 1)
  {
    Serial.println("Light is turning ON");
    lights(true);
  }
  else if (lighting_mode == 0)
  {
    Serial.println("Light is going OFF");
    lights(false);
  }
  else
  {
    Serial.println("Engaging Auto mode");
    if (value == HIGH) {
      lights(true);
    } else if (value == LOW) {
      lights(false);
    }
  }
}
