## Alpha Vantage ##
This plugin fetches stock market information from the Alpha Vantage API.

[Request API key](https://www.alphavantage.co/support/#api-key)

[API Documentation]( https://www.alphavantage.co/documentation/)

### Configuration ###
```json
{
  "apikey": "alpha vantage api key",
  "function": "",
  "symbols": ["SYMBOL1", "SYMBOL2"]
}
```

**Configs**
| Field | Value |
| ----- | ----- |
| `apikey` | replace it with the api key you requested. |
| `functionName` | check the API documentation, example: `GLOBAL_QUOTE` |
| `symbols` | a list of stock symbols, example: `IBM`. |
