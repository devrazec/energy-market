import os
import requests
import json
from datetime import datetime, timezone

# Porto, Portugal coordinates
PORTO_LAT = 41.1579
PORTO_LON = -8.6291

def generate_minute_prices_by_city():
    """
    Generate per-minute electricity prices for a full day from 8 different city sources
    Each city has slightly different pricing based on OMIE base prices with regional variations
    """
    import random
    from datetime import timedelta
    
    cities = [
        "Lisbon",
        "Porto",
        "Faro",
        "Coimbra",
        "Braga",
        "Bragança",
        "Leiria",
        "Guarda"
    ]
    
    # City-specific price multipliers (simulating regional differences)
    city_multipliers = {
        "Lisbon": 1.05,      # Higher prices in capital
        "Porto": 1.02,       # Slightly higher in major city
        "Faro": 1.08,        # Higher in tourist region
        "Coimbra": 0.98,     # Lower in smaller city
        "Braga": 0.97,       # Lower in northern region
        "Bragança": 0.95,    # Lowest in rural area
        "Leiria": 0.99,      # Average pricing
        "Guarda": 0.96       # Lower in mountain region
    }
    
    try:
        # Get base prices from OMIE for today
        now = datetime.now(timezone.utc)
        date_str = now.strftime("%Y%m%d")
        date_part = now.strftime("%Y-%m-%d")
        
        # Fetch OMIE data for base hourly prices
        url = f"https://www.omie.es/pt/file-download?parents%5B0%5D=marginalpdbc&filename=marginalpdbc_{date_str}.1"
        
        hourly_base_prices = {}
        
        try:
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                lines = response.text.strip().split('\n')
                data_lines = [line for line in lines if line and not line.startswith('Año') and not line.startswith('Year')]
                
                for line in data_lines[1:]:
                    if ';' not in line:
                        continue
                    
                    parts = line.split(';')
                    
                    if len(parts) >= 4:
                        try:
                            hour = int(parts[3]) - 1
                            
                            if hour < 0 or hour > 23:
                                continue
                            
                            price_mwh = None
                            for i in range(4, min(len(parts), 7)):
                                try:
                                    price_val = parts[i].replace(',', '.').strip()
                                    if price_val and price_val != '':
                                        price_mwh = float(price_val)
                                        break
                                except:
                                    continue
                            
                            if price_mwh is not None:
                                price_kwh = round(price_mwh / 1000, 4)
                                hourly_base_prices[hour] = price_kwh
                        except:
                            continue
        except:
            print("Could not fetch OMIE data, using default prices")
        
        # If no data fetched, use default hourly prices
        if not hourly_base_prices:
            hourly_base_prices = {
                0: 0.0465, 1: 0.0421, 2: 0.035, 3: 0.035, 4: 0.035, 5: 0.035,
                6: 0.035, 7: 0.03, 8: 0.02, 9: 0.0178, 10: 0.018, 11: 0.0165,
                12: 0.0147, 13: 0.0145, 14: 0.0145, 15: 0.0142, 16: 0.0161, 17: 0.0162,
                18: 0.0161, 19: 0.0161, 20: 0.0162, 21: 0.0163, 22: 0.0164, 23: 0.0165
            }
        
        # Generate minute-by-minute prices for each city
        prices_by_city = {}
        
        for city in cities:
            city_prices = {}
            multiplier = city_multipliers[city]
            
            # Generate 1440 minutes (24 hours * 60 minutes)
            for hour in range(24):
                base_hour_price = hourly_base_prices.get(hour, 0.02)
                
                for minute in range(60):
                    time_key = f"{hour:02d}:{minute:02d}"
                    
                    # Add small random variation within the minute (±2%)
                    minute_variation = 1 + (random.random() - 0.5) * 0.04
                    
                    # Calculate final price: base * city_multiplier * minute_variation
                    final_price = base_hour_price * multiplier * minute_variation
                    
                    city_prices[time_key] = str(round(final_price, 4))
            
            prices_by_city[city] = city_prices
        
        # Format the response
        result = {
            "date": date_part,
            "interval": "per_minute",
            "sources": prices_by_city,
            "units": {
                "price": "EUR/kWh"
            },
            "note": "Per-minute electricity prices from 8 Portuguese cities. Based on OMIE market prices with regional variations."
        }
        
        print(f"Successfully generated minute-by-minute prices for {len(cities)} cities")
        return result
        
    except Exception as e:
        print(f"Exception occurred while generating minute prices: {str(e)}")
        return {"error": str(e)}

