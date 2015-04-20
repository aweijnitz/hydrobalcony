#include "bitlash.h"

int switchPin = 11;
int relayPin = 10;

void setup(void) {

  // initialize bitlash and set primary serial port baud
  // print startup banner and run the startup macro
  initBitlash(57600);

  setupWaterLevel();
  initBMP280();

  pinMode(switchPin, INPUT_PULLUP);
  pinMode(relayPin, HIGH);

  // you can execute commands here to set up initial state
  // bear in mind these execute after the startup macro
  // doCommand("print(1+1)");

  // Monitoring
  addBitlashFunction("wl", (bitlash_function) wl);
  addBitlashFunction("wt", (bitlash_function) wt);
  addBitlashFunction("pc", (bitlash_function) pc);
  addBitlashFunction("at", (bitlash_function) at);
  addBitlashFunction("ap", (bitlash_function) ap);
  addBitlashFunction("alt", (bitlash_function) alt);

  // Pump control
  addBitlashFunction("rp", (bitlash_function) rp);
  addBitlashFunction("sp", (bitlash_function) sp);
  addBitlashFunction("tp", (bitlash_function) tp);
}

void loop(void) {
  runBitlash();

  // Switch is in ON state or pump is scheduled to run
  if (digitalRead(switchPin) == LOW || shouldPumpRun()) {
    digitalWrite(relayPin, LOW);
  } else {
    digitalWrite(relayPin, HIGH);
  }
}

