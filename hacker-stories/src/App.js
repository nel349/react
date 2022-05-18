import * as React from 'react';

const List = ({ list, onRemoveItem }) => {

  console.log('List renders')
  return (
    <ul>
      {list.map(
        (item) => (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
        )
      )
      }
    </ul>
  );
}

const InputWithLabel = ({
  id,
  label,
  value,
  type = 'text', onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // D
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
    <label htmlFor={id}>{children}</label>
    <label htmlFor={id}>{label}</label>
    &nbsp;
    <input
      id={id}
      type={type}
      ref={inputRef}
      value={value}
      onChange={onInputChange}
    />
    </>
  );
}


const Item = ({
  item,
  onRemoveItem
}) => {

  const onRemoveHandler = () => {
      onRemoveItem(item);
  }

  return (
    <>
      <li key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span><button onClick={onRemoveHandler}>Dismiss</button></span>
      </li>
      
    </>
  );
}

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

  const initialStories = [
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
  
  const getAsyncStories = () =>
    new Promise((resolve) =>
      setTimeout(
        () => resolve({ data: { stories: initialStories } }),
        2000)
    );

  const storiesReducer = (state, action) => {
    switch (action.type) {
case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
};
      default:
        throw new Error();
    }
  };
    
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );
  

  React.useEffect(() => {
    getAsyncStories().then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.stories,
      });
    })
    .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }));
  });

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  console.log('App renders')

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
      || story.author.toLowerCase().includes(searchTerm.toLowerCase())
  }
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        onInputChange={handleSearch}
      > 
      <strong>Search:</strong> </InputWithLabel>

      <hr />

      {stories.data.isError && <p>Something went wrong ...</p>}

      {stories.data.isLoading ? (<p> Loading ... </p>) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

export default App;
