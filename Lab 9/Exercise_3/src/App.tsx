import { useState } from 'react'

function App() {
  const [count, setCount] = useState<number>(0)

  const handleIncrement = () => {
    setCount((previousCount) => previousCount + 1)
  }

  const handleDecrement = () => {
    setCount((previousCount) => previousCount - 1)
  }

  return (
    <main className="counter-card">
      <h1>Simple Counter</h1>
      <p className="counter-value">{count}</p>
      <div className="actions">
        <button className="decrement" type="button" onClick={handleDecrement}>
          Decrement
        </button>
        <button className="increment" type="button" onClick={handleIncrement}>
          Increment
        </button>
      </div>
    </main>
  )
}

export default App