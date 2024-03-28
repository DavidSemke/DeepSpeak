import { Spinner } from "react-bootstrap"


function LoadingVisual() {
    return (
        <Spinner 
            animation="border" 
            role="status"
        >
            <span 
            className="visually-hidden"
            >
            Loading...
            </span>
        </Spinner>
    )
}


export default LoadingVisual