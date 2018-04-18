//Without F:  flash 274164 - ram 33440
//With F:     flash 274268 - ram 33394

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiClient.h>
#include <ESP8266mDNS.h>

ESP8266WebServer server(80);

const char ssid[] = "";
const char password[] = "";

void setup() {
  Serial.begin(115200);
  setupWiFi();
  Serial.print("M117 IP:");
  Serial.println(WiFi.localIP());

  server.on(F("/"), handle_index);//Cuando se llame a la raiz se ejecuta la funcion 'handle_index'
  server.on(F("/gcode"), handle_gcode);
  
  server.begin();
}

void loop() {
  server.handleClient();
}

void handle_index(){
  server.send(200,F("text/plain"),F("Index page"));
}

void handle_gcode(){
  String gcode_string = server.arg(F("gcode"));
  Serial.println(gcode_string);
  String web = F("Linea recibida: ");
  server.send(200, F("text/plain"), web + gcode_string);
}

void setupWiFi(){
  //WiFi.mode(WIFI_AP);
  //IPAddress Ip(192, 168, 0, 99); //Configura la IP
  //IPAddress NMask(255, 255, 255, 0);  //Configura la máscara
  //WiFi.softAPConfig(Ip, Ip, NMask);
  
  //uint8_t mac[WL_MAC_ADDR_LENGTH];
  //WiFi.softAPmacAddress(mac);
  //WiFi.softAP(ssid, psswd);
  //IPAddress myIP = WiFi.softAPIP(); //Obtiene la IP
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(F("."));
  }
  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }
}
