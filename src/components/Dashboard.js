import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';
import '../styles.css';

const CLIENT_ID = '27f5c55fa8514af8a0f11eba2361c867';
const CLIENT_SECRET = 'c4bc98c0d79649f3bdf0c3f2f07c292b';
const spotifyUrl = 'https://api.spotify.com';

function Dashboard() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [artists, setArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);

    const spotifyApi = new SpotifyWebApi();

    //handling loggin in and out and fetching all of the data when the page loads using use effect
    useEffect(() => {
        // Check if the user is already logged in
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');

        if (accessToken) {
            spotifyApi.setAccessToken(accessToken);
            console.log('Access token set:', accessToken);
            setLoggedIn(true);
            fetchPlaylists();
            fetchArtists();
            fetchTopTracks();
        }
    }, []);

    const handleLogin = () => {
        // Redirect user to Spotify login page
        const clientId = '27f5c55fa8514af8a0f11eba2361c867';
        const redirectUri = 'http://localhost:3000/callback'; // Update with your redirect URI
        const scopes = ['user-read-private', 'playlist-read-private', 'user-top-read']; // Add more scopes as needed
        const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private%20playlist-read-private%20user-top-read&response_type=token`;
        window.location = authorizationUrl;
    };

    const handleLogout = () => {
        setLoggedIn(false);
    }

    //fetching the users playlists
    const fetchPlaylists = async () => {
        try {
            const response = await spotifyApi.getUserPlaylists();
            setPlaylists(response.items);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    //fetching favorite artists, etc
    const fetchArtists = async () => {
        try {
            const response = await spotifyApi.getMyTopArtists();
            const artists = response.items.map(artist => ({
                id: artist.id,
                name: artist.name,
                images: artist.images,
                genres: artist.genres // This will give you the genres for each artist
            }));
            console.log(artists)
            setArtists(artists);
        }
        catch (error) {
            console.error('Error fetching artists: ', error);
        }
    }

    const fetchTopTracks = async () => {
        try {
            const response = await spotifyApi.getMyTopTracks({ limit: 10 });
            const tracks = response.items.map(track => ({
                id: track.id,
                name: track.name,
                album: {
                    name: track.album.name,
                    image: track.album.images[0].url // This will give you the URL of the album image
                },
                artist: track.artists[0].name
            }));
            setTopTracks(tracks);
        }
        catch (error) {
            console.error('Error fetching top tracks: ', error);
        }
    }


    return (
        <div className="App">
            <h1>Find Your Music Taste</h1>
            {!loggedIn ? (
                <>
                    <button className='login-button' onClick={handleLogin}>Login with Spotify <img className='login-button-image' src='https://clipground.com/images/spotify-logo-png-white-2.png' /></button>
                </>
            ) : (
                <>
                    <div className='playlists-section'>
                        <h2>Your Playlists</h2>
                        <ul>
                            {playlists.map((playlist) => (
                                <li key={playlist.id}>
                                    {playlist.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='favorites-section'>
                        <h2>Your Top Artists:</h2>
                        <ul>
                            {artists.map((artist, index) => (
                                <div key={index}>
                                    <h2>{artist.name}</h2>
                                    <p>Genres: {artist.genres.join(', ')}</p>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className='favorites-section'>
                        <h2>Your Top Tracks:</h2>
                        <ul>
                            {topTracks.map((track, index) => (
                                <div key={index}>
                                    <h2>{track.name}</h2>
                                    <p>Album: {track.album.name}</p>
                                    <p>Artist: {track.artist}</p>
                                    {track.album.image && (
                                        <img className='album-image' src={track.album.image} alt={track.album.name} />
                                    )}
                                </div>
                            ))}
                        </ul>
                    </div>
                    <button className='logout-button' onClick={handleLogout}>Sign Out</button>
                </>
            )}
        </div>
    );
}

export default Dashboard
