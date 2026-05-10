import os
import requests
import json

# Porto, Portugal coordinates
PORTO_LAT = 41.1579
PORTO_LON = -8.6291

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

if __name__ == "__main__":
    print("Fetching weather data for Porto, Portugal...")
    weather_data = get_porto_weather()
    
    # Save to frontend data folder
    output_path = "../frontend/src/app/data/weather.json"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(weather_data, f, indent=2, ensure_ascii=False)
    
    print(f"Weather data saved to {output_path}")
    print(json.dumps(weather_data, indent=2))