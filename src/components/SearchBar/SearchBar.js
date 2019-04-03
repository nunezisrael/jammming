import React from 'react';
import './SearchBar.css'

export class SearchBar extends React.Component{
  constructor(props){
    super(props)
    this.state = {term: ''}
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  handleTermChange(e){
    const searchTerm = e.target.value
    this.setState({term: searchTerm})
  }

  handleSearch(e){
    this.props.onSearch(this.state.term)
  }

  render(){
    return(
      <div className="SearchBar">
        <input placeholder="Enter a Song, Album, or Artist" onChange ={this.handleTermChange} />
        <a onClick={this.handleSearch} >SEARCH</a>
      </div>
    )
  }
}
