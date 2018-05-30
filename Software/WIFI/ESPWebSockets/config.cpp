#include "config.h"

void CONFIG_writeString(int pos, const char * byte_buffer){
  int size_buffer;
  size_buffer = strlen(byte_buffer);//Cantidad de caracteres

  EEPROM.begin(EEPROM_SIZE);//Inicia la EEPROM
  
  for (int i = 0; i < size_buffer; i++) {
    EEPROM.write(pos + i, byte_buffer[i]);//Escribe todos los caracteres del vector
  }

  EEPROM.write(pos + size_buffer, 0x00);//Pone el '\0' al final
  EEPROM.commit(); //Guarda los cambios
  EEPROM.end();
}

void CONFIG_readString(int pos, char * byte_buffer, int maxLength){
  uint8_t b=0;
  if(byte_buffer==NULL || pos > EEPROM_SIZE) {
    return;
  }
  EEPROM.begin(EEPROM_SIZE);
  int i=0;

  //Lee hasta encontrar un \0
  do{
    b = EEPROM.read(pos+i);
    byte_buffer[i] = b;
    i++;
  }while(b != '\0' && i<maxLength);

  byte_buffer[i] = '\0'; //Final de la cadena 
  
  EEPROM.end();
}

uint8_t CONFIG_readByte(int pos){
  uint8_t b=0;
  if(pos > EEPROM_SIZE) {
      return 0;
  }
  EEPROM.begin(EEPROM_SIZE);
  b = EEPROM.read(pos);    
  EEPROM.end();
  return b;
}

void CONFIG_writeByte(int pos, uint8_t dato){
  uint8_t b=0;
  if(pos > EEPROM_SIZE) {
      return;
  }
  EEPROM.begin(EEPROM_SIZE);
  EEPROM.write(pos, dato);
  EEPROM.commit();    
  EEPROM.end();
}

void CONFIG_reset(void){
  CONFIG_writeByte(EP_RESET_FLAG, 1);
  CONFIG_writeByte(EP_WIFI_MODE, D_WIFI_MODE);
  CONFIG_writeString(EP_STA_SSID, D_STA_SSID);
  CONFIG_writeString(EP_STA_PASSWORD, D_STA_PASSWORD);
}

