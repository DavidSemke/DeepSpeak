import { Spinner } from "react-bootstrap"

function LoadingVisual() {
  return (
    <div className="loading-visual">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}

export default LoadingVisual
