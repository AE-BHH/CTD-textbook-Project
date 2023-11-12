import React from 'react'

function InputWithLabel({ id, label, value, onInputChange}) {
	return (
		<div>
			<label htmlFor={id}>{label}</label>
			<input id={id} type='text' value={value} onChange={onInputChange} />
		</div>
	)
}
export default InputWithLabel