def generate_integer_values_by_city():
    """
    Generate per-minute integer values (1-100) for a full day from 8 city sources
    Useful for representing demand levels, capacity, or other metrics
    """
    import random
    from datetime import datetime, timezone
    
    cities = [
        "Lisbon",
        "Porto",
        "Faro",
        "Coimbra",
        "Braga",
        "Bragança",
        "Leiria",
        "Guarda"
    ]
    
    try:
        now = datetime.now(timezone.utc)
        date_part = now.strftime("%Y-%m-%d")
        
        # Generate integer values for each city
        values_by_city = {}
        
        for city in cities:
            city_values = {}
            
            # Generate 1440 minutes (24 hours * 60 minutes)
            for hour in range(24):
                for minute in range(60):
                    time_key = f"{hour:02d}:{minute:02d}"
                    
                    # Generate random integer from 1 to 100
                    value = random.randint(1, 100)
                    
                    city_values[time_key] = str(value)
            
            values_by_city[city] = city_values
        
        # Format the response
        result = {
            "date": date_part,
            "interval": "per_minute",
            "sources": values_by_city,
            "note": "Per-minute integer values (1-100) from 8 Portuguese cities"
        }
        
        print(f"Successfully generated integer values for {len(cities)} cities")
        return result
        
    except Exception as e:
        print(f"Exception occurred while generating integer values: {str(e)}")
        return {"error": str(e)}

# OMIE API endpoint (Iberian Market - Spain & Portugal)
OMIE_API_URL = "https://www.omie.es/en/file-download"

def get_porto_weather():
    """
    Get hourly weather forecast for Porto, Portugal for the next 7 days
    Using Open-Meteo API (free, no API key required)
    """
    try:
        # Open-Meteo API endpoint
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": PORTO_LAT,
            "longitude": PORTO_LON,
            "hourly": "temperature_2m",
            "timezone": "Europe/Lisbon"
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print("Successfully fetched weather data for Porto, Portugal")
            
            # Get hourly data
            hourly_data = data.get("hourly", {})
            times = hourly_data.get("time", [])
            temperatures = hourly_data.get("temperature_2m", [])
            
            # Group by day with hours as keys
            forecast_by_day = {}
            for i in range(len(times)):
                datetime_str = times[i]
                temp = temperatures[i]
                
                # Split date and time
                date_part = datetime_str.split('T')[0]  # e.g., "2026-05-10"
                time_part = datetime_str.split('T')[1]  # e.g., "00:00"
                
                # Initialize day if not exists
                if date_part not in forecast_by_day:
                    forecast_by_day[date_part] = {}
                
                # Add hour and temperature as string
                forecast_by_day[date_part][time_part] = str(temp)
            
            # Format the response
            result = {
                "location": {
                    "city": "Porto",
                    "country": "Portugal",
                    "latitude": PORTO_LAT,
                    "longitude": PORTO_LON
                },
                "forecast": forecast_by_day,
                "units": {
                    "temperature": "°C"
                }
            }
            
            return result
        else:
            print(f"Error fetching weather data: {response.status_code}")
            return {"error": f"Failed to fetch weather data: {response.status_code}"}
            
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return {"error": str(e)}

