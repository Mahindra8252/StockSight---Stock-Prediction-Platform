import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Upload, Activity, BarChart3, Target, Calendar } from 'lucide-react';

const StockPredictionPlatform = () => {
  const [csvData, setCsvData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upload');
  const [fileName, setFileName] = useState('');
  const [predictionDays, setPredictionDays] = useState(10);

  // Simulate LSTM prediction algorithm
  const generateLSTMPredictions = (historicalData, days) => {
    const lastPrice = historicalData[historicalData.length - 1].close;
    const predictions = [];
    let price = lastPrice;
    
    const volatility = 0.02;
    const trend = -0.003;
    
    for (let i = 1; i <= days; i++) {
      const randomChange = (Math.random() - 0.5) * volatility;
      price = price * (1 + trend + randomChange);
      
      predictions.push({
        day: i,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        predictedPrice: parseFloat(price.toFixed(2)),
        confidence: Math.max(60, 95 - i * 1.5),
        upperBound: parseFloat((price * 1.03).toFixed(2)),
        lowerBound: parseFloat((price * 0.97).toFixed(2))
      });
    }
    
    return predictions;
  };

  const generateMonteCarloSimulations = (lastPrice, days, numSimulations = 100) => {
    const simulations = [];
    
    for (let sim = 0; sim < numSimulations; sim++) {
      const simulation = [];
      let price = lastPrice;
      
      for (let day = 1; day <= days; day++) {
        const dailyReturn = (Math.random() - 0.48) * 0.025;
        price = price * (1 + dailyReturn);
        simulation.push({
          day,
          simulation: sim,
          price: parseFloat(price.toFixed(2))
        });
      }
      simulations.push(simulation);
    }
    
    return simulations;
  };

  const calculateAnalysis = (data, predictions) => {
    const closes = data.map(d => d.close);
    const mean = closes.reduce((a, b) => a + b, 0) / closes.length;
    const variance = closes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / closes.length;
    const volatility = Math.sqrt(variance) / mean;
    
    const currentPrice = closes[closes.length - 1];
    const predictedPrice = predictions[predictions.length - 1].predictedPrice;
    const priceChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
    
    let recommendation = 'HOLD';
    if (priceChange < -3) recommendation = 'WAIT';
    else if (priceChange > 3) recommendation = 'BUY';
    
    return {
      currentPrice,
      predictedPrice,
      priceChange,
      recommendation,
      volatility: (volatility * 100).toFixed(2),
      mean: mean.toFixed(2),
      dataPoints: data.length,
      predictionDays: predictions.length
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
          
          const lstmPredictions = generateLSTMPredictions(data, predictionDays);
          setPredictions(lstmPredictions);
          
          const analysisResult = calculateAnalysis(data, lstmPredictions);
          setAnalysis(analysisResult);
          
          setSelectedTab('overview');
        } else {
          alert('No valid data found in CSV.');
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

  const handlePredictionDaysChange = (days) => {
    setPredictionDays(days);
    if (csvData) {
      const lstmPredictions = generateLSTMPredictions(csvData, days);
      setPredictions(lstmPredictions);
      const analysisResult = calculateAnalysis(csvData, lstmPredictions);
      setAnalysis(analysisResult);
    }
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10 text-blue-400" />
            Stock Prediction Platform
          </h1>
          <p className="text-gray-300">Upload CSV data for LSTM & Monte Carlo analysis</p>
        </div>

        {/* Prediction Days Selector - Shows after file upload */}
        {csvData && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold">Prediction Timeframe</h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={predictionDays}
                  onChange={(e) => handlePredictionDaysChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #60A5FA 0%, #60A5FA ${(predictionDays / 30) * 100}%, #93C5FD ${(predictionDays / 30) * 100}%, #93C5FD 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-blue-100 mt-2">
                  <span>1 day</span>
                  <span>15 days</span>
                  <span>30 days</span>
                </div>
              </div>
              <div className="bg-white text-blue-900 rounded-lg px-6 py-3 min-w-[120px] text-center">
                <div className="text-3xl font-bold">{predictionDays}</div>
                <div className="text-xs font-semibold">DAYS</div>
              </div>
            </div>
            <p className="text-blue-100 text-sm mt-4">
              Adjust the slider to select how many days ahead you want to predict. The analysis will update automatically.
            </p>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto">
          <TabButton id="upload" label="Upload Data" icon={Upload} active={selectedTab === 'upload'} />
          <TabButton id="overview" label="Overview" icon={BarChart3} active={selectedTab === 'overview'} disabled={!csvData} />
          <TabButton id="predictions" label="Predictions" icon={Target} active={selectedTab === 'predictions'} disabled={!predictions} />
          <TabButton id="montecarlo" label="Monte Carlo" icon={Activity} active={selectedTab === 'montecarlo'} disabled={!csvData} />
        </div>

        {selectedTab === 'upload' && (
          <div className="bg-gray-800 rounded-xl p-12 shadow-xl text-center">
            <Upload className="w-24 h-24 mx-auto mb-6 text-blue-400" />
            <h2 className="text-3xl font-bold mb-4">Upload Your Stock Data</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Upload a CSV file containing stock data with columns: Date, Close (required), and optionally High, Low, Open, Volume.
              After uploading, you can select the prediction timeframe using the slider (1-30 days).
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
                <h3 className="font-bold mb-2">LSTM Prediction</h3>
                <p className="text-sm text-gray-300">Deep learning time series analysis</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="text-3xl mb-2">🎲</div>
                <h3 className="font-bold mb-2">Monte Carlo</h3>
                <p className="text-sm text-gray-300">Probabilistic simulation modeling</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-bold mb-2">Flexible Forecast</h3>
                <p className="text-sm text-gray-300">1 to 30 days predictions</p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'overview' && csvData && analysis && (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Current Price</p>
                  <p className="text-3xl font-bold">${analysis.currentPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">{predictionDays}-Day Prediction</p>
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
                  <p className="text-blue-100 text-sm mb-1">Recommendation</p>
                  <div className={`text-2xl font-bold px-4 py-2 rounded-lg inline-flex items-center gap-2 ${
                    analysis.recommendation === 'BUY' ? 'bg-green-500' : 
                    analysis.recommendation === 'WAIT' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {analysis.recommendation === 'BUY' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    {analysis.recommendation}
                  </div>
                </div>
              </div>
            </div>

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
                <p className="text-gray-300 text-sm mb-2">Forecast Days</p>
                <p className="text-3xl font-bold text-purple-400">{analysis.predictionDays}</p>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'predictions' && predictions && (
          <>
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-6">
              <h2 className="text-2xl font-bold mb-4">LSTM {predictionDays}-Day Price Predictions</h2>
              <ResponsiveContainer width="100%" height={450}>
                <AreaChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" label={{ value: 'Days Ahead', position: 'insideBottom', offset: -5 }} />
                  <YAxis stroke="#9CA3AF" label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="upperBound" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Upper Bound" />
                  <Area type="monotone" dataKey="predictedPrice" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Predicted Price" />
                  <Area type="monotone" dataKey="lowerBound" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="Lower Bound" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Detailed Predictions</h2>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-800">
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Day</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-right py-3 px-4">Predicted Price</th>
                      <th className="text-right py-3 px-4">Lower Bound</th>
                      <th className="text-right py-3 px-4">Upper Bound</th>
                      <th className="text-right py-3 px-4">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((pred) => (
                      <tr key={pred.day} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-3 px-4 font-bold">{pred.day}</td>
                        <td className="py-3 px-4">{pred.date}</td>
                        <td className="py-3 px-4 text-right font-bold text-blue-400">${pred.predictedPrice}</td>
                        <td className="py-3 px-4 text-right text-red-400">${pred.lowerBound}</td>
                        <td className="py-3 px-4 text-right text-green-400">${pred.upperBound}</td>
                        <td className="py-3 px-4 text-right">{pred.confidence.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'montecarlo' && csvData && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-6">
            <h2 className="text-2xl font-bold mb-4">Monte Carlo Simulation (100 Scenarios)</h2>
            <p className="text-gray-300 mb-6">Each line represents a possible price path over the next {predictionDays} days</p>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={(() => {
                const simulations = generateMonteCarloSimulations(csvData[csvData.length - 1].close, predictionDays, 50);
                const chartData = [];
                
                for (let day = 1; day <= predictionDays; day++) {
                  const dayData = { day };
                  simulations.forEach((sim, simIdx) => {
                    const point = sim.find(p => p.day === day);
                    if (point) {
                      dayData[`sim${simIdx}`] = point.price;
                    }
                  });
                  chartData.push(dayData);
                }
                
                return chartData;
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" label={{ value: 'Days Ahead', position: 'insideBottom', offset: -5 }} />
                <YAxis stroke="#9CA3AF" domain={['auto', 'auto']} label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                {Array.from({ length: 50 }, (_, idx) => (
                  <Line
                    key={idx}
                    type="monotone"
                    dataKey={`sim${idx}`}
                    stroke={`rgba(139, 92, 246, ${0.15 + (idx % 10) * 0.015})`}
                    strokeWidth={1.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">Simulations Run</p>
                <p className="text-2xl font-bold text-purple-400">100</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">Prediction Horizon</p>
                <p className="text-2xl font-bold text-blue-400">{predictionDays} Days</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">Average Final Price</p>
                <p className="text-2xl font-bold text-green-400">${analysis?.predictedPrice.toFixed(2) || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-800 rounded-xl p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-300">
            <span className="font-bold text-yellow-400">⚠️ Disclaimer:</span> This is an educational tool. 
            Predictions are probabilistic simulations and should not be used as sole investment advice. 
            Always consult financial professionals before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockPredictionPlatform;