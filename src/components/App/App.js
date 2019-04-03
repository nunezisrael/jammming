import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify'
import './App.css';

export class App extends React.Component{
  constructor(props){
    super(props)
    //setting the state to searchResults list of tracks
    this.state = {searchResults:[],
      playlistName: 'newPlaylist',
      playlistTracks:[]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    let currentPlaylist = this.state.playlistTracks;
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return alert('Track already in Playlist!');
    }
    else{
      currentPlaylist.push(track)
      this.setState({playlistTracks: currentPlaylist})
    }
  }
  removeTrack(track){
    let currentPlaylist = this.state.playlistTracks;
    console.log(track)

    let newPlaylist = currentPlaylist.filter(element => element.id !== track.id)
    console.log(newPlaylist)
    this.setState({playlistTracks: newPlaylist})
/*
    for(track in this.state.playlistTracks){
      if (track.id === this.state.playlistTracks.id) {
        let indexToRemove = this.state.playlistTracks.indexOf(track)//should resolve to index
        let newPlaylist = this.state.playlistTracks.splice(indexToRemove,1)
        this.setState({newPlaylist})
      }
    }*/
  }

  updatePlaylistName(name){
    this.setState({playlistName: name})
  }

  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map( function(track){return track.uri})

    Spotify.savePlaylist(this.state.playlistName,trackURIs)
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    })
  }

  search(term){
    console.log(`searching for ${term}`);
    Spotify.search(term).then(searchResults =>{
      this.setState({searchResults: searchResults})
    })
  }

  render(){
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }
}
