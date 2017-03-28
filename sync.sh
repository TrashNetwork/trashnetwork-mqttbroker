#!/bin/bash

remote_user=happyyoung
remote_path=/home/${remote_user}/trashnetwork-mqttbroker
remote_host=127.0.0.1

if [ -f sync_config.sh ]; then
    source sync_config.sh;
fi

rsync --recursive --copy-links --perms --times --delete --progress --human-readable --exclude=*.log --exclude=.idea --exclude=node_modules * ${remote_user}@${remote_host}:${remote_path}
