
# !pip install googlemaps
import googlemaps

# Replace "YOUR_API_KEY" with your actual API key.
place_api_key = userdata.get('GOOGLE_PLACE_API')

# Create a Google Maps client object.
maps = googlemaps.Client(key=place_api_key)

# Geocoding an address
geocode_result = maps.geocode('07310, Jersey City, NJ')

# Make a request to the Places API to search for places near a given location.
places_result = maps.places_nearby(location=geocode_result[0]['geometry']['location'], radius=500, type="restaurant")

# Print the results.
print(places_result)

for place in places_result['results']:
    print(place['name'], ": ", place['vicinity'])
    print(place.get("types", []))