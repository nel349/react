import * as React from 'react';

const List = (props) => {

  console.log('List renders')
  return (
    <ul>
    {
      props.list.map(item => (<Item key={item.objectID} item={item}/>))
    }
    </ul>
  );
}

const Search = (props) => {
  console.log('Search renders');

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={props.onSearch}/>
      <p>
        Searching for <strong>{props.text}</strong>.
      </p>
    </div>);
}

const Item = (props) => (
    <li key={props.item.objectID}>
      <span>
        <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>{props.item.author}</span>
      <span>{props.item.num_comments}</span>
      <span>{props.item.points}</span>
    </li>
  );

const App = () => {

  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    }
  ];

  const [searchTerm, setSearchTerm] = React.useState('');   

  console.log('App renders')

  const handleSearch = (event) => {
      setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) => {
      return story.title.toLowerCase().includes(searchTerm.toLowerCase()) 
      || story.author.toLowerCase().includes(searchTerm.toLowerCase())
    }
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={handleSearch} text = {searchTerm}/>

      <hr />

      <List list={searchedStories}/>
      
    </div>
  );
}

export default App;
