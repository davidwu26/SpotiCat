const SpotifyAPI = (function() {

    const clientId = "ADD CLIENT ID"
    const clientSec = "ADD CLIENT SECRET";

     // private methods
     const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSec)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const __getRecommendations = async(token, affection_level, social_needs, energy_level) => 
    {
        const limit = 10;
        const args = calcParams(affection_level, social_needs, energy_level);
        console.log(args);
        let url = 'https://api.spotify.com/v1/recommendations?limit=100&market=US&seed_genres=chill' +
                    '&min_danceability=' + args[0] + '&max_danceability=' + args[1] +
                    '&min_energy='+ args[2] + '&max_energy=' + args[3] +
                    '&min_valence=' + args[4] + '&max_valence=' + args[5];
        const result = await fetch(url, {
            method: 'GET',
            headers: {'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.tracks;
    }

    const _getTrack = async (token, id) => {

        const result = await fetch(`https://api.spotify.com/v1/tracks/` + id, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    function calcParams(affection_level, social_needs, energy_level)
    {
        let ld = "";
        let rd = "";
        let le = "";
        let re = "";
        let lv = "";
        let rv = "";
        if (social_needs < 3) 
        {
            ld = "0.0"
            rd = "0.4"
        }
        else if (social_needs < 5) 
        {
            ld = "0.4"
            rd = "0.6"
        }
        else
        {
            ld = "0.6"
            rd = "1.0"
        }

        if (energy_level < 3)
        {
            le = "0.0"
            re = "0.4"
        }
        else if (energy_level < 5)
        {
            le = "0.4"
            re = "0.7"
        }
        else
        {
            le = "0.7"
            re = "1.0"
        }
        
        if (affection_level == 1)
        {
            lv = "0.0"
            rv = "0.2"
        }
        else if (affection_level == 2)
        {
            lv = "0.2"
            rv = "0.4"
        }
        else if (affection_level == 3)
        {
            lv = "0.4"
            rv = "0.5"
        }
        else if (affection_level == 4)
        {
            lv = "0.5"
            rv = "0.6"
        }
        else
        {
            lv = "0.6"
            rv = "1.0"
        }
        return [ld, rd, le, re, lv, rv];
    }

   return {
        getToken() {
            return _getToken();
        },
        getRecommendations(token, affection_level, social_needs, energy_level)
        {
            return __getRecommendations(token, affection_level, social_needs, energy_level);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
}
})();

const adjustUI = (function() {

    // html elements
    const DOMElements = {
        song : '.song_section',
        artist : '.artist_section',
        hfToken: '#hidden_token'
    }

    // public methods
    return {

        setArtist(artist)
        {
            const div = document.querySelector(DOMElements.artist);
            // Clear section
            div.innerHTML = '';
            const html = "<h4 class='artist' autocomplete='off'>" + artist + "</h4>";
            div.insertAdjacentHTML('beforeend', html);
        },

        setSong(title, trackLink, id)
        {
            const div = document.querySelector(DOMElements.song);
            const embedLink = "https://open.spotify.com/embed/track/";
            // Clear section
            div.innerHTML = '';
            const html = "<h4 class='song'>" +
                        "<a class='track_link' href='" + trackLink +
                        "' target='_blank'>" + title + 
                        "</a></h4>" + "<iframe src='" + embedLink + id +
                        "' width='300' height='380' frameborder='0'" +
                        "allowtransparency='true' allow='encrypted-media'></iframe>";
            div.insertAdjacentHTML('beforeend', html);
        },

        resetArtist() 
        {
            const div = document.querySelector(DOMElements.artist);
            div.innerHTML = '';
        },

        resetSong()
        {
            const div = document.querySelector(DOMElements.song);
            div.innerHTML = '';
        },

        storeToken(value) 
        {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken()
        {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        },

        getStoredAffection()
        {
            return {
                affection: document.querySelector('#hidden_affection_level').value
            }
        },

        getStoredSocial()
        {
            return {
                social: document.querySelector('#hidden_social_needs').value
            }
        },

        getStoredEnergy()
        {
            return {
                energy: document.querySelector('#hidden_energy_level').value
            }
        }
    }
})();

const APPController = (function(SpotifyAPI, adjustUI) {

    const load = async () => {
        // get the token
        const token = await SpotifyAPI.getToken();
        //Store the token 
        adjustUI.storeToken(token);
    }

    const breed_select = document.querySelector('#breed_select');
    // breed selector event listener

    breed_select.addEventListener('change', async () => {
        if (breed_select.value == "1")
        {
            // reset
            console.log("Resetting artist and song");
            adjustUI.resetArtist();
            adjustUI.resetSong();
            // get token
            const token = adjustUI.getStoredToken().token;
            // get hidden attributes
            const affection = adjustUI.getStoredAffection.affection;
            const social = adjustUI.getStoredSocial.social;
            const energy = adjustUI.getStoredEnergy.energy;
            const tracks = await SpotifyAPI.getRecommendations(token, affection, social, energy);
            const random_index = Math.floor(Math.random() * tracks.length);
            const track = tracks[random_index];
            // Log to console
            console.log("List of Tracks" + tracks);
            console.log("Randomly Chosen Song Number" + random_index);
            console.log("Chosen Track" +track);
            adjustUI.setArtist(track.artists[0].name);
            adjustUI.setSong(track.name, track.external_urls.spotify, track.id);
        }
        else
        { 
            // reset
            console.log("Resetting artist and song");
            adjustUI.resetArtist();
            adjustUI.resetSong();
        }
    })

    return {
        init () {
            console.log('Spotify token loading');
            load();
        }
    }
})(SpotifyAPI, adjustUI);

APPController.init();


