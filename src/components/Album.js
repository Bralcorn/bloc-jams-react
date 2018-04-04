import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './Album.css';


class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: undefined,
      currentTime: 0,
      currentVolume: 0.8,
      duration: NaN,
      isPlaying: false,
      isHovering: NaN
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = undefined;
    this.audioElement.volume = this.state.currentVolume;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumeupdate: e => {
        this.setState({ currentVolume: this.audioElement.volume })
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumeupdate', this.eventListeners.volumeupdate);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumeupdate', this.eventListeners.volumeupdate);
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() { 
    this.audioElement.pause();
    this.setState({ isPlaying: false })
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if(song === undefined) {
      this.pause();
    }
    else if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song); 
      }
      this.play();
    }
  }

  handleHover(index) {
    if(index === this.state.isHovering) {
      this.setState({isHovering: NaN})
    }
    else {
      this.setState({isHovering: index})
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(currentIndex + 1, this.state.album.songs.length - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }
  
  handleTimeChange(e) {
    if(this.audioElement.duration != this.audioElement.duration) {
      this.setState({currentTime: 0})
    }
    else {
      const newTime = this.audioElement.duration * e.target.value;
      this.audioElement.currentTime = newTime;
      this.setState({ currentTime: newTime });
    }
  }

  handleVolumeChange(e) {
    const newVol = e.target.value;
    this.audioElement.volume = newVol;
    this.setState({ volume: newVol })
  }

  formatTime(time) {
    if ((time >= 0) && Number.isInteger) {
      const min = Math.floor(time/60);
      const sec = Math.floor(time%60);
      if (sec < 10) {
        return `${min}:0${sec}`;
      } else if (sec === 60) {
        return `${min}:00`;
      } else {
        return `${min}:${sec}`;
      }
    } else {
      return "-:--"
    }
  }

  whatDo(index) {

    if(this.state.currentSong === this.state.album.songs[index]) {
      if(this.state.isPlaying === true) {
        return <span className="ion-pause"></span>
      }
      else {
        return <span className="ion-play"></span>
      }
    }
    else if(this.state.isHovering === index) {
      return <span className="ion-play"></span>
    }
    else {
      return <span className="song-number">{index + 1}</span>
    }
  }


  render() {


    return (
      <section className="album">
        <section id="album-info">
        <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list" align="center">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>  
          <tbody>
            {
              this.state.album.songs.map( (song, index) =>
                <tr className = "song" 
                  key={index} 
                  onMouseEnter={() => this.handleHover(index)} 
                  onMouseLeave={() => this.handleHover(index)}
                  onClick={() => this.handleSongClick(song)} 
                >
                  <td className="song-actions">
                    <button>
                      {this.whatDo(index)}
                    </button>
                  </td>
                  <td className="song-title">{song.title}</td>
                  <td className="song-duration">{this.formatTime(song.duration)}</td>
                </tr>
              )  
            }
          </tbody>
        </table>
        <PlayerBar 
          isPlaying={this.state.isPlaying} 
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          currentTimeFormat={this.formatTime(this.audioElement.currentTime)}
          currentVolume={this.audioElement.volume}
          duration={this.audioElement.duration}
          durationFormat={this.formatTime(this.audioElement.duration)}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
        />
      </section>
    )
  }
}


export default Album;


