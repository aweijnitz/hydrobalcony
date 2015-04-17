const int analogIn = A1;
int MILLIVOLT_PER_AMP = 185; // use 100 for 20A Module and 66 for 30A Module
int currentValueRaw = 0;
int ACS_OFFSET = 2500;
double voltage = 0;
double milliAmps = 0;

numvar pc(void) {
  return getPumpCurrent();
}

int getPumpCurrent()
{
  currentValueRaw = analogRead(analogIn);
  voltage = (currentValueRaw / 1023.0) * 5000; // Gets you mV
  milliAmps = ((voltage - ACS_OFFSET) * 1000 / MILLIVOLT_PER_AMP);
  return milliAmps;
}

