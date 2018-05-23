'use strict';

import React from 'react';
import { render as reactDomRender } from 'react-dom';// destructuring importing just this one property and assigning it to reactDom...
import superagent from 'superagent';
import '../style/main.scss';

const apiUrl = `http://www.reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`;

const searchFormBoard = '';
const searchFormLimit = 10;

/* SearchForm Component
should contain a text input for the user to supply a reddit board to look up
should contain a number input for the user to limit the number of results to return
the number must be more than 0 and less than 100
onSubmit the form should make a request to reddit
it should make a get request to http://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}
on success it should pass the results to the application state
on failure it should add a class to the form called error and turn the form's inputs borders red
*/
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardName: '',
      number: 0,

    };
    this.handleBoardChange = this.handleBoardChange.bind(this);
    // this.handleNumberChange = this.handleNumberChange(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBoardChange(event) {
    this.setState({ boardName: event.target.value });
  }
  // handleNumberChange(event) {
  //   this.setState({ number: event.target.value });
  // }
  handleSubmit(event) {
    event.preventDefault();
    this.props.boardSelect(this.state.boardName, this.state.number);
    // searchFormBoard = this.state.boardName;
  }
  
  render() {
    if (this.props.classProperty) {
      return (
        <form>
        <input className="error"
        type="text"
        name="board to lookup"
        placeholder="search for a reddit board"
        value={this.state.boardName}
        onChange={this.handleBoardChange}
        />
        {/* <input
        type="number"
        name="number of results"
        placeholder="1-100"
        value={this.state.number}
        onChange={this.handleNumberChange}
        /> */}
        <button onClick={this.handleSubmit}>Click me</button>
          </form>
      );
    }
    return (
    <form>
    <input
    type="text"
    name="board to lookup"
    placeholder="search for a reddit board"
    value={this.state.boardName}
    onChange={this.handleBoardChange}
    />
    {/* <input
    type="number"
    name="number of results"
    placeholder="1-100"
    value={this.state.number}
    onChange={this.handleNumberChange}
    /> */}
    <button onClick={this.handleSubmit}>Click me</button>
      </form>
  
  
    );
  }
}
// /*
// SearchResultList Component
// Should inherit all search results through props
// This component does not need to have its own state
// If there are topics in the application state it should display an unordered list
// Each list item in the unordered list should contain the following
// an anchor tag with a href to the topic.url
// inside the anchor a heading tag with the topic.title
// inside the anchor a p tag with the number of topic.ups */

class SearchResultList extends React.Component {
  render() {

    console.log('WHAT THIS?', this.props.redditResponse);

    if (this.props.redditResponse) {
      return (
        <ul>
          {this.props.redditResponse.map((item, index) => {
            return (
              <li key={index}>
              <a href={item.data.url}><h1>{item.data.title}</h1>
              <p>{item.data.ups}</p>
              </a>
              </li>
            );
          })}  
        </ul>
      );
    } (this.props)
  
  }
}

/* should contain all of the application state
should contain methods for modifying the application state
the state should have a topics array for holding the results of the search */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: '',
      redditResponse: null,
      redditResponseError: null,
    };
    this.boardSelect = this.boardSelect.bind(this);
    // this.handleSearchResults = this.handleSearchResults.bind(this);
  }

  boardSelect(name, number) {
    this.setState({
      board: name,
    });
    return superagent.get(`https://www.reddit.com/r/${name}.json?limit=10`)
      .then((res) => {
        this.setState({
          redditResponse: res.body.data.children,
          redditResponseError: null,
        });
      })
      .catch((err) => {
        this.setState({
          redditResponse: null,
          redditResponseError: name,
        });
      });
  }

  render() {
    return (
      <section>
        <h1>Reddit!</h1>
        {this.state.redditResponseError ? 
        <SearchForm classProperty="error" boardSelect={this.boardSelect}/> :
       <SearchForm
       boardSelect={this.boardSelect}/>
        }
       { this.state.redditResponse ? 
      <SearchResultList
       redditResponse={this.state.redditResponse}/> :
     <div></div>
      }
      </section>
    );
  }
}
const container = document.createElement('div');
document.body.appendChild(container);
reactDomRender(<App/>, container);

