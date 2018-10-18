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
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <FS.h>
#include <WebSocketsServer.h>
#include <cstring>
//#include <ArduinoOTA.h>
#include "config.h"
#define WEBSOCKETS_SERVER_CLIENT_MAX  (1)

//#define DEBUG

ESP8266WebServer server(DEFAULT_WEB_PORT);// Puerto
WebSocketsServer websocket = WebSocketsServer(DEFAULT_WS_PORT, "", "mwp");//Puerto, origen, protocolo

File fsUploadFile;
String inputString = "";

void setup(){
  uint8_t dots=0;
  uint8_t hardReset=0;
  unsigned long timeout;
  
  WiFi.mode(WIFI_OFF);
  delay(INIT_DELAY);
  pinMode(RESET_CONFIG_PIN,INPUT);
  Serial.begin(DEFAULT_BAUDRATE);
  Serial.println();

  timeout=millis();

  do{
    Serial.print(F("M117 Iniciando WiFi"));
    for(byte i=dots;i!=0;i--){
      Serial.print(F("."));
    }
    Serial.println();
    dots++;
    if(dots==4)dots=0;
    delay(200);
    hardReset=digitalRead(RESET_CONFIG_PIN);
  }while(millis()-timeout<RESET_DELAY && hardReset);
  
  //CONFIG_writeByte(EP_RESET_FLAG,0);
  //Lee el RESET_FLAG de la EEPROM
  if(!CONFIG_readByte(EP_RESET_FLAG) || !hardReset){//Reset flag = 0 => No se reseteó
    CONFIG_reset();
    Serial.println(F("M117 Config reset!"));
    delay(1000);
    ESP.restart();
    while(1)delay(1);
  }
  
  inputString.reserve(128);

  wifiSetup();
  delay(50);
  spiffsSetup();
  //OTASetup();
  delay(50);
  websocket.begin();
  websocket.onEvent(webSocketEvent);
  delay(50);
  serverSetup();
}

void loop(){
  websocket.loop();
  server.handleClient();
  processSerial();
  //ArduinoOTA.handle();
}

void processSerial(){
  static uint8_t stringComplete=0;
  
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

void processPayload(String &payload, uint8_t num){
  int icmd[2] = {0, 0};
  char msgChar[100];

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
      CONFIG_reset();
      Serial.println(F("M117 Config reset!"));
      delay(1000);
      ESP.restart();
      while(1)delay(1);
    break;
    //!MWP2: Envia los datos del wifi
    case 2:
      char STA_SSID[MAX_STA_SSID+1];
      char STA_PASSWORD[MAX_STA_PASSWORD+1];
      CONFIG_readBuffer(EP_STA_SSID, STA_SSID, MAX_STA_SSID);//Lee la el SSID desde la eeprom
      CONFIG_readBuffer(EP_STA_PASSWORD, STA_PASSWORD, MAX_STA_PASSWORD);//Lee la el SSID desde la eeprom
      char msg_send[60];
      memset(msg_send, 0, sizeof(msg_send));
      strcpy(msg_send, "!MWP2 ");
      strcat(msg_send, STA_SSID);
      strcat(msg_send, " ");
      strcat(msg_send, STA_PASSWORD);
#ifdef DEBUG
      Serial.print("msg_send5=");for(int i=0 ; i<strlen(msg_send) ; i++)Serial.write(msg_send[i]);Serial.println();
#endif
      /*
      msg = "!MWP2";
      msg.concat(STA_SSID);
      msg += " ";
      msg.concat(STA_PASSWORD);*/
      websocket.sendTXT(num, msg_send);
    break;
    //!MWP3: Resetea la contraseña de acceso
    case 3:
    break;
    //!MWP4: Envia version del FW
      //websocket.sendTXT(num,"!MWP4 " + FIRMWARE_VERSION);
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
    case 8:
    break;
    //!MWP9: Actualiza STA_SSID
    case 9:
      //SSID
      String wificreds = msg.substring(msg.indexOf(F("@"))+1, msg.indexOf(F("#")));
      wificreds.toCharArray(msgChar, wificreds.length());//Copia el String wificreds en el vector msgChar[]
      CONFIG_writeBuffer(EP_STA_SSID, msgChar);
      //Pass
      wificreds = msg.substring(msg.indexOf(F("#"))+1);
      wificreds.toCharArray(msgChar, wificreds.length());//Copia el String wificreds en el vector msgChar[]
      CONFIG_writeBuffer(EP_STA_PASSWORD, msgChar);
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
  // If a POST request is sent to the /fwu.html address,
  server.on("/fwu.html", HTTP_POST, [](){ server.send(200); }, handleFileUpload);
  
  server.onNotFound([](){
    //server.sendHeader(F("Connection"), F("close"));
    //server.sendHeader(F("Access-Control-Allow-Origin"),F("*"));
    if(!handleFileRead(server.uri())){
      server.send(404, F("text/plain"), F("FileNotFound"));
    }
  });
  
  server.begin();
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
  //Serial.println("Upload handler!");
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
    } else {
      server.sendHeader("Location","/fwu.html");      // Redirect the client to the success page
      server.send(303);
    }
  }
}

