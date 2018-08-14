#ifndef CONFIG_H
#define CONFIG_H

#include <EEPROM.h>

#define FIRMWARE_VERSION "0.0.9"
#define DEFAULT_WEB_PORT 80
#define DEFAULT_WS_PORT 8888
#define DEFAULT_STA_TIMEOUT 10000
#define DEFAULT_BAUDRATE 250000
#define INIT_DELAY 5000
#define RESET_DELAY 2000
#define EEPROM_SIZE 512
#define RESET_CONFIG_PIN 0

//Modos WIFI
#define MODO_AP   1
#define MODO_STA  2

//Config default
const uint8_t D_STA_IP[] = {192,168,0,90};
const uint8_t D_STA_MASK[] = {255,255,255,0};
#define D_WIFI_MODE MODO_STA
const char D_STA_SSID[] = "Skynet";
const char D_STA_PASSWORD[] = "lu29ni06";
const char AP_SSID[] = "Maxwell3D";
const char AP_PASSWORD[] = "mw3dpassword";//Al menos 8 caracteres

//Posiciones en EEPROM
#define EP_RESET_FLAG     0   //1 byte
#define EP_WIFI_MODE      1   //1 byte
#define EP_STA_SSID       2   //string: 32+1 bytes
#define EP_STA_PASSWORD   35  //string: 20+1 bytes
//#define EP_STA_IP         56  //4 bytes (xxx.xxx.xxx.xxx)
//#define EP_STA_MASK       60  //4 bytes (xxx.xxx.xxx.xxx)

//Max bytes EEPROM
#define MAX_STA_SSID 32
#define MAX_STA_PASSWORD 20

//Prototipos
void CONFIG_writeBuffer(int, const char *);                 //Escribe un vector en una posicion de la EEPROM
//void CONFIG_writeBuffer(int, String);                 //Escribe un String en una posicion de la EEPROM
void CONFIG_readBuffer(int, char *, int);  //Lee una posicion de la EEPROM hasta el '\0' o hasta el maximo y lo guarda en un vector
uint8_t CONFIG_readByte(int);
void CONFIG_writeByte(int, uint8_t);
void CONFIG_reset(void);

#endif
