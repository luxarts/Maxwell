#ifndef CONFIG_H
#define CONFIG_H

String FIRMWARE_VERSION = "0.0.1";
#define DEFAULT_WEB_PORT 80
#define DEFAULT_WS_PORT 8888
#define DEFAULT_STA_TIMEOUT 20000
#define DEFAULT_BAUDRATE 115200
#define INIT_DELAY 5000

static const char DEFAULT_STA_IP[] PROGMEM = {192,168,0,90};
static const char DEFAULT_STA_SUBNET[] PROGMEM = {192,168,0,90};

const char STA_SSID[] = "Skynet";
const char STA_PASSWORD[] = "lu29ni06";

#endif
