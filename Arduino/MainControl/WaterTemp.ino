#include <OneWire.h>
#include <DallasTemperature.h>

OneWire oneWire(7);
DallasTemperature sensors(&oneWire);
DeviceAddress deviceAddress;

void setupWaterLevel() {
  sensors.begin();
  sensors.getAddress(deviceAddress, 0);
}

numvar wt(void) {
  return getWaterTemp() * 1000; // *1000 to convert to keep resolution when converting to integer
}

/* NOTE: Getting temp is very slow due to the conversion.
   See http://milesburton.com/Main_Page?title=Dallas_Temperature_Control_Library */
float getWaterTemp() {
  sensors.requestTemperaturesByAddress(deviceAddress);
  return sensors.getTempC(deviceAddress);
}

