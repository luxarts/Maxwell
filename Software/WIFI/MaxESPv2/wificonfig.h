#ifndef WIFICONFIG_H
#define WIFICONFIG_H
#include <Arduino.h>

class WIFICONFIG{
  public:
    static void InitAP();
    static void InitSTA();
};
#endif
