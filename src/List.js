import React from 'react'
import Item from './Item'

export default function List({ list, onRemoveItem }) {
	return (
		<ul>
			{list.map((item) => {
				return (
					<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
				)
			})}
		</ul>
	)
}
