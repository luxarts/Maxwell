#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include "FSWebServer.h"
#include <FS.h>

#define DEBUG
#define LED 2
#define DEF_TIMEOUT 20000

static char * STA_SSID  = "Skynet";
static char * STA_PASSWORD = "lu29ni06";

//WiFiServer dataserver(8888);

void setup() {
  Serial.begin(115200);
  
  pinMode(LED, OUTPUT);
  digitalWrite(LED, 0);
  
  Serial.println();

  wifiSetup();
  spiffsSetup();
  webserverSetup();
  //dataserver.begin();
  
}

void wifiSetup(){
  byte dots = 0;
  unsigned long timeout=0;
  
  IPAddress sta_ip(192,168,0,90);
  IPAddress sta_gateway(192,168,0,1);
  IPAddress sta_subnet(255,255,255,0);

  WiFi.hostname("Maxwell3D");
  WiFi.mode(WIFI_STA);
  WiFi.begin(STA_SSID, STA_PASSWORD);
  WiFi.config(sta_ip, sta_gateway, sta_subnet);
  
  timeout=millis();
  
  while (WiFi.status() != WL_CONNECTED && millis()-timeout<DEF_TIMEOUT) {
    Serial.print("M117 Conectando");
    for(byte i=dots;i!=0;i--){
      Serial.print(".");
    }
    Serial.println();
    dots++;
    if(dots==6)dots=0;
    delay(250);
  }
  switch(WiFi.status()){
    case WL_CONNECTED:  Serial.println("M117 Conectado!");
    break;
    case WL_NO_SSID_AVAIL:  Serial.println("M117 La red no existe");
                            return;
    break;
    case WL_CONNECT_FAILED: Serial.println("M117 Contraseña incorrecta");
                            return;
    break;
    default: Serial.println("M117 No se pudo conectar");
             return;
    break;
  }
  
  delay(1000);
  //if(MDNS.begin("MAXWELL")) {
  //  Serial.println("M117 Web: MAXWELL.local");
  //  MDNS.addService("http", "tcp", 80);
  //}
  //else{
    Serial.print("M117 IP: ");
    Serial.println(WiFi.localIP());
  //}
}

void spiffsSetup(){
  if(!SPIFFS.begin()){
    Serial.println("M117 Error de memoria");
  }
#ifdef DEBUG
    Dir dir = SPIFFS.openDir("/");
    while(dir.next()){
      String fileName = dir.fileName();
      size_t fileSize = dir.fileSize();
      
      Serial.print("FS file: ");
      Serial.print(fileName);
      Serial.print("\tSize: ");
      Serial.println(fileSize);
    }
#endif
}

void loop(){
  webserver.handleClient();
  delay(50);
}
/*void loop() {
  WiFiClient client = dataserver.available();
  if (!client) {
    return;
  }
  
  // Wait until the client sends some data
  Serial.println("new client");
  while(!client.available()){
    delay(1);
  }
  
  // Read the first line of the request
  byte req = client.read();
  Serial.print(req);
  client.flush();

  // Prepare the response
  String s = "ok\r\n\r\n";

  // Send the response to the client
  client.print(s);
  delay(1);
  //Serial.println("Client disonnected");
}*/
