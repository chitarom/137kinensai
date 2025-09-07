import React from 'react'

const FilterButton = ({category,id,func}) => {
  return (
    <button className={'filter' + (filter[0].includes(category) ? '' : ' inactive')} id={id} onClick={func}>{category}</button>
  )
}

export default FilterButton;