import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'

function App() {
  const [openRooms, setOpenRooms] = useState(null)
  const [error, setError] = useState(null)

  // Fetch product data
  useEffect(() => {
    let isMounted = true

    async function fetchProductData() {
        const data = await productData.allProductData()
        
        if (!isMounted) {
            return
        }
        
        if (data instanceof Error) {
            setError(data)
        }
        else {
            setProducts(data)
        }
    }

    fetchProductData()

    return () => {
        isMounted = false
    }
  }, [])

  if (error) {
    return (
      <div id='rootApp' className='error'>
        <p>A network error occurred.</p>
      </div>
    )
  }

  if (!products) {
    return (
      <div id='rootApp' className='loading'>
        <p className='loading'>Loading...</p>
      </div>
      
    )
  }

  return (
    <>
      
    </>
  )
}

export default App
