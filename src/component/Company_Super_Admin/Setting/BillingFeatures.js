import React, { useEffect, useState } from 'react'

const BillingFeatures = (props) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let array = JSON.parse(props.data)
    setItems(array)
  }, [props]);

  return (
    <>
      {items.length > 0 && (items?.map((item, key) => (
        <li>{item && (
          key + 1 + item
        )}</li>
      )))}
    </>
  )
}

export default BillingFeatures