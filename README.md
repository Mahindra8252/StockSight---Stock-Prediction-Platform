# 📈 StockSight AI - Stock Prediction Platform

<div align="center">

![StockSight AI](https://img.shields.io/badge/StockSight-AI-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

*An advanced AI-powered stock market prediction platform leveraging LSTM neural networks and Monte Carlo simulations for intelligent price forecasting.*

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing)

</div>

---

## 🌟 Features

### Core Capabilities
- 🎯 **Dynamic Prediction Range**: Forecast stock prices from 1 to 30 days ahead with adjustable timeframes
- 🧠 **LSTM Neural Network**: Deep learning time series analysis with confidence intervals
- 🎲 **Monte Carlo Simulation**: 100 probabilistic scenarios showing potential price paths
- 📊 **Interactive Visualizations**: Real-time charts and graphs powered by Recharts
- 🔄 **Live Analysis Updates**: Automatic recalculation when parameters change
- 📁 **Universal CSV Support**: Compatible with data from MarketWatch, Yahoo Finance, and more
- 💡 **AI Trading Signals**: Intelligent BUY/HOLD/WAIT recommendations based on predictions

### Technical Features
- Responsive design for desktop and mobile
- Dark mode optimized UI
- Advanced CSV parsing with error handling
- Real-time statistical analysis
- Historical data visualization
- Confidence score tracking

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

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

The application will open at `http://localhost:5173`

---

## 📖 Usage Guide

### Step 1: Download Stock Data

#### From MarketWatch (Recommended)