String getContentType(String &filename){
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

bool wifiSetupSTA(){
  uint8_t dots = 0;
  unsigned long timeout=0;
  char STA_SSID[MAX_STA_SSID+1];
  char STA_PASSWORD[MAX_STA_PASSWORD+1];
  
  //IPAddress sta_ip(D_STA_IP[0],D_STA_IP[1],D_STA_IP[2],D_STA_IP[3]);
  //IPAddress sta_gateway(D_STA_IP[0],D_STA_IP[1],D_STA_IP[2],D_STA_IP[3]);
  //IPAddress sta_subnet(D_STA_MASK[0],D_STA_MASK[1],D_STA_MASK[2],D_STA_MASK[3]);

  //WiFi.config(sta_ip, sta_gateway, sta_subnet);
  WiFi.enableAP(false);
  delay(100);
  WiFi.mode(WIFI_STA);
  delay(100);
  WiFi.setPhyMode(WIFI_PHY_MODE_11G);
  
  CONFIG_readBuffer(EP_STA_SSID, STA_SSID, MAX_STA_SSID);//Lee la el SSID desde la eeprom
  CONFIG_readBuffer(EP_STA_PASSWORD, STA_PASSWORD, MAX_STA_PASSWORD);//Lee la el SSID desde la eeprom
  WiFi.begin(STA_SSID, STA_PASSWORD);
  delay(100);

  Serial.print(F("M117 Conectando a "));
  Serial.println(STA_SSID);
  delay(1000);
  
  timeout=millis();
  
  while (WiFi.status() != WL_CONNECTED && millis()-timeout<DEFAULT_STA_TIMEOUT) {
    Serial.print(F("M117 Conectando"));
    for(byte i=dots;i!=0;i--){
      Serial.print(F("."));
    }
    Serial.println();
    dots++;
    if(dots==4)dots=0;
    delay(250);
    if(WiFi.status() == WL_CONNECT_FAILED ||
       WiFi.status() == WL_NO_SSID_AVAIL)break; 
  }
  switch(WiFi.status()){
    case WL_CONNECTED:
      Serial.println(F("M117 Conectado!"));
      delay(1000);
    break;
    case WL_NO_SSID_AVAIL:  
      Serial.println(F("M117 La red no existe"));
      delay(1000);
      return false;
    break;
    case WL_CONNECT_FAILED:
      Serial.println(F("M117 Contraseña incorrecta"));
      delay(1000);
      return false;
    break;
    default:
      Serial.println(F("M117 No se pudo conectar"));
      delay(1000);
      return false;
    break;
  }  
  WiFi.hostname(F("Maxwell3D"));
  Serial.print(F("M117 IP: "));
  Serial.println(WiFi.localIP());
  return true;
}

void wifiSetupAP(){
  IPAddress Ip(192,168,0,90);
  IPAddress NMask(255,255,255,0);
  
  WiFi.enableSTA(false);
  delay(100);
  WiFi.mode(WIFI_AP);
  delay(50);
  WiFi.softAPConfig(Ip, Ip, NMask);
  Serial.println(F("M117 Punto de acceso"));
  delay(1000);
  uint8_t result = WiFi.softAP(AP_SSID, AP_PASSWORD);
  delay(100);
  WiFi.setPhyMode(WIFI_PHY_MODE_11G);
  if(result){
    Serial.print(F("M117 IP: "));
    Serial.println(WiFi.softAPIP());
  }
  else{
    Serial.println(F("M117 No se pudo crear"));
  }
}

void wifiSetup(){
  uint8_t modo;
  modo = CONFIG_readByte(EP_WIFI_MODE);
  if(modo == MODO_STA){
    if(!wifiSetupSTA()){//Si no se pudo conectar
      wifiSetupAP(); //Crea un AP
    }
  }
  else if(modo == MODO_AP){
    wifiSetupAP();
  }
  else{
    CONFIG_reset();
    Serial.println(F("M117 Config reset!"));
    delay(1000);
    ESP.restart();
    while(1)delay(1);
  }
}

