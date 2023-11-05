import React from 'react'
import Item from './Item'

export default function List({ list }) {
	return (
		<ul>
			{list.map(({objectID, ...item}) => {
				console.log(item)
				return <Item key={item.objectID} {...item} />
			})}
		</ul>
	)
}
