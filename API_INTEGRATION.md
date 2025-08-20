# Stock API Integration

## Overview
The stock predictor component now integrates with a real backend API to fetch live stock data when a stock is selected.

## API Endpoint
- **URL**: `GET /user/stock/getByCode/{code}`
- **Method**: GET
- **Path Parameter**: `{code}` - Stock symbol (e.g., AAPL, GOOGL, MSFT)
- **Response**: `List<CompanyStockPriceDto>`

## Data Format
The API returns a list of stock price data. The component now handles various response formats including:

### Standard JSON Format:
```json
[
  {
    "date": "2024-01-15",
    "price": 150.25
  },
  {
    "date": "2024-01-16", 
    "price": 152.30
  }
]
```

### Alternative Formats:
The component can also handle responses in different formats and automatically converts them to the required chart format. It includes robust error handling and data validation.

## Features

### 1. Automatic Data Fetching
- When a stock is selected from the dropdown, the component automatically calls the API
- Real-time stock data is fetched and displayed in the chart
- Loading states are shown during API calls

### 2. Manual Refresh
- A refresh button is available next to the stock selector
- Users can manually refresh stock data at any time
- The button shows a loading spinner during refresh

### 3. Error Handling
- If the API call fails, the component falls back to demo data
- Error messages are displayed to inform users
- Console logging for debugging purposes

### 4. Fallback Behavior
- Demo mode continues to work as before
- If the backend is unavailable, users still see sample data
- Graceful degradation ensures the app remains functional

## Usage

### Selecting a Stock
1. Choose a stock from the dropdown menu
2. The component automatically fetches real data from the API
3. The chart updates to show current market data
4. Any previous prediction data is cleared

### Refreshing Data
1. Click the refresh button (trending up icon) next to the stock selector
2. The component fetches the latest data from the API
3. The chart updates with fresh data

### Making Predictions
1. After selecting a stock and viewing current data
2. Configure prediction parameters (timeframe, news sentiment)
3. Click "Get AI Prediction" to generate future forecasts
4. The prediction API is called separately from the stock data API

## Configuration

### Backend URL
The API base URL is currently set to `http://localhost:8080`. To change this:

1. Update the fetch URLs in the component (currently using `/user/stock/getByCode/{code}`)
2. Consider using environment variables for different environments
3. Ensure CORS is properly configured on the backend

### Stock Symbols
The component includes a predefined list of stock companies:
- AAPL (Apple Inc.)
- GOOGL (Alphabet Inc.)
- MSFT (Microsoft Corporation)
- TSLA (Tesla Inc.)
- AMZN (Amazon.com Inc.)

To add more stocks, update the `stockCompanies` array in the component.

## Error Scenarios

### Network Errors
- Connection refused
- Timeout
- CORS issues

### API Errors
- Invalid stock symbol
- Server errors (5xx)
- Rate limiting

### Data Errors
- Invalid response format
- Missing required fields
- Empty data sets

## Development Notes

### Testing
- Test with different stock symbols
- Verify error handling with invalid symbols
- Check loading states and user feedback
- Ensure fallback to demo data works correctly

### Performance
- API calls are debounced to prevent excessive requests
- Loading states prevent multiple simultaneous calls
- Error states are cleared on successful operations

### Security
- Input validation for stock symbols
- Error messages don't expose sensitive information
- API calls use standard fetch with error handling
