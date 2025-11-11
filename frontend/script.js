/**
 * AI Market Dashboard JavaScript
 * Fetches analysis results and renders charts using Chart.js
 */

// Global variables to store chart instances
let marketGrowthChart, adoptionRateChart, industryChart, regionChart;

// Configuration for Chart.js
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.color = '#666';

/**
 * Initialize the dashboard when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Market Dashboard initializing...');
    
    // Load all data and render charts
    loadDashboardData();
});

/**
 * Main function to load all dashboard data
 */
async function loadDashboardData() {
    try {
        // Load ML analysis results
        const analysisData = await loadAnalysisResults();
        
        // Load industry/region static data
        const industryRegionData = await loadIndustryRegionData();
        
        if (analysisData && industryRegionData) {
            // Update model performance metrics
            updateModelPerformance(analysisData.model_performance);
            
            // Render all charts
            renderMarketGrowthChart(analysisData);
            renderAdoptionRateChart(analysisData);
            renderIndustryChart(industryRegionData.industries);
            renderRegionChart(industryRegionData.regions);
            
            // Update insights
            updateInsights(analysisData);
            
            // Hide loading, show performance metrics
            document.getElementById('statusMessage').style.display = 'none';
            document.getElementById('modelPerformance').style.display = 'block';
            
            console.log('Dashboard loaded successfully!');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load analysis data. Please run the Python analysis script first.');
    }
}

/**
 * Load ML analysis results from JSON file
 */
async function loadAnalysisResults() {
    try {
        const response = await fetch('../data/ai_analysis_results.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading analysis results:', error);
        throw error;
    }
}

/**
 * Load industry and region data from JSON file
 */
async function loadIndustryRegionData() {
    try {
        const response = await fetch('../data/industry_region.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading industry/region data:', error);
        throw error;
    }
}

/**
 * Update model performance metrics display
 */
function updateModelPerformance(performance) {
    document.getElementById('marketR2').textContent = performance.market_r2_score.toFixed(4);
    document.getElementById('adoptionR2').textContent = performance.adoption_r2_score.toFixed(4);
}

/**
 * Render the market growth chart with historical data and predictions
 */
function renderMarketGrowthChart(analysisData) {
    const ctx = document.getElementById('marketGrowthChart').getContext('2d');
    
    // Prepare historical data
    const historicalData = analysisData.historical_data.map(item => ({
        x: item.year,
        y: item.market_size
    }));
    
    // Prepare prediction data
    const predictionData = analysisData.predictions.map(item => ({
        x: item.year,
        y: item.predicted_market_size
    }));
    
    marketGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Historical Market Size (Billion $)',
                    data: historicalData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                },
                {
                    label: 'Predicted Market Size (Billion $)',
                    data: predictionData,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ff6b6b',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Year',
                        font: { size: 14, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Market Size (Billion USD)',
                        font: { size: 14, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    beginAtZero: true
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

/**
 * Render the adoption rate chart
 */
function renderAdoptionRateChart(analysisData) {
    const ctx = document.getElementById('adoptionRateChart').getContext('2d');
    
    // Prepare historical data
    const historicalData = analysisData.historical_data.map(item => ({
        x: item.year,
        y: item.adoption_rate
    }));
    
    // Prepare prediction data
    const predictionData = analysisData.predictions.map(item => ({
        x: item.year,
        y: item.predicted_adoption_rate
    }));
    
    adoptionRateChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Historical Adoption Rate (%)',
                    data: historicalData,
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(118, 75, 162, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#764ba2',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                },
                {
                    label: 'Predicted Adoption Rate (%)',
                    data: predictionData,
                    borderColor: '#ffa726',
                    backgroundColor: 'rgba(255, 167, 38, 0.1)',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ffa726',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Year',
                        font: { size: 14, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Adoption Rate (%)',
                        font: { size: 14, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    beginAtZero: true,
                    max: 100
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

/**
 * Render the industry adoption chart
 */
function renderIndustryChart(industriesData) {
    const ctx = document.getElementById('industryChart').getContext('2d');
    
    const labels = Object.keys(industriesData);
    const data = Object.values(industriesData);
    
    industryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#ff6b6b',
                    '#ffa726',
                    '#66bb6a',
                    '#42a5f5',
                    '#ab47bc'
                ],
                borderColor: '#fff',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render the regional adoption chart
 */
function renderRegionChart(regionsData) {
    const ctx = document.getElementById('regionChart').getContext('2d');
    
    const labels = Object.keys(regionsData);
    const data = Object.values(regionsData);
    
    regionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'AI Adoption Rate (%)',
                data: data,
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(255, 107, 107, 0.8)',
                    'rgba(255, 167, 38, 0.8)',
                    'rgba(102, 187, 106, 0.8)'
                ],
                borderColor: [
                    '#667eea',
                    '#764ba2',
                    '#ff6b6b',
                    '#ffa726',
                    '#66bb6a'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Region',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Adoption Rate (%)',
                        font: { size: 14, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

/**
 * Update insight cards with dynamic content based on data
 */
function updateInsights(analysisData) {
    const latestHistorical = analysisData.historical_data[analysisData.historical_data.length - 1];
    const latestPrediction = analysisData.predictions[analysisData.predictions.length - 1];
    const marketR2 = analysisData.model_performance.market_r2_score;
    
    // Market Growth Insight
    const marketGrowth = ((latestPrediction.predicted_market_size - latestHistorical.market_size) / latestHistorical.market_size * 100).toFixed(1);
    document.getElementById('marketInsight').textContent = 
        `AI market projected to grow ${marketGrowth}% by ${latestPrediction.year} with ${(marketR2 * 100).toFixed(1)}% model accuracy.`;
    
    // Adoption Trends Insight
    const adoptionGrowth = (latestPrediction.predicted_adoption_rate - latestHistorical.adoption_rate).toFixed(1);
    document.getElementById('adoptionInsight').textContent = 
        `Adoption rate expected to increase by ${adoptionGrowth}% points, reaching ${latestPrediction.predicted_adoption_rate.toFixed(1)}% by ${latestPrediction.year}.`;
    
    // Future Outlook Insight
    document.getElementById('futureInsight').textContent = 
        `Market size predicted to reach $${latestPrediction.predicted_market_size.toFixed(1)}B with sustained growth across all sectors.`;
}

/**
 * Show error message to user
 */
function showError(message) {
    const statusSection = document.querySelector('.status-section');
    statusSection.innerHTML = `
        <div class="error-message">
            <strong>Error:</strong> ${message}
            <br><br>
            <small>Make sure to run 'python backend/analysis.py' first to generate the required data files.</small>
        </div>
    `;
}

/**
 * Utility function to format numbers
 */
function formatNumber(num, decimals = 1) {
    return parseFloat(num).toFixed(decimals);
}