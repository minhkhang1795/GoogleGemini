import logging
import googlemaps

from snapeat.apis.Place import Place


class GooglePlaceApi:
    def __init__(self, api_key=None):
        if api_key is None:
            logging.error('GOOGLE_PLACE_API_KEY is None')
            return

        # Create a Google Maps client object.
        self.maps = googlemaps.Client(key=api_key)

    def get_nearby_restaurant(self, location: str):
        """
        Get nearby restaurant within 1km based on location. Skip restaurants that do not
        have any photos.
        @param location: the location to search.
        @return: a list of nearby restaurants. Empty list if no restaurant found or API fails.
        """
        result = []
        try:
            # Geocoding an address
            geocode_result = self.maps.geocode(location)

            # Make a request to the Places API to search for places near a given location.
            if geocode_result and len(geocode_result) > 0:
                nearby_places = self.maps.places_nearby(location=geocode_result[0]['geometry']['location'], radius=1000,
                                                        type=["restaurant", "bar"])

                for place in nearby_places['results']:
                    place_id = place.get('place_id')
                    place_name = place.get('name')
                    location = place.get('geometry', {}).get('location')
                    if location:
                        lat = location.get('lat')
                        lng = location.get('lng')
                    else:
                        lat = None
                        lng = None
                    vicinity = place.get('vicinity')
                    price_level = place.get('price_level')
                    rating = place.get('rating')

                    photo_url = None
                    if 'photos' in place and len(place['photos']) > 0:
                        photo_reference = place['photos'][0]['photo_reference']
                        # photo_url = self.maps.places_photo(photo_reference=photo_reference, max_height=200)
                        # print("Photo URL:", photo_url)
                    else:
                        logging.warning(f'No photo available for {place_name}. Skipping...')
                        continue

                    result.append(Place(place_id, place_name, lat, lng, vicinity, price_level, rating, photo_url))
        except Exception as e:
            logging.error(f'{type(e).__name__}: {e}')

        logging.info(result)
        return result
