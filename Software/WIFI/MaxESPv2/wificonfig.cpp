#include "config.h"
#include "wificonfig.h"
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiClient.h>

void WIFICONFIG::InitAP(){  
  WiFi.disconnect(); //Apaga el wifi
  WiFi.mode(WIFI_AP); //Modo AP
  
  IPAddress local_ip(DEFAULT_IP[0],DEFAULT_IP[1],DEFAULT_IP[2],DEFAULT_IP[3]);
  IPAddress gateway(DEFAULT_IP[0],DEFAULT_IP[1],DEFAULT_IP[2],DEFAULT_IP[3]);
  IPAddress subnet(DEFAULT_MASK[0],DEFAULT_MASK[1],DEFAULT_MASK[2],DEFAULT_MASK[3]);
  
  WiFi.softAPConfig(local_ip, gateway, subnet);//Configura los parametros
  WiFi.softAP(DEFAULT_AP_SSID, DEFAULT_AP_PASSWORD);
  
  //Informa por display
  Serial.println(F("M117 Punto de acceso creado"));
  delay(1000);
  Serial.print(F("M117 IP: "));
  Serial.print(WiFi.softAPIP());
}

void WIFICONFIG::InitSTA(){
  String dots= "";
  byte dotCount = 0;
  WiFi.disconnect(); //Apaga wifi
  WiFi.mode(WIFI_STA); //Modo STA

  IPAddress local_ip(DEFAULT_IP[0],DEFAULT_IP[1],DEFAULT_IP[2],DEFAULT_IP[3]);
  IPAddress gateway(DEFAULT_IP[0],DEFAULT_IP[1],DEFAULT_IP[2],DEFAULT_IP[3]);
  IPAddress subnet(DEFAULT_MASK[0],DEFAULT_MASK[1],DEFAULT_MASK[2],DEFAULT_MASK[3]);

  WiFi.begin(DEFAULT_STA_SSID, DEFAULT_STA_PASSWORD);
  WiFi.config(local_ip, gateway, subnet);
  unsigned long prevTime=millis();
  
  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(F("M117 Conectando"));
    Serial.println(dots);
    dots += ".";
    dotCount++;
    
    if(dotCount==5){
      dots="";
      dotCount=0;
    }

    if(millis()-prevTime > DEFAULT_STA_TIMEOUT){
      Serial.println(F("M117 No se pudo conectar a la red"));
      WIFICONFIG::InitAP();
      break;
    }
  }
  Serial.print(F("M117 Conectado a la red "));
  Serial.println(DEFAULT_STA_SSID);
  delay(1000);
  Serial.print(F("M117 IP: "));
  Serial.println(WiFi.localIP());
}
