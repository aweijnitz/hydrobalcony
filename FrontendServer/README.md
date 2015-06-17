# Frontend Server

This part contains the system components responsible
for reporting, monitoring and the UI ("dashboard").


## The sub projects are

- [UI](./UI): The Dashboard UI
- [FrontendAPIServer.js](./FrontendServerAPI.js): API server, exposing services to get sensor data. Also emits websockets events.
- [monitor](./monitor): cron jobs that monitor basic system healths and triggers SMS alerts when necessary
- [StatsGenerators](./StatsGenerators): scripts to generate statistics (graphs). Still under development.
- [shell](./shell): Various shell scripts

