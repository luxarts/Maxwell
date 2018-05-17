#ifndef CONFIG_H
#define CONFIG_H

String FIRMWARE_VERSION = "0.0.1";
#define DEFAULT_WEB_PORT 80
#define DEFAULT_WS_PORT 8888
#define DEFAULT_STA_TIMEOUT 20000
#define DEFAULT_BAUDRATE 115200

static const char DEFAULT_STA_IP[] PROGMEM = {192,168,0,90};
static const char DEFAULT_STA_SUBNET[] PROGMEM = {192,168,0,90};

static const char STA_SSID[] PROGMEM = "Skynet";
static const char STA_PASSWORD[] PROGMEM = "lu29ni06";

#endif
