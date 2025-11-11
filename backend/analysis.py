# #!/usr/bin/env python3

# """
# AI Market Analysis Script
# Performs linear regression on AI market data and generates predictions
# """

import os
import json
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
def load_data():
    """Load AI market data from CSV file"""
    try:
        # Load the main dataset
        data_path = os.path.join('data', 'ai_market.csv')
        df = pd.read_csv(data_path)
        print(f"Loaded {len(df)} records from {data_path}")
        return df
    except FileNotFoundError:
        print("Error: ai_market.csv not found in data/ directory")
        return None

def perform_regression(df):
    """Perform linear regression on market size data"""
    # Prepare features (X) and target (y)
    X = df[['Year']].values  # Features: Year
    y_market = df['MarketSize'].values  # Target: Market Size
    y_adoption = df['AdoptionRate'].values  # Target: Adoption Rate
    
    # Create and train models
    model_market = LinearRegression()
    model_adoption = LinearRegression()
    
    model_market.fit(X, y_market)
    model_adoption.fit(X, y_adoption)
    
    # Generate predictions for current years
    market_predictions = model_market.predict(X)
    adoption_predictions = model_adoption.predict(X)
    
    # Calculate model performance
    market_r2 = r2_score(y_market, market_predictions)
    adoption_r2 = r2_score(y_adoption, adoption_predictions)
    
    print(f"Market Size Model R² Score: {market_r2:.4f}")
    print(f"Adoption Rate Model R² Score: {adoption_r2:.4f}")
    
    return model_market, model_adoption, market_r2, adoption_r2

def generate_future_predictions(model_market, model_adoption, base_year=2024, years_ahead=5):
    """Generate predictions for future years"""
    future_years = np.array([[base_year + i] for i in range(1, years_ahead + 1)])
    
    future_market = model_market.predict(future_years)
    future_adoption = model_adoption.predict(future_years)
    
    # Create predictions dataframe
    predictions_df = pd.DataFrame({
        'Year': future_years.flatten(),
        'PredictedMarketSize': future_market,
        'PredictedAdoptionRate': future_adoption
    })
    
    return predictions_df

def save_results(df_original, df_predictions, market_r2, adoption_r2):
    """Save analysis results to CSV and JSON files"""
    
    # Combine original and predicted data for CSV
    combined_df = pd.DataFrame({
        'Year': list(df_original['Year']) + list(df_predictions['Year']),
        'MarketSize': list(df_original['MarketSize']) + [None] * len(df_predictions),
        'AdoptionRate': list(df_original['AdoptionRate']) + [None] * len(df_predictions),
        'PredictedMarketSize': [None] * len(df_original) + list(df_predictions['PredictedMarketSize']),
        'PredictedAdoptionRate': [None] * len(df_original) + list(df_predictions['PredictedAdoptionRate']),
        'Type': ['Historical'] * len(df_original) + ['Predicted'] * len(df_predictions)
    })
    
    # Save to CSV
    csv_path = os.path.join('data', 'ai_analysis_results.csv')
    combined_df.to_csv(csv_path, index=False)
    print(f"Results saved to {csv_path}")
    
    # Prepare JSON data for frontend
    json_data = {
        'model_performance': {
            'market_r2_score': round(market_r2, 4),
            'adoption_r2_score': round(adoption_r2, 4)
        },
        'historical_data': [
            {
                'year': int(row['Year']),
                'market_size': float(row['MarketSize']),
                'adoption_rate': float(row['AdoptionRate'])
            }
            for _, row in df_original.iterrows()
        ],
        'predictions': [
            {
                'year': int(row['Year']),
                'predicted_market_size': round(float(row['PredictedMarketSize']), 2),
                'predicted_adoption_rate': round(float(row['PredictedAdoptionRate']), 2)
            }
            for _, row in df_predictions.iterrows()
        ]
    }
    
    # Save to JSON
    json_path = os.path.join('data', 'ai_analysis_results.json')
    with open(json_path, 'w') as f:
        json.dump(json_data, f, indent=2)
    print(f"JSON results saved to {json_path}")
    
    return json_data

def main():
    """Main analysis function"""
    print("=== AI Market Analysis Started ===")
    
    # Load data
    df = load_data()
    if df is None:
        return
    
    print("\nDataset Overview:")
    print(df.head())
    print(f"\nData shape: {df.shape}")
    
    # Perform regression analysis
    print("\n=== Performing Linear Regression ===")
    model_market, model_adoption, market_r2, adoption_r2 = perform_regression(df)
    
    # Generate future predictions
    print("\n=== Generating Future Predictions ===")
    predictions_df = generate_future_predictions(model_market, model_adoption)
    print("Future Predictions:")
    print(predictions_df)
    
    # Save results
    print("\n=== Saving Results ===")
    json_data = save_results(df, predictions_df, market_r2, adoption_r2)
    
    print("\n=== Analysis Complete ===")
    print("Files generated:")
    print("- data/ai_analysis_results.csv")
    print("- data/ai_analysis_results.json")
    print("\nYou can now open frontend/index.html to view the dashboard!")

if __name__ == "__main__":
    main()

    
# FOR VSCODE:
# python backend\analysis.py
# python -m http.server 8000
# http://localhost:8000/frontend

# FOR POWERSHELL
# cd "C:\Users\HP\OneDrive\Desktop\the-impact-of-ai-on-global-market"; .\.venv\Scripts\Activate.ps1; python backend\analysis.py; python -m http.server 8000
#  http://localhost:8000/frontend