# Known Issues

### Outdated Config File&#x20;

Bdo changes its network structure after each weekly patch. Consequently, the [config](https://github.com/sch-28/combat\_logger/blob/main/config.ini) needs to be adjusted accordingly. If the config is not updated yet, but you still need to log a fight, then you can record it with Wireshark. After the config has been updated, you can run the logger on the `*.pcap` file.

Running the executable with an old config will **not yield any results**.
