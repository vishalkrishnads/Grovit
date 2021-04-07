# Circuit Diagram & Connections
<a><img src="https://github.com/vishalkrishnads/Grovit/blob/master/.github/circuit.png?raw=true" height="450" width="840" ></a>

### NodeMCU
* D1, D5, D6, D7 ➡️ LED
* D4 ➡️ Relay IN
* D2 ➡️ Indicator LED
* D0 ➡️ LDR D0
* 3V ➡️ LDR, Relay Vcc
* GND ➡️ LED, Relay, LDR GND

NodeMCU is connected to powerbank/charger USB

### Pump
* +ve ➡️ Relay COM
* -ve ➡️ Powerbank/charger USB -ve

### Relay
* Relay NO ➡️ Powerbank/charger USB +ve
* Relay COM ➡️ Pump +ve
