#ifndef _FSWEBSERVER_h
#define _FSWEBSERVER_h

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <FS.h>

extern ESP8266WebServer webserver;

String getContentType(String filename);
bool handleFileRead(String path);
void webserverSetup();

#endif
