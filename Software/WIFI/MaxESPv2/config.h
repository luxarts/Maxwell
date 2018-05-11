#include <Arduino.h>
//General
#define DEFAULT_BAUDRATE 115200
#define EEPROM_SIZE 512

//Wifi
#define DEFAULT_CHANNEL 11
#define DEFAULT_STA_TIMEOUT 20000
const char DEFAULT_AP_SSID[] PROGMEM = "Maxwell3D";
const char DEFAULT_AP_PASSWORD[] PROGMEM = "maxwellpass";
const char DEFAULT_STA_SSID[] PROGMEM = "USERSSID";
const char DEFAULT_STA_PASSWORD[] PROGMEM = "USERPASS";
const byte DEFAULT_IP[] = {192,168,0,99};
const byte DEFAULT_MASK[] = {255,255,255,0};
const int DEFAULT_WEB_PORT = 80;
const int DEFAULT_DATA_PORT = 8888;

