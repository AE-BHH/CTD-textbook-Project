import React, { useCallback, useEffect, useReducer, useState } from 'react'
import axios from 'axios'
import './App.css'
import List from './List'
import SearchForm from './SearchForm'
import Example from './Example'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

//in order not to overwrite the value in the local storage, create a unique 'key' for the searched term
function useSemiPersistentState(key, initialState) {
	const [value, setValue] = useState(localStorage.getItem(key) || initialState)
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
	const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
	const [url, setUrl] = useState(`{API_ENDPOINT}${searchTerm}`)

	const [stories, dispatchStories] = useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: false,
	})
	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value)
	}

	const handleSearchSubmit = (event) => {
		setUrl(`${API_ENDPOINT}${searchTerm}`)
		event.preventDefault()
	}

	const handleFetchStories = useCallback(async () => {
		if (!searchTerm) return
		dispatchStories({ type: 'STORIES_FETCH_INIT' })

		try {
			const result = await axios.get(url)

			dispatchStories({
				type: 'STORIES_FETCH_SUCCESS',
				payload: result.data.hits,
			})
		} catch {
			dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
		}
	}, [url])

	useEffect(() => {
		handleFetchStories()
	}, [handleFetchStories])

	const handleRemoveStory = (item) => {
		stories.data.filter((story) => item.objectID !== story.objectID)

		dispatchStories({
			type: 'REMOVE_STORY',
			payload: item,
		})
	}

	return (
		<div className='App'>
			<SearchForm
				searchTerm={searchTerm}
				onSearchInput={handleSearchInput}
				onSearchSubmit={handleSearchSubmit}
			/>

			{stories.isError && <p>Something went wrong...</p>}
			{stories.isLoading ? (
				<p>Loading...</p>
			) : (
				<List list={stories.data} onRemoveItem={handleRemoveStory} />
			)}

			<Example />
		</div>
	)
}
export default App
