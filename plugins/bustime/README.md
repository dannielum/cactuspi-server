## BusTime

This plugin fetches bus time information from the MTA BusTime API.

[Request API key](http://bustime.mta.info/wiki/Developers/Index)

### Configuration

```json
{
  "plugins": {
    "apiKey": "bustime api key",
    "default": "line1",
    "options": {
      "line1": {
        "directionRef": 0,
        "maximumStopVisits": 3,
        "monitoringRef": "<MONITORING REF>",
        "lineRef": "MTA NYCT_<BUS NUMBER>"
      },
      "line2": {
        "directionRef": 0,
        "maximumStopVisits": 3,
        "monitoringRef": "<MONITORING REF>",
        "lineRef": "MTA NYCT_<BUS NUMBER>"
      }
    }
  }
}
```

**Configs**
| Field | Value |
| ----- | ----- |
| `apiKey` | replace it with the api key you requested. |
| `default` | default bus time to be fetched when no bus line is provided. |
| `options` | A list of all the bus lines you wish to support. |

**Options**
You can set up as many bus lines as you wish by looking up for the params from the [Bustime MTA site](http://bustime.mta.info/#M5). For example if you want to setup a watch for the bus M5, 3 bus stops away at AV OF THE AMERICAS/W 34 ST stop to the uptown direction, this is how it will look:

```json
"m5_w34th": {
  "directionRef": 0,
  "maximumStopVisits": 3,
  "monitoringRef": 400933,
  "lineRef": "MTA NYCT_M5"
}
```

The name can be any string, it will then be used as the request param when you `curl` it.

```
curl localhost:8081/bustime/m5_w34th
```
