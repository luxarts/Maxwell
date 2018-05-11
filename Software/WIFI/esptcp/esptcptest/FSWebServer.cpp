#include "FSWebServer.h"

#define DEBUG
ESP8266WebServer webserver(80);

String getContentType(String filename){
  if(webserver.hasArg("download")) return "application/octet-stream";
  else if(filename.endsWith(".htm")) return "text/html";
  else if(filename.endsWith(".html")) return "text/html";
  else if(filename.endsWith(".css")) return "text/css";
  else if(filename.endsWith(".xml")) return "text/xml";
  else if(filename.endsWith(".png")) return "image/png";
  else if(filename.endsWith(".jpg")) return "image/jpeg";
  else if(filename.endsWith(".gif")) return "image/gif";
  else if(filename.endsWith(".ico")) return "image/x-icon";
  else if(filename.endsWith(".js")) return "application/javascript";
  else if(filename.endsWith(".json")) return "application/json";
  else if(filename.endsWith(".pdf")) return "application/x-pdf";
  else if(filename.endsWith(".zip")) return "application/x-zip";
  else if(filename.endsWith(".gz")) return "application/x-gzip";
  return "text/plain";
}

bool handleFileRead(String path){
#ifdef DEBUG
    Serial.println("handleFileRead: " + path);
#endif
  if(path.endsWith("/")) path += "index.html";
  
  String contentType = getContentType(path);
  String pathWithGz = path + ".gz";
  if(SPIFFS.exists(pathWithGz) || SPIFFS.exists(path)){
    if(SPIFFS.exists(pathWithGz)) path += ".gz";
    File file = SPIFFS.open(path, "r");
    size_t sent = webserver.streamFile(file, contentType);
    file.close();
    return true;
  }
#ifdef DEBUG
  else{
    Serial.print("'");
    Serial.print(path);
    Serial.print("' no existe");  
  }
#endif
  return false;
}

void webserverSetup(){
  webserver.onNotFound([](){
    webserver.sendHeader("Connection", "close");
    webserver.sendHeader("Access-Control-Allow-Origin","*");
    if(!handleFileRead(webserver.uri())){
      webserver.send(404, "text/plain", "FileNotFound");
    }
  });
  
  webserver.begin();
}

