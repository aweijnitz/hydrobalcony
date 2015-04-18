#include "BMP280.h"
#include "Wire.h"
#define P0 1013.25
#define READ_ERROR -100000
#define SCALE_FACTOR 1000

BMP280 bmp;

boolean initBMP280() {
  if (!bmp.begin())
    return false;
  else
    return true;
  bmp.setOversampling(4);
}


numvar at(void) {
  return getTemperature() * 1000;
}

numvar ap(void) {
  return getSeaLevel();
}

numvar alt(void) {
  return getAltitude();
}


/**
 * Get temperature in Celsius
 */
double getTemperature() {
  double T, P;
  char result = bmp.startMeasurment();

  if (result != 0) {
    delay(result);
    result = bmp.getTemperatureAndPressure(T, P);

    if (result != 0)
      return T;
    else
      return READ_ERROR;
  }
  else
    return READ_ERROR;
}


/* Get air preassure in mBar
 *
 */
double getPressure() {
  double T, P;
  char result = bmp.startMeasurment();

  if (result != 0) {
    delay(result);
    result = bmp.getTemperatureAndPressure(T, P);

    if (result != 0)
      return P;
    else
      return READ_ERROR;
  }
  else
    return READ_ERROR;
}

/* Get altitude in meters
 *
 */
double getAltitude() {
  double T, P;
  char result = bmp.startMeasurment();

  if (result != 0) {
    delay(result);
    result = bmp.getTemperatureAndPressure(T, P);

    if (result != 0)
      return bmp.altitude(P, P0);
    else
      return READ_ERROR;
  }
  else
    return READ_ERROR;
}

double getSeaLevel() {
  double T, P;
  char result = bmp.startMeasurment();

  if (result != 0) {
    delay(result);
    result = bmp.getTemperatureAndPressure(T, P);

    if (result != 0)
      return bmp.sealevel(P, bmp.altitude(P, P0));
    else
      return READ_ERROR;
  }
  else
    return READ_ERROR;
}
