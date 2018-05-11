#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <WiFiClient.h>
#include "config.h"
#include "wificonfig.h"

ESP8266WebServer web(DEFAULT_WEB_PORT);

void setup() {
  //Inicia el puerto serie
  Serial.begin(DEFAULT_BAUDRATE);
  //Intenta conectar a la red
  WIFICONFIG::InitSTA();
}

void loop() {
}
