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

    };
    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBoardChange(event) {
    this.setState({ boardName: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.boardSelect(this.state.boardName);
    // searchFormBoard = this.state.boardName;
  }
  
  render() {
    return (
    <form onSubmit={this.handleSubmit}>
    <input
    type="text"
    name="board to lookup"
    placeholder="search for a reddit board"
    value={this.state.boardName}
    onChange={this.handleBoardChange}
    />
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
    return (
      <ul>
        {this.props.redditResponse.map((item, index) => {
          return (
            <li key={index}>
            <a href={`"${item.data.url}"`}><h1>{item.data.title}</h1>
            <p>{item.data.ups.length}</p>
            </a>
            </li>
          );
        })}
        {/* {result} */}
        
      </ul>
    );
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
      redditResponseError: false,
    };
    this.boardSelect = this.boardSelect.bind(this);
    // this.handleSearchResults = this.handleSearchResults.bind(this);
  }
  // componentDidUpdate() {
  //   console.log('__UPDATE STATE__', this.state);
  // }
  // componentDidMount() {
  //   if (localStorage.boardLookup) {
  //     try {
  //       const boardLookup = JSON.parse(localStorage.boardLookup);
  //       return this.setState.boardLookup.push(boardLookup);// this is detructuring
  //       // can also not return this... and just return undefined, no matter
  //     } catch (err) {
  //       return console.error(err); // console.error will show up as red in your console
  //     }
  //   } else {
  //     return superagent.get(apiUrl)
  //       .then((response) => {
  //         console.log(response);
  //         const boardLookup = response.body.results.reduce((dict, result) => {
  //           dict[result.name] = result.url;
  //           return dict;
  //         }, {});
  //         try {
  //           localStorage.boardLookup = JSON.stringify(boardLookup);
  //           this.setState({ boardLookup });
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       })
  //       .catch(console.error);
  //   }
  // }

  boardSelect(name) {
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
          redditResponseError: true,
        });
      });
  }

  // handleSearchResults(result) {
  //   return (
  //     <p>
  //       { result }
  //     </p>
  //   );
  // }
  render() {
    return (
      <section>
        <h1>Reddit!</h1>
       <SearchForm
       boardSelect={this.boardSelect}/>
       { this.state.redditResponse ? 
         <SearchResultList
       redditResponse={this.state.redditResponse}/> :
       <div><p>nope</p></div>
      }
       
      </section>
    );
  }
}
const container = document.createElement('div');
document.body.appendChild(container);
reactDomRender(<App/>, container);