def get_omie_prices():
    """
    Get electricity market prices from OMIE (Iberian Market Operator)
    Returns hourly prices for Portugal market
    """
    try:
        # OMIE provides day-ahead market prices
        # Using their public API for marginal prices
        # Note: OMIE provides data for current day and next day (day-ahead market)
        
        from datetime import timedelta
        
        # Get current date and next few days
        now = datetime.now(timezone.utc)
        
        # OMIE API for day-ahead marginal prices (Portugal zone)
        # Format: https://www.omie.es/en/file-download?parents%5B0%5D=marginal_pd&filename=marginal_pd_20260510.1
        
        prices_by_day = {}
        
        # Try to fetch data for today and next 2 days (OMIE typically has day-ahead data)
        for day_offset in range(3):
            target_date = now + timedelta(days=day_offset)
            date_str = target_date.strftime("%Y%m%d")
            date_part = target_date.strftime("%Y-%m-%d")
            
            # OMIE API endpoint for marginal prices
            url = f"https://www.omie.es/pt/file-download?parents%5B0%5D=marginalpdbc&filename=marginalpdbc_{date_str}.1"
            
            try:
                response = requests.get(url, timeout=10)
                
                if response.status_code == 200:
                    # OMIE returns CSV format with semicolon separator
                    lines = response.text.strip().split('\n')
                    
                    # Skip header lines (typically first 3 lines are headers)
                    data_lines = [line for line in lines if line and not line.startswith('Año') and not line.startswith('Year')]
                    
                    for line in data_lines[1:]:  # Skip first data line if it's header
                        if ';' not in line:
                            continue
                            
                        parts = line.split(';')
                        
                        if len(parts) >= 4:
                            # Format: Year;Month;Day;Hour;Price_PT;Price_ES;...
                            try:
                                hour = int(parts[3]) - 1  # OMIE uses 1-24, we need 0-23
                                
                                # Skip invalid hours (only 0-23 are valid)
                                if hour < 0 or hour > 23:
                                    continue
                                
                                # Price is typically in column 4 or 5 (Portugal price)
                                # Try to find the price column (usually EUR/MWh)
                                price_mwh = None
                                
                                for i in range(4, min(len(parts), 7)):
                                    try:
                                        price_val = parts[i].replace(',', '.').strip()
                                        if price_val and price_val != '':
                                            price_mwh = float(price_val)
                                            break
                                    except:
                                        continue
                                
                                if price_mwh is not None:
                                    # Convert EUR/MWh to EUR/kWh
                                    price_kwh = round(price_mwh / 1000, 4)
                                    
                                    time_part = f"{hour:02d}:00"
                                    
                                    if date_part not in prices_by_day:
                                        prices_by_day[date_part] = {}
                                    
                                    prices_by_day[date_part][time_part] = str(price_kwh)
                            except:
                                continue
                                
            except Exception as e:
                print(f"Could not fetch data for {date_part}: {str(e)}")
                continue
        
        if not prices_by_day:
            print("No OMIE data available, using fallback")
            return {"error": "No data available from OMIE"}
        
        print(f"Successfully fetched OMIE price data for {len(prices_by_day)} days")
        
        # Format the response
        result = {
            "source": "OMIE",
            "market": "Iberian Market (Portugal)",
            "prices": prices_by_day,
            "units": {
                "price": "EUR/kWh"
            },
            "note": "Day-ahead market prices from OMIE. Prices are market prices and may not include taxes and fees"
        }
        
        return result
        
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Fetch weather data
    print("Fetching weather data for Porto, Portugal...")
    weather_data = get_porto_weather()
    
    # Save weather data to frontend data folder
    weather_output_path = "../frontend/src/app/data/porto_weather.json"
    
    with open(weather_output_path, 'w', encoding='utf-8') as f:
        json.dump(weather_data, f, indent=2, ensure_ascii=False)
    
    print(f"Weather data saved to {weather_output_path}")
    
    # Fetch OMIE price data
    print("\nFetching OMIE price data...")
    price_data = get_omie_prices()
    
    # Save price data to frontend data folder
    price_output_path = "../frontend/src/app/data/maket_price.json"
    
    with open(price_output_path, 'w', encoding='utf-8') as f:
        json.dump(price_data, f, indent=2, ensure_ascii=False)
    
    print(f"OMIE price data saved to {price_output_path}")
    
    # Generate minute-by-minute prices by city
    print("\nGenerating minute-by-minute prices by city...")
    minute_prices = generate_minute_prices_by_city()
    
    # Save minute prices to frontend data folder
    minute_prices_path = "../frontend/src/app/data/city_price.json"
    
    with open(minute_prices_path, 'w', encoding='utf-8') as f:
        json.dump(minute_prices, f, indent=2, ensure_ascii=False)
    
    print(f"City minute prices saved to {minute_prices_path}")
    
    # Generate integer values by city
    print("\nGenerating integer values (1-100) by city...")
    integer_values = generate_integer_values_by_city()
    
    # Save integer values to frontend data folder
    integer_values_path = "../frontend/src/app/data/city_order.json"
    
    with open(integer_values_path, 'w', encoding='utf-8') as f:
        json.dump(integer_values, f, indent=2, ensure_ascii=False)
    
    print(f"City integer values saved to {integer_values_path}")
    print("\nAll data fetched and saved successfully!")