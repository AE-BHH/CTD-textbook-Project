import React from 'react'
import './App.css'
import List from './List'
import InputWithLabel from './InputWithLabel'

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
	},
]

//in order not to overwrite the value in the local storage, create a unique 'key' for the searched term
function useSemiPersistentState(key, initialState) {
	const [value, setValue] = React.useState(
		localStorage.getItem(key) || initialState
	)
	React.useEffect(() => {
		localStorage.setItem(key, value)
	}, [value, key])
	return [value, setValue]
}

const App = () => {
	// React Custom Hook
	const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')

	const handleSearch = (event) => {
		console.log(event.target.value)
		setSearchTerm(event.target.value)
	}

	const searchedStories = stories.filter((story) => {
		return story.title.includes(searchTerm.toLowerCase())
	})
	return (
		<div className='App'>
			<InputWithLabel
				id='search'
				label='Search'
				value={searchTerm}
				onInputChange={handleSearch}
			/>
			<List list={searchedStories} />
		</div>
	)
}
export default App
