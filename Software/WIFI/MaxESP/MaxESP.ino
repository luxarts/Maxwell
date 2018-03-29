#include <ESP8266WiFi.h>
#include <WiFiClient.h> 
#include <ESP8266WebServer.h>

const char psswd[] = "";
const char* ssid = "Skynet";

WiFiServer server(80);
String gcode_string = ""

void setup(){
  Serial.begin(115200);
  delay(2000);
  Serial.println(F("M117 IP:")+setupWiFi());

  server.begin();
}

void loop(){
  WiFiClient client = server.available(); //Comprueba si hay clientes conectados
  if (!client) {
    return;
  }  
  while(!client.available()){ //Espera a que el cliente envíe información
    delay(1);
  }

  String req = client.readStringUntil('\r');//Lee todo lo recibido hasta el retorno de carro (en HTTP = fin del mensaje)
  client.flush();//Vacía el buffer
  
  byte gcode_start = req.indexOf(F("gcode=")); //Obtiene la posición del primer caracter

  if(fraseStart!=255){//255 = -1 = No se encontró
    byte gcode_end = req.indexOf(F("HTTP/"));//Final del gcode
    gcode_string = req.substring(gcode_start+6, gcode_end-1);
    gcode_string.replace("+"," ");
    
    Serial.println(gcode_string);
  }
}

IPAddress setupWiFi(){
  WiFi.mode(WIFI_AP);
  IPAddress Ip(192, 168, 0, 9); //Configura la IP
  IPAddress NMask(255, 255, 255, 0);  //Configura la máscara
  WiFi.softAPConfig(Ip, Ip, NMask);
  
  uint8_t mac[WL_MAC_ADDR_LENGTH];
  WiFi.softAPmacAddress(mac);
  WiFi.softAP(ssid, psswd);
  IPAddress myIP = WiFi.softAPIP(); //Obtiene la IP
  return myIP;
}
