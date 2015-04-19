bool pumpShouldRun = false;

bool shouldPumpRun() {
  return pumpShouldRun;
}

numvar rp(void) {
  runPump();
}

numvar sp(void) {
  stopPump();
}

numvar tp(void) {
  togglePump();
}


void runPump() {
  pumpShouldRun = true;
}

void stopPump() {
  pumpShouldRun = false;
}

void togglePump() {
  pumpShouldRun = !pumpShouldRun;
}

