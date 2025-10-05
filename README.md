# StockSight AI - Stock Prediction Platform

![StockSight AI Logo](public/logo.svg)

An advanced AI-powered stock market prediction platform that uses LSTM (Long Short-Term Memory) neural networks and Monte Carlo simulations to forecast stock prices.

## Features

- **Flexible Prediction Timeframe**: Select anywhere from 1 to 30 days for price predictions
- **LSTM Neural Network**: Deep learning time series analysis for accurate forecasting
- **Monte Carlo Simulation**: Probabilistic modeling with 100 scenario simulations
- **Interactive Visualizations**: Beautiful charts and graphs powered by Recharts
- **Real-time Analysis**: Automatic updates when changing prediction parameters
- **CSV Data Support**: Easy data upload from various sources
- **Trading Recommendations**: AI-generated BUY/HOLD/WAIT signals

## How to Use

### Step 1: Select Prediction Days
1. After uploading your data, you'll see a **prediction timeframe slider**
2. Drag the slider to select how many days ahead you want to predict (1-30 days)
3. The analysis updates automatically

### Step 2: Download Stock Data from MarketWatch

#### Method 1: Direct Download
1. Go to [MarketWatch](https://www.marketwatch.com/)
2. Search for any company (e.g., "Polycab India Ltd" or ticker symbol)
3. Navigate to the stock's page
4. Look for "Historical Quotes" or "Download Data" section
5. Select date range and download as CSV

#### Method 2: Using Stock Ticker
1. Visit: `https://www.marketwatch.com/investing/stock/[TICKER]/download-data`
2. Replace `[TICKER]` with the company ticker
3. Example: `https://www.marketwatch.com/investing/stock/polycab/download-data`
4. Choose date range and download CSV

#### Example Companies:
- **Polycab India Ltd**: Ticker - `POLYCAB` (NSE)
- **Reliance Industries**: Ticker - `RELIANCE`
- **TCS**: Ticker - `TCS`
- **Infosys**: Ticker - `INFY`

### Step 3: Upload CSV File
1. Click on **"Upload Data"** tab
2. Click **"Select CSV File"** button
3. Choose your downloaded CSV file
4. The platform will automatically parse and analyze the data

### Step 4: View Predictions
Navigate through different tabs to view:
- **Overview**: Current price, predictions, and recommendations
- **Predictions**: Detailed LSTM forecasts with confidence intervals
- **Monte Carlo**: 100 simulated price scenarios

## CSV File Format

Your CSV file should contain the following columns:
- **Date** (Required): Date of the trading day
- **Close** (Required): Closing price
- **Open** (Optional): Opening price
- **High** (Optional): Highest price of the day
- **Low** (Optional): Lowest price of the day
- **Volume** (Optional): Trading volume

### Example CSV Format:
```csv
Date,Close,Open,High,Low,Volume
01/10/2024,5243.50,5200.00,5280.00,5190.00,1250000
01/11/2024,5298.75,5250.00,5310.00,5240.00,1180000
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/stocksight-ai.git

# Navigate to project directory
cd stocksight-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure
```
stocksight-ai/
├── public/
│   ├── logo.svg
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── StockPredictionPlatform.jsx
│   │   ├── StockPredictionPlatform1.jsx
│   │   ├── StockPredictionPlatform2.jsx
│   │   └── AboutUs.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## Technologies Used

- **React** - Frontend framework
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation
- **React Toastify** - Notifications

## Prediction Algorithms

### LSTM (Long Short-Term Memory)
- Deep learning time series model
- Analyzes historical patterns and trends
- Provides confidence intervals for predictions
- Adjusts confidence based on forecast length

### Monte Carlo Simulation
- Runs 100 different price scenarios
- Probabilistic modeling of future prices
- Shows range of possible outcomes
- Helps understand risk and volatility

## Metrics Explained

- **Current Price**: Latest closing price from your data
- **Predicted Price**: Forecasted price after N days
- **Expected Change**: Percentage change from current price
- **Volatility**: Measure of price fluctuation
- **Confidence**: Prediction accuracy estimate (decreases with time)

## Recommendations

- **BUY**: Predicted price increase > 3%
- **HOLD**: Predicted price change between -3% and 3%
- **WAIT**: Predicted price decrease > 3%

## Disclaimer

⚠️ **IMPORTANT**: This is an educational tool for learning about stock market prediction algorithms. 

- Predictions are probabilistic simulations and **NOT financial advice**
- Past performance does not guarantee future results
- Always consult with licensed financial professionals before making investment decisions
- Use this tool for educational and research purposes only
- The creators are not responsible for any financial losses

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details

## Contact

For questions or support:
- Email: mahindrakumar_22161@aitpune.edu.in
- LinkedIn: [linkedin.com/in/mahindra8252](https://www.linkedin.com/in/mahindra8252)

## Acknowledgments

- Built with React and modern web technologies
- Inspired by quantitative finance and machine learning research
- Special thanks to the open-source community

---

**Made with ❤️ by the StockSight AI Team**