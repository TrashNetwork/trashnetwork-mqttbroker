#!/usr/bin/env bash

tmux new-session -d -s TrashNetwork-MQTT \
 "unset SSH_CLIENT;
  unset SSH_CONNECTION;
  node ./mqtt-broker.js"

