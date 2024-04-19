import json


class Place:
    def __init__(self, place_id, name, lat, lng, address, price_level, rating, photo_url):
        self.google_place_id = place_id
        self.name = name
        self.lat = lat
        self.lng = lng
        self.address = address
        self.price_level = price_level
        self.rating = rating

        self.photo_urls = []
        if photo_url is not None:
            self.photo_urls.append(photo_url)

    def __str__(self):
        return json.dumps(vars(self))

    def to_dict(self):
        return {
            "google_place_id": self.google_place_id,
            "name": self.name,
            "lat": self.lat,
            "lng": self.lng,
            "address": self.address,
            "price_level": self.price_level,
            "rating": self.rating,
            "photo_urls": [url for url in self.photo_urls]
        }