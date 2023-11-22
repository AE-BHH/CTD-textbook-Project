import React, { useEffect, useReducer, useState } from 'react'
import './App.css'
import List from './List'
import InputWithLabel from './InputWithLabel'

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
	},
]

//in order not to overwrite the value in the local storage, create a unique 'key' for the searched term
function useSemiPersistentState(key, initialState) {
	const [value, setValue] = useState(
		localStorage.getItem(key) || initialState
	)
	useEffect(() => {
		localStorage.setItem(key, value)
	}, [value, key])
	return [value, setValue]
}

function storiesReducer(state, action) {
	switch (action.type) {
		case 'STORIES_FETCH_INIT':
			return {
				...state,
				isLoading: true,
				isError: false,
			}
		case 'STORIES_FETCH_SUCCESS':
			return {
				...state,
				isLoading: false,
				isError: false,
				data: action.payload,
			}
		case 'STORIES_FETCH_FAILURE':
			return {
				...state,
				isLoading: false,
				isError: true,
			}
		case 'REMOVE_STORY':
			return {
				...state,
				data: state.data.filter(
					(story) => action.payload.objectID !== story.objectID
				),
			}

		default:
		// throw new Error()
	}
}

const App = () => {
	const getAsyncStories = () =>
		new Promise((resolve) =>
			setTimeout(() => resolve({ data: { stories: initialStories } }))
		)

	const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')

	//useReducer: The new hook receives a reducer function and an initial state as arguments and returns an array with two items. The first item is the current state; the second item is the state updater function (also called dispatch function).
	const [stories, dispatchStories] = useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: false,
	})

	useEffect(() => {
		dispatchStories({ type: 'STORIES_FETCH_INIT' })

		getAsyncStories()
			.then((result) => {
				dispatchStories({
					type: 'STORIES_FETCH_SUCCESS',
					payload: result.data.stories,
				})
			})
			.catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }))
	}, [])

	const handleRemoveStory = (item) => {
		stories.data.filter((story) => item.objectID !== story.objectID)

		dispatchStories({
			type: 'REMOVE_STORY',
			payload: item,
		})
	}

	const handleSearch = (event) => {
		setSearchTerm(event.target.value)
	}

	const searchedStories = stories.data.filter((story) => {
		return story.title.toLowerCase().includes(searchTerm.toLowerCase())
	})
	return (
		<div className='App'>
			<InputWithLabel       
				id='search'
				value={searchTerm}
				isFocused
				onInputChange={handleSearch}>
				<strong>Search:</strong>
			</InputWithLabel>
			{stories.isError && <p>Something went wrong...</p>}
			{stories.isLoading ? (
				<p>Loading...</p>
			) : (
				<List list={searchedStories} onRemoveItem={handleRemoveStory} />
			)}
		</div>
	)
}
export default App
