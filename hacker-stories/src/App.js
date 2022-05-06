import * as React from 'react';

const List = ( {list} ) => {

  console.log('List renders')
  return (
    <ul>
      {list.map(
          ({ objectID, ...all }) => (
            <Item key={objectID} {...all} />
          )
        )
      }
    </ul>
  );
}

const Search = ({ searchTerm, onSearch }) => {
  console.log('Search renders');

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" value={searchTerm} onChange={onSearch} />
      <p>
        Searching for <strong>{searchTerm}</strong>.
      </p>
    </div>
  );
}

const Item = ({
      title,
      url,
      author,
      num_comments,
      points,
      objectID
    }) => (
  <li key={objectID}>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
);

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};

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

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

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
      <Search onSearch={handleSearch} searchTerm={searchTerm} />

      <hr />

      <List list={searchedStories} />

    </div>
  );
}

export default App;
