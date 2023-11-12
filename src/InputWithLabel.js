import React from 'react'
import { useRef, useEffect } from 'react'

function InputWithLabel({
	id,
	value,
	type = 'text',
	onInputChange,
	isFocused,
	children,
}) {
	// (A) create a ref using 'useRef' hook.
	const inputRef = useRef()

	// (C) Opt into React's lifecycle with React's 'useEffect' hook
	useEffect(() => {
		if (isFocused && inputRef.current) {
			// (D) since the ref is passed to the input field’s ref attribute, its current property gives access to the element.
			inputRef.current.focus()
		}
	}, [isFocused]) //why isFocused is passed as dependency to useEffect?

	return (
		<div>
			<label htmlFor={id}>{children}</label>
			{/* (B) pass the inputRef to input element */}
			<input
				ref={inputRef}
				id={id}
				type={type}
				value={value}
				onChange={onInputChange}
			/>
		</div>
	)
}
export default InputWithLabel
