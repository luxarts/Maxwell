/* Sin usar F()
 * El Sketch usa 324260 bytes (31%) del espacio de almacenamiento de programa. El máximo es 1044464 bytes.
 * Las variables Globales usan 36808 bytes (44%) de la memoria dinámica, dejando 45112 bytes para las variables locales. El máximo es 81920 bytes. 
 * 
 * Usando F() 
 * El Sketch usa 324472 bytes (31%) del espacio de almacenamiento de programa. El máximo es 1044464 bytes. 
 * Las variables Globales usan 36204 bytes (44%) de la memoria dinámica, dejando 45716 bytes para las variables locales. El máximo es 81920 bytes.  
 * 
 * +212 bytes de FLASH  
 * -604 bytes de SRAM  
 */
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <FS.h>
#include <WebSocketsServer.h>
//#include <ArduinoOTA.h>
#include "config.h"

//#define DEBUG

ESP8266WebServer server(DEFAULT_WEB_PORT);// Puerto
WebSocketsServer websocket = WebSocketsServer(DEFAULT_WS_PORT, "", "mwp");//Puerto, origen, protocolo

File fsUploadFile;
String inputString = "";

void setup(){
  //pinMode(LED, OUTPUT);
  //digitalWrite(LED, 0);
  WiFi.mode(WIFI_OFF);
  delay(INIT_DELAY);
  Serial.begin(DEFAULT_BAUDRATE);
  Serial.println();
  inputString.reserve(150);
  wifiSetup();
  spiffsSetup();
  serverSetup();
  //OTASetup();
  websocket.begin();
  websocket.onEvent(webSocketEvent);
}

void loop(){
  websocket.loop();
  server.handleClient();
  processSerial();
  //ArduinoOTA.handle();
}

void processSerial(){
  static byte stringComplete=0;
  
  if(Serial.available()){
    char inChar = (char)Serial.read();
    if(inChar == '\n'){
      stringComplete=1;
    }
    else{
      inputString += inChar;  
    }
  }
  if(stringComplete){
    websocket.broadcastTXT(inputString);
    stringComplete=0;
    inputString="";
  }
}

void processPayload(String payload, uint8_t num){
  int icmd[2] = {0, 0};

  icmd[0] = payload.indexOf(F("!MWP")); //Inicio del numero de comando
  icmd[1] = payload.indexOf(" "); //Fin del numero de comando
  
  if(icmd[0] == -1 || icmd[0] == -1)return; //Si no era un comando vuelve

  //Obtiene el numero de comando
  int cmd = payload.substring(icmd[0]+4, icmd[1]).toInt(); //Incluye el index de inicio, no incluye el de final

  //Obtiene el mensaje
  String msg = payload.substring(icmd[1]+1); //Desde donde finaliza el comando hasta el final

  switch(cmd){
    //!MWP0: Reinicia el mcu
    case 0:
      ESP.restart();
      while(1)delay(1);
    break;
    //!MWP1: Resetea toda la configuracion
    case 1:
    break;
    //!MWP2: Envia la IP
    case 2:
      websocket.sendTXT(num, "abc.def.ghi.jkl");
    break;
    //!MWP3: Resetea la contraseña de acceso
    case 3:
    break;
    //!MWP4: Envia version del FW
      websocket.sendTXT(num,"!MWP4 " + FIRMWARE_VERSION);
    case 4:
    break;
    //!MWP5: Setea un parametro de la EEPROM. (ej. !MWP5 param=valor)
    case 5:
    break;
    //!MWP6: Lee el valor de un parametro en EEPROM
    case 6:
    break;
    //!MWP7: Envia el mensaje por el puerto serie
    case 7:
      Serial.println(msg);
    break;
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    /*case WStype_DISCONNECTED:
      USE_SERIAL.printf("[%u] Disconnected!\n", num);
    break;
    case WStype_CONNECTED:
      IPAddress ip = webSocket.remoteIP(num);
      USE_SERIAL.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      // send message to client
      webSocket.sendTXT(num, "Connected");
    break;*/
    case WStype_TEXT:
      String payload_str = String((char*) payload);
      processPayload(payload_str, num);
    break;
  }
}

void serverSetup(){
  server.on(F("/"), HTTP_ANY, handleWebRoot);
  server.on(F("/fwu.html"), HTTP_POST, []() {  // If a POST request is sent to the /edit.html address,
    server.send(200, "text/plain", ""); 
  }, handleFileUpload);
  
  server.onNotFound([](){
    server.sendHeader(F("Connection"), F("close"));
    server.sendHeader(F("Access-Control-Allow-Origin"),F("*"));
    if(!handleFileRead(server.uri())){
      server.send(404, F("text/plain"), F("FileNotFound"));
    }
  });
  
  server.begin();
}

void handleWebRoot(){
  String path = "/index.html";
  String contentType = getContentType(path);
  String pathWithGz = path + ".gz";
  
  if(SPIFFS.exists(pathWithGz) || SPIFFS.exists(path)){
    if(SPIFFS.exists(pathWithGz)) path += ".gz";
    File file = SPIFFS.open(path, "r");
    server.streamFile(file, contentType);
    file.close();
  }
}

bool handleFileRead(String path){
  if(path.endsWith(F("/"))) path += "index.html";
  String contentType = getContentType(path);
  String pathWithGz = path + ".gz";
  
  if(SPIFFS.exists(pathWithGz) || SPIFFS.exists(path)){
    if(SPIFFS.exists(pathWithGz)) path += ".gz";
    File file = SPIFFS.open(path, "r");
    size_t sent = server.streamFile(file, contentType);
    file.close();
    return true;
  }
  return false;
}

