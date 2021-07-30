## Weather

This plugin fetches weather information from the Weather API.

[Request API key](https://openweathermap.org/api)

### Configuration

```json
{
  "plugins": {
    "apiKey": "weather api key",
    "city": "city",
    "unit": "metric"
  }
}
```

**Configs**
| Field | Value |
| ----- | ----- |
| `apiKey` | replace it with the api key you requested. |
| `city` | zip code and country, example: `10011,us`. |
| `metric` | temperature unit, `default` for Kelvin, `metric` for Celsius or `imperial` for Fahrenheit. |
