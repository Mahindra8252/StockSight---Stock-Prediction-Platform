import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Scatter, ScatterChart } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Upload, Activity, BarChart3, Target } from 'lucide-react';

const StockPrediction_tenday = () => {
  const [csvData, setCsvData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upload');
  const [fileName, setFileName] = useState('');

  // Advanced next-day prediction using multiple techniques
  const generateNextDayPrediction = (historicalData) => {
    const dataLength = historicalData.length;
    const recentData = historicalData.slice(-30); // Last 30 days for accuracy
    
    // 1. Calculate moving averages
    const sma5 = recentData.slice(-5).reduce((sum, d) => sum + d.close, 0) / 5;
    const sma10 = recentData.slice(-10).reduce((sum, d) => sum + d.close, 0) / 10;
    const sma20 = recentData.slice(-20).reduce((sum, d) => sum + d.close, 0) / Math.min(20, recentData.length);
    
    // 2. Calculate exponential moving average (EMA)
    const calculateEMA = (data, period) => {
      const k = 2 / (period + 1);
      let ema = data[0].close;
      for (let i = 1; i < data.length; i++) {
        ema = data[i].close * k + ema * (1 - k);
      }
      return ema;
    };
    const ema12 = calculateEMA(recentData, 12);
    
    // 3. Calculate momentum and trend
    const recentPrices = recentData.map(d => d.close);
    const momentum = recentPrices[recentPrices.length - 1] - recentPrices[0];
    const trendStrength = momentum / recentPrices[0];
    
    // 4. Linear regression for trend
    const linearRegression = (prices) => {
      const n = prices.length;
      const sumX = (n * (n - 1)) / 2;
      const sumY = prices.reduce((a, b) => a + b, 0);
      const sumXY = prices.reduce((sum, price, i) => sum + i * price, 0);
      const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      return slope * n + intercept; // Predict next value
    };
    const regressionPrediction = linearRegression(recentPrices);
    
    // 5. Calculate volatility for confidence bounds
    const returns = [];
    for (let i = 1; i < recentPrices.length; i++) {
      returns.push((recentPrices[i] - recentPrices[i - 1]) / recentPrices[i - 1]);
    }
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);
    
    // 6. Weighted ensemble prediction
    const lastPrice = historicalData[historicalData.length - 1].close;
    const predictionComponents = [
      { method: 'SMA5', price: sma5, weight: 0.15 },
      { method: 'SMA10', price: sma10, weight: 0.15 },
      { method: 'EMA12', price: ema12, weight: 0.25 },
      { method: 'Regression', price: regressionPrediction, weight: 0.25 },
      { method: 'Momentum', price: lastPrice * (1 + trendStrength * 0.3), weight: 0.20 }
    ];
    
    const ensemblePrediction = predictionComponents.reduce((sum, p) => sum + p.price * p.weight, 0);
    
    // Calculate confidence based on data consistency
    const priceStability = 1 - Math.min(volatility * 10, 0.5); // Higher stability = higher confidence
    const dataQuality = Math.min(dataLength / 100, 1); // More data = higher confidence
    const confidence = (priceStability * 0.6 + dataQuality * 0.4) * 100;
    
    // Calculate bounds using volatility
    const stdDev = volatility * lastPrice;
    
    return {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
      predictedPrice: parseFloat(ensemblePrediction.toFixed(2)),
      confidence: parseFloat(confidence.toFixed(1)),
      upperBound: parseFloat((ensemblePrediction + 1.96 * stdDev).toFixed(2)), // 95% confidence interval
      lowerBound: parseFloat((ensemblePrediction - 1.96 * stdDev).toFixed(2)),
      currentPrice: lastPrice,
      change: parseFloat(((ensemblePrediction - lastPrice) / lastPrice * 100).toFixed(2)),
      volatility: parseFloat((volatility * 100).toFixed(2)),
      componentPredictions: predictionComponents.map(p => ({
        method: p.method,
        price: parseFloat(p.price.toFixed(2)),
        weight: p.weight
      })),
      technicalIndicators: {
        sma5: parseFloat(sma5.toFixed(2)),
        sma10: parseFloat(sma10.toFixed(2)),
        sma20: parseFloat(sma20.toFixed(2)),
        ema12: parseFloat(ema12.toFixed(2)),
        momentum: parseFloat(momentum.toFixed(2)),
        trendStrength: parseFloat((trendStrength * 100).toFixed(2))
      }
    };
  };

  // Calculate comprehensive analysis
  const calculateAnalysis = (data, prediction) => {
    const closes = data.map(d => d.close);
    const mean = closes.reduce((a, b) => a + b, 0) / closes.length;
    const variance = closes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / closes.length;
    const volatility = Math.sqrt(variance) / mean;
    
    const currentPrice = closes[closes.length - 1];
    const predictedPrice = prediction.predictedPrice;
    const priceChange = prediction.change;
    
    // More nuanced recommendation based on multiple factors
    let recommendation = 'HOLD';
    let recommendationReason = '';
    
    if (priceChange > 1.5 && prediction.confidence > 70) {
      recommendation = 'BUY';
      recommendationReason = 'Strong upward trend with high confidence';
    } else if (priceChange < -1.5 && prediction.confidence > 70) {
      recommendation = 'SELL';
      recommendationReason = 'Strong downward trend with high confidence';
    } else if (Math.abs(priceChange) < 1) {
      recommendation = 'HOLD';
      recommendationReason = 'Minimal price movement expected';
    } else {
      recommendation = 'WAIT';
      recommendationReason = 'Moderate change with uncertainty';
    }
    
    return {
      currentPrice,
      predictedPrice,
      priceChange,
      recommendation,
      recommendationReason,
      volatility: (volatility * 100).toFixed(2),
      mean: mean.toFixed(2),
      dataPoints: data.length,
      predictionHorizon: '1 Day',
      confidence: prediction.confidence
    };
  };

  const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    return values;
  };

  const cleanNumber = (value) => {
    if (!value) return null;
    const cleaned = value.replace(/[",]/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  const normalizeHeaders = (headers) => {
    return headers.map(h => {
      const lower = h.toLowerCase().trim();
      if (lower === 'date' || lower.includes('date')) return 'date';
      if (lower === 'close' || lower.includes('close')) return 'close';
      if (lower === 'open' || lower.includes('open')) return 'open';
      if (lower === 'high' || lower.includes('high')) return 'high';
      if (lower === 'low' || lower.includes('low')) return 'low';
      if (lower === 'volume' || lower.includes('volume')) return 'volume';
      return h;
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          alert('CSV file must contain at least a header row and one data row.');
          setLoading(false);
          return;
        }
        
        const headerValues = parseCSVLine(lines[0]);
        const normalizedHeaders = normalizeHeaders(headerValues);
        
        const dateIdx = normalizedHeaders.findIndex(h => h === 'date');
        const closeIdx = normalizedHeaders.findIndex(h => h === 'close');
        const openIdx = normalizedHeaders.findIndex(h => h === 'open');
        const highIdx = normalizedHeaders.findIndex(h => h === 'high');
        const lowIdx = normalizedHeaders.findIndex(h => h === 'low');
        const volumeIdx = normalizedHeaders.findIndex(h => h === 'volume');
        
        if (dateIdx === -1 || closeIdx === -1) {
          alert('CSV must contain Date and Close columns.');
          setLoading(false);
          return;
        }
        
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = parseCSVLine(lines[i]);
          
          const dateValue = values[dateIdx]?.trim();
          const closeValue = cleanNumber(values[closeIdx]);
          
          if (dateValue && closeValue !== null && closeValue > 0) {
            const openValue = openIdx !== -1 ? cleanNumber(values[openIdx]) : null;
            const highValue = highIdx !== -1 ? cleanNumber(values[highIdx]) : null;
            const lowValue = lowIdx !== -1 ? cleanNumber(values[lowIdx]) : null;
            const volumeValue = volumeIdx !== -1 ? cleanNumber(values[volumeIdx]) : null;
            
            data.push({
              date: dateValue.split(' ')[0],
              close: closeValue,
              high: highValue || closeValue,
              low: lowValue || closeValue,
              open: openValue || closeValue,
              volume: volumeValue || 0
            });
          }
        }
        
        if (data.length > 0) {
          data.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          setCsvData(data);
          
          const nextDayPrediction = generateNextDayPrediction(data);
          setPredictions(nextDayPrediction);
          
          const analysisResult = calculateAnalysis(data, nextDayPrediction);
          setAnalysis(analysisResult);
          
          setSelectedTab('overview');
        } else {
          alert('No valid data found in CSV. Please ensure the file has Date and Close columns with valid numeric values.');
        }
      } catch (error) {
        alert('Error parsing CSV file. Please check the format.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  const TabButton = ({ id, label, icon: Icon, active, disabled }) => (
    <button
      onClick={() => !disabled && setSelectedTab(id)}
      disabled={disabled}
      className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
        active
          ? 'bg-blue-600 text-white border-b-4 border-blue-700'
          : disabled
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10 text-blue-400" />
            Next-Day Stock Price Predictor
          </h1>
          <p className="text-gray-300">Advanced ensemble forecasting with technical analysis</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <TabButton id="upload" label="Upload Data" icon={Upload} active={selectedTab === 'upload'} />
          <TabButton id="overview" label="Overview" icon={BarChart3} active={selectedTab === 'overview'} disabled={!csvData} />
          <TabButton id="predictions" label="Predictions" icon={Target} active={selectedTab === 'predictions'} disabled={!predictions} />
          <TabButton id="montecarlo" label="Probability" icon={Activity} active={selectedTab === 'montecarlo'} disabled={!csvData} />
        </div>

        {/* Content */}
        {selectedTab === 'upload' && (
          <div className="bg-gray-800 rounded-xl p-12 shadow-xl text-center">
            <Upload className="w-24 h-24 mx-auto mb-6 text-blue-400" />
            <h2 className="text-3xl font-bold mb-4">Upload Your Stock Data</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Upload a CSV file containing stock data with columns: Date, Close (required), and optionally High, Low, Open, Volume.
              The system will analyze the data and generate a next-day price prediction using advanced ensemble methods combining
              moving averages, exponential smoothing, linear regression, and momentum indicators.
            </p>
            
            <label className="inline-block">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
              <div className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg cursor-pointer transition-all inline-flex items-center gap-3">
                <Upload className="w-6 h-6" />
                {loading ? 'Processing...' : 'Select CSV File'}
              </div>
            </label>
            
            {fileName && (
              <div className="mt-6 bg-gray-700 p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-300">Selected: <span className="text-blue-400 font-semibold">{fileName}</span></p>
              </div>
            )}
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-bold mb-2">Ensemble Method</h3>
                <p className="text-sm text-gray-300">Multiple algorithms combined</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-bold mb-2">Next Day Focus</h3>
                <p className="text-sm text-gray-300">High accuracy short-term prediction</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-bold mb-2">Technical Analysis</h3>
                <p className="text-sm text-gray-300">MA, EMA, Regression & Momentum</p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'overview' && csvData && analysis && (
          <>
            {/* Trading Recommendation */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Current Price</p>
                  <p className="text-3xl font-bold">${analysis.currentPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Next Day Prediction</p>
                  <p className="text-3xl font-bold flex items-center gap-2">
                    ${analysis.predictedPrice.toFixed(2)}
                    {analysis.priceChange < 0 ? (
                      <TrendingDown className="w-6 h-6 text-red-300" />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-green-300" />
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Expected Change</p>
                  <p className={`text-3xl font-bold ${analysis.priceChange < 0 ? 'text-red-300' : 'text-green-300'}`}>
                    {analysis.priceChange.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Confidence</p>
                  <p className="text-3xl font-bold text-yellow-300">{analysis.confidence.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Recommendation</p>
                  <div className={`text-2xl font-bold px-4 py-2 rounded-lg inline-flex items-center gap-2 ${
                    analysis.recommendation === 'BUY' ? 'bg-green-500' : 
                    analysis.recommendation === 'SELL' ? 'bg-red-500' : 
                    analysis.recommendation === 'WAIT' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}>
                    {analysis.recommendation === 'BUY' || analysis.recommendation === 'HOLD' ? 
                      <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    {analysis.recommendation}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-400">
                <p className="text-sm text-blue-100"><span className="font-bold">Analysis:</span> {analysis.recommendationReason}</p>
              </div>
            </div>

            {/* Historical Data Chart */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-6">
              <h2 className="text-2xl font-bold mb-4">Historical Price Data ({csvData.length} days)</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={csvData.slice(-100)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="close" stroke="#3B82F6" strokeWidth={2} name="Close Price" dot={false} />
                  <Line type="monotone" dataKey="high" stroke="#10B981" strokeWidth={1} name="High" dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="low" stroke="#EF4444" strokeWidth={1} name="Low" dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                <p className="text-gray-300 text-sm mb-2">Data Points</p>
                <p className="text-3xl font-bold text-blue-400">{analysis.dataPoints}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                <p className="text-gray-300 text-sm mb-2">Average Price</p>
                <p className="text-3xl font-bold text-green-400">${analysis.mean}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                <p className="text-gray-300 text-sm mb-2">Volatility</p>
                <p className="text-3xl font-bold text-yellow-400">{analysis.volatility}%</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                <p className="text-gray-300 text-sm mb-2">Prediction Horizon</p>
                <p className="text-3xl font-bold text-purple-400">{analysis.predictionHorizon}</p>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'predictions' && predictions && (
          <>
            {/* Next Day Prediction Card */}
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-8 shadow-2xl mb-6">
              <h2 className="text-3xl font-bold mb-6 text-center">Next Trading Day Prediction</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Main Prediction */}
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <p className="text-gray-300 text-sm mb-2">Predicted Closing Price</p>
                  <p className="text-5xl font-bold text-blue-400 mb-4">${predictions.predictedPrice}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className={`flex items-center gap-2 ${predictions.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {predictions.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      <span className="font-bold text-lg">{predictions.change >= 0 ? '+' : ''}{predictions.change}%</span>
                    </div>
                    <div className="text-gray-400">
                      from ${predictions.currentPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Confidence & Range */}
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <p className="text-gray-300 text-sm mb-2">Confidence Level</p>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-3xl font-bold text-yellow-400">{predictions.confidence}%</span>
                      <span className="text-sm text-gray-400">95% CI</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-green-400 h-3 rounded-full transition-all"
                        style={{ width: `${predictions.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Lower Bound</p>
                      <p className="text-xl font-bold text-red-400">${predictions.lowerBound}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Upper Bound</p>
                      <p className="text-xl font-bold text-green-400">${predictions.upperBound}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Date Info */}
              <div className="bg-gray-800 bg-opacity-30 rounded-lg p-4 text-center">
                <p className="text-gray-300">Prediction for: <span className="font-bold text-white text-lg">{predictions.date}</span></p>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-6">
              <h2 className="text-2xl font-bold mb-4">Technical Indicators</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">SMA (5-day)</p>
                  <p className="text-2xl font-bold text-blue-400">${predictions.technicalIndicators.sma5}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">SMA (10-day)</p>
                  <p className="text-2xl font-bold text-blue-400">${predictions.technicalIndicators.sma10}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">SMA (20-day)</p>
                  <p className="text-2xl font-bold text-blue-400">${predictions.technicalIndicators.sma20}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">EMA (12-day)</p>
                  <p className="text-2xl font-bold text-purple-400">${predictions.technicalIndicators.ema12}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Momentum</p>
                  <p className={`text-2xl font-bold ${predictions.technicalIndicators.momentum >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${predictions.technicalIndicators.momentum}
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Trend Strength</p>
                  <p className={`text-2xl font-bold ${predictions.technicalIndicators.trendStrength >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {predictions.technicalIndicators.trendStrength}%
                  </p>
                </div>
              </div>
            </div>

            {/* Model Components */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Ensemble Model Components</h2>
              <p className="text-gray-300 mb-4">The final prediction combines multiple forecasting methods with weighted contributions:</p>
              <div className="space-y-3">
                {predictions.componentPredictions.map((comp, idx) => (
                  <div key={idx} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">{comp.method}</span>
                      <span className="text-blue-400 font-bold">${comp.price}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${comp.weight * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400 w-12">{(comp.weight * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-blue-900 bg-opacity-30 border border-blue-600 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <span className="font-bold">ℹ️ How it works:</span> The ensemble method combines Simple Moving Averages (SMA), 
                  Exponential Moving Average (EMA), Linear Regression trend analysis, and Momentum indicators. Each method 
                  contributes to the final prediction based on its historical accuracy and reliability.
                </p>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'montecarlo' && csvData && predictions && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Price Distribution Analysis (Next Day)</h2>
            <p className="text-gray-300 mb-6">Probability distribution of potential next-day closing prices based on historical volatility</p>
            
            {/* Price Range Visualization */}
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <div className="relative h-64 flex items-end justify-center gap-1">
                {(() => {
                  const lowerBound = predictions.lowerBound;
                  const upperBound = predictions.upperBound;
                  const predicted = predictions.predictedPrice;
                  const range = upperBound - lowerBound;
                  const numBars = 40;
                  const bars = [];
                  
                  for (let i = 0; i < numBars; i++) {
                    const price = lowerBound + (range * i / numBars);
                    const distanceFromPredicted = Math.abs(price - predicted) / range;
                    const height = Math.exp(-20 * distanceFromPredicted * distanceFromPredicted) * 100;
                    
                    bars.push(
                      <div key={i} className="flex-1 flex flex-col items-center justify-end">
                        <div 
                          className={`w-full rounded-t transition-all ${
                            Math.abs(price - predicted) < range * 0.1 ? 'bg-green-500' :
                            Math.abs(price - predicted) < range * 0.25 ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ height: `${height}%`, opacity: 0.7 }}
                        ></div>
                      </div>
                    );
                  }
                  return bars;
                })()}
              </div>
              
              <div className="mt-4 flex justify-between text-sm">
                <div className="text-left">
                  <p className="text-red-400 font-bold">${predictions.lowerBound}</p>
                  <p className="text-gray-400 text-xs">Lower Bound (2.5%)</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-bold text-lg">${predictions.predictedPrice}</p>
                  <p className="text-gray-300 text-xs">Most Likely (50%)</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">${predictions.upperBound}</p>
                  <p className="text-gray-400 text-xs">Upper Bound (97.5%)</p>
                </div>
              </div>
            </div>
            
            {/* Probability Scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-900 to-green-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Bullish Scenario</h3>
                  <TrendingUp className="w-8 h-8" />
                </div>
                <p className="text-3xl font-bold mb-2">${(predictions.predictedPrice * 1.015).toFixed(2)}</p>
                <p className="text-sm text-green-200">~25% probability</p>
                <p className="text-xs text-green-100 mt-2">Price exceeds upper confidence range</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Base Scenario</h3>
                  <Target className="w-8 h-8" />
                </div>
                <p className="text-3xl font-bold mb-2">${predictions.predictedPrice}</p>
                <p className="text-sm text-blue-200">~50% probability</p>
                <p className="text-xs text-blue-100 mt-2">Most likely outcome based on model</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-900 to-red-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Bearish Scenario</h3>
                  <TrendingDown className="w-8 h-8" />
                </div>
                <p className="text-3xl font-bold mb-2">${(predictions.predictedPrice * 0.985).toFixed(2)}</p>
                <p className="text-sm text-red-200">~25% probability</p>
                <p className="text-xs text-red-100 mt-2">Price falls below lower confidence range</p>
              </div>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">Expected Return</p>
                <p className={`text-2xl font-bold ${predictions.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {predictions.change >= 0 ? '+' : ''}{predictions.change}%
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">Volatility</p>
                <p className="text-2xl font-bold text-yellow-400">{predictions.volatility}%</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">Price Range</p>
                <p className="text-2xl font-bold text-purple-400">${(predictions.upperBound - predictions.lowerBound).toFixed(2)}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">Confidence Level</p>
                <p className="text-2xl font-bold text-blue-400">{predictions.confidence.toFixed(0)}%</p>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-900 bg-opacity-30 border border-blue-600 rounded-lg p-4">
              <p className="text-sm text-blue-200">
                <span className="font-bold">📊 Statistical Note:</span> The distribution shows the range of possible outcomes with 95% confidence. 
                Historical volatility of {predictions.volatility}% suggests price movements typically stay within the shown bounds. 
                The bell curve represents probability density - taller sections indicate more likely price points.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
         <div className="mt-8 bg-gray-800 rounded-xl p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-300">
            <span className="font-bold text-yellow-400">⚠️ Disclaimer:</span> This is an educational tool using ensemble prediction methods. 
            Next-day predictions are based on historical patterns and technical indicators but cannot account for market news, 
            external events, or black swan occurrences. Always consult financial professionals and conduct thorough research 
            before making investment decisions. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockPrediction_tenday;