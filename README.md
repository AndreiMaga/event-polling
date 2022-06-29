# Eventpoller

A realy small library that can do polling on events like `onClick`

## Usage

```
import {EventPoller, IEventPolling} from "event-polling"


function actualEventHandler(e: Event){...}

const pollerConfig: IEventPolling = {
    id: 0,
    callback: actualEventHandler
    timeout: 300
}

function eventHandler(e: Event){
    EventPoller.poll({
        ...pollerConfig,
        args: [e]
    })
}

```
