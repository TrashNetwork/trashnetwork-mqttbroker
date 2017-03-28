# trashnetwork-mqttbroker
The MQTT broker of TrashNetwork project, used for pushing notification and chatting.

## Prerequisite

- [Node.js](https://nodejs.org/)(with NPM)
- [Redis](http://redis.io/)

## Configuration

Before running, you should set some properties in `config.js`:

+ `http_api_base_url_v1`: The base URL of HTTP API(v1 version) that MQTT broker will use to interact with web server. The web server that this URL points to should running project [trashnetwork-web](https://github.com/TrashNetwork/trashnetwork-web).

You should also pay attention to other configurations.

## Build and Run

Switch to the root directory of this project, execute following command to install all required Node.js modules:

```bash
npm install
```

Then, execute following command to run broker:

```bash
node mqtt-broker.js
```

Press `Ctrl+C` to stop broker. 

## Start Server at Backend

You can execute `start_server.sh` to start server at backend directly.

And you can execute `tmux attach -t TrashNetwork-MQTT` to view the log in real time.

## Sync Code to Remote Host

You can use `sync.sh` to sync your code to remote host. This script will sync your code via `rsync`.

Write into `sync_config.sh` as below to configure it.

```
remote_path=/home/happyyoung/trashnetwork-mqttbroker
remote_user=happyyoung
remote_host=127.0.0.1
```

Lines in `sync_config.sh` will override the configuration set in sync.sh.

After that, you could sync your code.