void handleFileUpload(){ // upload a new file to the SPIFFS
  HTTPUpload& upload = server.upload();
  String path;
  if(upload.status == UPLOAD_FILE_START){
    path = upload.filename;
    if(!path.startsWith("/")) path = "/"+path;
    if(!path.endsWith(".gz")) {                          // The file server always prefers a compressed version of a file 
      String pathWithGz = path+".gz";                    // So if an uploaded file is not compressed, the existing compressed
      if(SPIFFS.exists(pathWithGz))                      // version of that file must be deleted (if it exists)
         SPIFFS.remove(pathWithGz);
    }
    //Serial.print("handleFileUpload Name: "); Serial.println(path);
    fsUploadFile = SPIFFS.open(path, "w");            // Open the file for writing in SPIFFS (create if it doesn't exist)
    path = String();
  } else if(upload.status == UPLOAD_FILE_WRITE){
    if(fsUploadFile)
      fsUploadFile.write(upload.buf, upload.currentSize); // Write the received bytes to the file
  } else if(upload.status == UPLOAD_FILE_END){
    if(fsUploadFile) {                                    // If the file was successfully created
      fsUploadFile.close();                               // Close the file again
      //Serial.print("handleFileUpload Size: "); Serial.println(upload.totalSize);
      server.sendHeader("Location","/fwu.html");      // Redirect the client to the success page
      server.send(303);
      websocket.broadcastTXT("!MWP8 S1");   
    } else {
      server.sendHeader("Location","/fwu.html");
      server.send(303);
      websocket.broadcastTXT("!MWP8 S0");
    }
  }
}
String getContentType(String filename){
  if(server.hasArg(F("download"))) return F("application/octet-stream");
  else if(filename.endsWith(F(".htm"))) return F("text/html");
  else if(filename.endsWith(F(".html"))) return F("text/html");
  else if(filename.endsWith(F(".css"))) return F("text/css");
  else if(filename.endsWith(F(".xml"))) return F("text/xml");
  else if(filename.endsWith(F(".png"))) return F("image/png");
  else if(filename.endsWith(F(".jpg"))) return F("image/jpeg");
  else if(filename.endsWith(F(".gif"))) return F("image/gif");
  else if(filename.endsWith(F(".ico"))) return F("image/x-icon");
  else if(filename.endsWith(F(".js"))) return F("application/javascript");
  else if(filename.endsWith(F(".json"))) return F("application/json");
  else if(filename.endsWith(F(".pdf"))) return F("application/x-pdf");
  else if(filename.endsWith(F(".zip"))) return F("application/x-zip");
  else if(filename.endsWith(F(".gz"))) return F("application/x-gzip");
  return F("text/plain");
}

void spiffsSetup(){
  if(!SPIFFS.begin()){
    Serial.println(F("M117 Error de memoria"));
  }
#ifdef DEBUG
    Dir dir = SPIFFS.openDir(F("/"));
    while(dir.next()){
      String fileName = dir.fileName();
      size_t fileSize = dir.fileSize();
      
      Serial.print(F("FS file: "));
      Serial.print(fileName);
      Serial.print(F("\tSize: "));
      Serial.println(fileSize);
    }
#endif
}

void wifiSetup(){
  byte dots = 0;
  unsigned long timeout=0;
  
  IPAddress sta_ip(DEFAULT_STA_IP[0],DEFAULT_STA_IP[1],DEFAULT_STA_IP[2],DEFAULT_STA_IP[3]);
  IPAddress sta_gateway(DEFAULT_STA_IP[0],DEFAULT_STA_IP[1],DEFAULT_STA_IP[2],DEFAULT_STA_IP[3]);
  IPAddress sta_subnet(DEFAULT_STA_SUBNET[0],DEFAULT_STA_SUBNET[1],DEFAULT_STA_SUBNET[2],DEFAULT_STA_SUBNET[3]);

  WiFi.hostname(F("Maxwell3D"));
  WiFi.mode(WIFI_STA);
  WiFi.begin(STA_SSID, STA_PASSWORD);
  WiFi.config(sta_ip, sta_gateway, sta_subnet);
  
  timeout=millis();
  
  while (WiFi.status() != WL_CONNECTED && millis()-timeout<DEFAULT_STA_TIMEOUT) {
    Serial.print(F("M117 Conectando"));
    for(byte i=dots;i!=0;i--){
      Serial.print(F("."));
    }
    Serial.println();
    dots++;
    if(dots==6)dots=0;
    delay(250);
  }
  switch(WiFi.status()){
    case WL_CONNECTED:  Serial.println(F("M117 Conectado!"));
    break;
    case WL_NO_SSID_AVAIL:  Serial.println(F("M117 La red no existe"));
                            return;
    break;
    case WL_CONNECT_FAILED: Serial.println(F("M117 Contraseña incorrecta"));
                            return;
    break;
    default: Serial.println(F("M117 No se pudo conectar"));
             return;
    break;
  }
  
  delay(1000);
  //if(MDNS.begin("maxwell")) {
  //  Serial.println(F("M117 Web: maxwell.local"));
  //  MDNS.addService("http", "tcp", DEFAULT_WEB_PORT);
  //  MDNS.addService("ws", "tcp", DEFAULT_WS_PORT);
  //}
  //else{
    Serial.print(F("M117 IP: "));
    Serial.println(WiFi.localIP());
  //}
}

/*void OTASetup() { // Start the OTA service
  ArduinoOTA.setHostname(OTA_NAME);
  ArduinoOTA.setPassword(OTA_PASSWORD);

  ArduinoOTA.onStart([]() {
  });
  ArduinoOTA.onEnd([]() {
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("M117 Subiendo: %u%%\r\n", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR) Serial.println("End Failed");
  });
  ArduinoOTA.begin();
}*/

