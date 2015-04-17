#include "bitlash.h"

void setup(void) {

  // initialize bitlash and set primary serial port baud
  // print startup banner and run the startup macro
  initBitlash(57600);

  setupWaterLevel();
  initBMP280();

  // you can execute commands here to set up initial state
  // bear in mind these execute after the startup macro
  // doCommand("print(1+1)");
  addBitlashFunction("wl", (bitlash_function) wl);
  addBitlashFunction("wt", (bitlash_function) wt);
  addBitlashFunction("pc", (bitlash_function) pc);
  addBitlashFunction("at", (bitlash_function) at);
  addBitlashFunction("ap", (bitlash_function) ap);
  addBitlashFunction("alt", (bitlash_function) alt);
}

void loop(void) {
  runBitlash();
}

