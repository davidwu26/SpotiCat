import requests
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from console_ids import cid, sec

"""
This script checks if there is a song for every possible configuration for a cat
"""


client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=sec)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

songs = []
def get_tracks(affection_level, social_needs, energy_level):
    if (social_needs < 3):
        ld = 0.0
        rd = 0.4
    elif (social_needs < 5):
        ld = 0.4
        rd = 0.6
    else:
        ld = 0.6
        rd = 1.0

    if (energy_level < 3):
        le = 0.0
        re = 0.4
    elif (energy_level < 5):
        le = 0.4
        re = 0.7
    else:
        le = 0.7
        re = 1.0
    
    if (affection_level == 1):
        lv = 0.0
        rv = 0.2
    elif (affection_level == 2):
        lv = 0.2
        rv = 0.4
    elif (affection_level == 3):
        lv = 0.4
        rv = 0.5
    elif (affection_level == 4):
        lv = 0.5
        rv = 0.6
    else:
        lv = 0.6
        rv = 1.0
    genres = ['chill']
    track_results = sp.recommendations(seed_artists=None, seed_genres=genres, seed_tracks=None, limit=10, country="US", 
                                min_danceability=ld, max_danceability=rd,
                                min_energy=le, max_energy=re, 
                                min_valence=lv, max_valence=rv)
    tuple=(ld, rd, le, re, lv, rv, track_results['seeds'][0]['afterFilteringSize'], track_results['seeds'][0]['afterRelinkingSize'])
    songs.append(tuple)

for i in range(1, 6):
    for j in range(1, 6):
        for k in range(1, 6):
            get_tracks(i, j, k)

with open('songs_chill.txt', 'w+') as f:
    for item in songs:
        f.write("ld: %f, rd: %f, le: %f, re: %f, lv: %f, rv: %f, afs: %d, ars: %d\n" 
                % (item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]))