**Option A: Direct Download**
1. Visit [MarketWatch](https://www.marketwatch.com/)
2. Search for your desired company (e.g., "Polycab India Ltd")
3. Navigate to the stock page
4. Find "Historical Data" or "Download Data" section
5. Select date range (recommend 6+ months for better predictions)
6. Download as CSV

**Option B: Direct URL**
```
https://www.marketwatch.com/investing/stock/[TICKER]/download-data
```
Replace `[TICKER]` with the stock symbol

**Popular Stock Examples:**
| Company | Ticker | Exchange |
|---------|--------|----------|
| Polycab India Ltd | POLYCAB | NSE |
| Reliance Industries | RELIANCE | NSE |
| Tata Consultancy | TCS | NSE |
| Infosys | INFY | NSE |
| HDFC Bank | HDFCBANK | NSE |

#### From Other Sources
- **Yahoo Finance**: Download historical data in CSV format
- **Google Finance**: Export data tables
- **NSE India**: Download bhavcopy data

### Step 2: Upload and Configure

1. **Upload CSV File**
   - Click "Upload Data" tab
   - Select your CSV file
   - Wait for automatic parsing

2. **Set Prediction Days**
   - Use the interactive slider (appears after upload)
   - Choose 1-30 days for forecast
   - Analysis updates in real-time

3. **View Results**
   - **Overview Tab**: Summary with recommendations
   - **Predictions Tab**: Detailed LSTM forecasts with confidence intervals
   - **Monte Carlo Tab**: 100 simulation scenarios

---

## 📊 CSV File Format

### Required Columns
- `Date`: Trading date (MM/DD/YYYY or YYYY-MM-DD)
- `Close`: Closing price (numeric)

### Optional Columns
- `Open`: Opening price
- `High`: Highest price of the day
- `Low`: Lowest price of the day
- `Volume`: Trading volume

### Example CSV
```csv
Date,Close,Open,High,Low,Volume
01/10/2024,5243.50,5200.00,5280.00,5190.00,1250000
01/11/2024,5298.75,5250.00,5310.00,5240.00,1180000
01/12/2024,5310.20,5295.00,5325.00,5280.00,1300000
```

**Note:** The platform automatically handles various CSV formats including quoted values and different date formats.

---

## 🏗️ Project Structure

```
stocksight-ai/
├── public/
│   ├── logo.svg              # Application logo
│   └── index.html            # Main HTML file
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation component
│   │   ├── Footer.jsx        # Footer with contact info
│   │   ├── StockPredictionPlatform.jsx    # General prediction (adjustable days)
│   │   ├── StockPredictionPlatform1.jsx   # 10-day prediction
│   │   ├── StockPredictionPlatform2.jsx   # 1-day prediction
│   │   └── AboutUs.jsx       # About page
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Data visualization library |
| **Lucide React** | Icon library |
| **React Router** | Client-side routing |
| **React Toastify** | Toast notifications |

---

## 🧮 Prediction Algorithms

### LSTM (Long Short-Term Memory)
LSTM is a type of recurrent neural network designed for time series prediction.

**How it works:**
- Analyzes historical price patterns and trends
- Learns temporal dependencies in stock data
- Generates predictions with confidence intervals
- Confidence decreases for longer forecast periods

**Key Features:**
- Upper and lower bound predictions
- Adaptive confidence scoring
- Trend analysis
- Volatility consideration

### Monte Carlo Simulation
A probabilistic technique that runs multiple random simulations to model uncertainty.

**Implementation:**
- Executes 100 independent price scenarios
- Each scenario uses randomized daily returns
- Shows distribution of possible outcomes
- Helps visualize risk and potential ranges

**Benefits:**
- Understand prediction uncertainty
- See best and worst case scenarios
- Risk assessment
- Portfolio planning support

---

## 📐 Metrics Explained

| Metric | Description | Usage |
|--------|-------------|-------|
| **Current Price** | Latest closing price from your dataset | Baseline for predictions |
| **Predicted Price** | LSTM forecast after N days | Target price expectation |
| **Expected Change** | Percentage change from current price | Quick gain/loss assessment |
| **Volatility** | Standard deviation of price movements | Risk measurement |
| **Confidence** | Prediction reliability (60-95%) | Decreases with forecast length |
| **Upper/Lower Bounds** | Price range boundaries | Risk tolerance planning |

---

## 💼 Trading Recommendations

The platform generates automated signals based on predicted price changes:

| Signal | Criteria | Interpretation |
|--------|----------|----------------|
| 🟢 **BUY** | Predicted increase > 3% | Strong upward trend expected |
| 🟡 **HOLD** | Predicted change -3% to +3% | Stable, wait for clearer signals |
| 🔴 **WAIT** | Predicted decrease > 3% | Potential downward movement |

**Note:** These are algorithmic suggestions, not financial advice.

---

## ⚠️ Important Disclaimer

**EDUCATIONAL USE ONLY**

This platform is designed for:
- Learning about stock prediction algorithms
- Understanding LSTM and Monte Carlo methods
- Exploring data visualization techniques
- Academic research and study

**This platform is NOT:**
- Professional financial advice
- A guaranteed prediction system
- A substitute for professional analysis
- Suitable for real trading decisions

**Key Points:**
- Predictions are probabilistic simulations based on historical patterns
- Past performance does not guarantee future results
- Stock markets are influenced by countless unpredictable factors
- Always consult licensed financial advisors before investing
- Never invest money you cannot afford to lose
- The creators assume no liability for financial losses

---

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution
- Adding more prediction algorithms
- Improving UI/UX design
- Adding data source integrations
- Writing documentation
- Bug fixes and performance improvements
- Adding unit tests

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**StockSight AI Development Team**

- **Mahindra Kumar** - Lead Developer
- **Khushia Dhava** - UI/UX Design & Frontend
- **Gourav** - Algorithm Implementation & Testing

---

## 📬 Contact & Support

Need help or have questions?

- 📧 **Email**: mahindrakumar_22161@aitpune.edu.in
- 💼 **LinkedIn**: [linkedin.com/in/mahindra8252](https://www.linkedin.com/in/mahindra8252)
- 🐛 **Issues**: [GitHub Issues](https://github.com/mahindra8252/StockSight---Stock-Prediction-Platform
/issues)

---

## 🙏 Acknowledgments

- Inspired by quantitative finance and machine learning research
- Built with modern React ecosystem
- Thanks to the open-source community for excellent tools
- Special thanks to all contributors and testers

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] Real-time stock data API integration
- [ ] Multiple stock comparison
- [ ] Portfolio tracking
- [ ] Export predictions to PDF
- [ ] Email alerts for price targets
- [ ] Technical indicators (RSI, MACD, etc.)
- [ ] News sentiment analysis
- [ ] Mobile app (React Native)

---

<div align="center">

**Made with ❤️ by Mahindra Kumar, Khushia Dhaka, and Gourav**

⭐ Star this repo if you find it helpful!

[Back to Top](#-stocksight-ai---stock-prediction-platform)

</div>
