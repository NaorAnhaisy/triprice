export const flightMock = {
    "meta": {
      "count": 2
    },
    "data": [
      {
        "type": "flight-offer",
        "id": "1",
        "source": "GDS",
        "instantTicketingRequired": false,
        "nonHomogeneous": false,
        "oneWay": false,
        "lastTicketingDate": "2023-11-01",
        "numberOfBookableSeats": 9,
        "itineraries": [
          {
            "duration": "PT9H10M",
            "segments": [
              {
                "departure": {
                  "iataCode": "EWR",
                  "at": "2023-11-01T21:50:00"
                },
                "arrival": {
                  "iataCode": "LHR",
                  "at": "2023-11-02T08:45:00"
                },
                "carrierCode": "6X",
                "number": "188",
                "aircraft": {
                  "code": "777"
                },
                "operating": {
                  "carrierCode": "6X"
                },
                "duration": "PT5H55M",
                "id": "3",
                "numberOfStops": 0,
                "blacklistedInEU": false
              },
              {
                "departure": {
                  "iataCode": "LHR",
                  "at": "2023-11-02T10:30:00"
                },
                "arrival": {
                  "iataCode": "MAD",
                  "at": "2023-11-02T13:00:00"
                },
                "carrierCode": "6X",
                "number": "9931",
                "aircraft": {
                  "code": "320"
                },
                "operating": {
                  "carrierCode": "6X"
                },
                "duration": "PT1H30M",
                "id": "4",
                "numberOfStops": 0,
                "blacklistedInEU": false
              }
            ]
          }
        ],
        "price": {
          "currency": "USD",
          "total": "342.20",
          "base": "294.00",
          "fees": [
            {
              "amount": "0.00",
              "type": "SUPPLIER"
            },
            {
              "amount": "0.00",
              "type": "TICKETING"
            }
          ],
          "grandTotal": "342.20"
        },
        "pricingOptions": {
          "fareType": [
            "PUBLISHED"
          ],
          "includedCheckedBagsOnly": true
        },
        "validatingAirlineCodes": [
          "6X"
        ],
        "travelerPricings": [
          {
            "travelerId": "1",
            "fareOption": "STANDARD",
            "travelerType": "ADULT",
            "price": {
              "currency": "USD",
              "total": "342.20",
              "base": "294.00"
            },
            "fareDetailsBySegment": [
              {
                "segmentId": "3",
                "cabin": "BUSINESS",
                "fareBasis": "J6XQSMIX",
                "class": "J",
                "includedCheckedBags": {
                  "quantity": 8
                }
              },
              {
                "segmentId": "4",
                "cabin": "BUSINESS",
                "fareBasis": "J6XQSMIX",
                "class": "J",
                "includedCheckedBags": {
                  "quantity": 8
                }
              }
            ]
          }
        ]
      },
      {
        "type": "flight-offer",
        "id": "2",
        "source": "GDS",
        "instantTicketingRequired": false,
        "nonHomogeneous": false,
        "oneWay": false,
        "lastTicketingDate": "2023-11-01",
        "numberOfBookableSeats": 9,
        "itineraries": [
          {
            "duration": "PT11H",
            "segments": [
              {
                "departure": {
                  "iataCode": "JFK",
                  "at": "2023-11-01T20:00:00"
                },
                "arrival": {
                  "iataCode": "LHR",
                  "at": "2023-11-02T08:05:00"
                },
                "carrierCode": "6X",
                "number": "172",
                "aircraft": {
                  "code": "744"
                },
                "operating": {
                  "carrierCode": "6X"
                },
                "duration": "PT7H5M",
                "id": "1",
                "numberOfStops": 0,
                "blacklistedInEU": false
              },
              {
                "departure": {
                  "iataCode": "LHR",
                  "at": "2023-11-02T10:30:00"
                },
                "arrival": {
                  "iataCode": "MAD",
                  "at": "2023-11-02T13:00:00"
                },
                "carrierCode": "6X",
                "number": "9931",
                "aircraft": {
                  "code": "320"
                },
                "operating": {
                  "carrierCode": "6X"
                },
                "duration": "PT1H30M",
                "id": "2",
                "numberOfStops": 0,
                "blacklistedInEU": false
              }
            ]
          }
        ],
        "price": {
          "currency": "USD",
          "total": "342.20",
          "base": "294.00",
          "fees": [
            {
              "amount": "0.00",
              "type": "SUPPLIER"
            },
            {
              "amount": "0.00",
              "type": "TICKETING"
            }
          ],
          "grandTotal": "342.20"
        },
        "pricingOptions": {
          "fareType": [
            "PUBLISHED"
          ],
          "includedCheckedBagsOnly": true
        },
        "validatingAirlineCodes": [
          "6X"
        ],
        "travelerPricings": [
          {
            "travelerId": "1",
            "fareOption": "STANDARD",
            "travelerType": "ADULT",
            "price": {
              "currency": "USD",
              "total": "342.20",
              "base": "294.00"
            },
            "fareDetailsBySegment": [
              {
                "segmentId": "1",
                "cabin": "BUSINESS",
                "fareBasis": "J6XQSMIX",
                "class": "J",
                "includedCheckedBags": {
                  "quantity": 8
                }
              },
              {
                "segmentId": "2",
                "cabin": "BUSINESS",
                "fareBasis": "J6XQSMIX",
                "class": "J",
                "includedCheckedBags": {
                  "quantity": 8
                }
              }
            ]
          }
        ]
      }
    ],
    "dictionaries": {
      "locations": {
        "EWR": {
          "cityCode": "NYC",
          "countryCode": "US"
        },
        "MAD": {
          "cityCode": "MAD",
          "countryCode": "ES"
        },
        "LHR": {
          "cityCode": "LON",
          "countryCode": "GB"
        },
        "JFK": {
          "cityCode": "NYC",
          "countryCode": "US"
        }
      },
      "aircraft": {
        "320": "AIRBUS A320",
        "744": "BOEING 747-400",
        "777": "BOEING 777-200/300"
      },
      "currencies": {
        "USD": "US DOLLAR"
      },
      "carriers": {
        "6X": "AMADEUS SIX"
      }
    }
  }