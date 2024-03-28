import { Container } from "react-bootstrap";
import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  let msg = 'Error unknown'

  if (typeof error === 'object' && error) {
    if ('statusText' in error) {
      msg = error.statusText as string
    }
    else if ('message' in error) {
      msg = error.message as string
    }
  }



  return (
    <Container>
      <h1
        className="display-1 mt-5"
      >
        Oops!
      </h1>
      <p
        className="fs-1"
      >
        Sorry, an error has occurred.
      </p>
      <p
        className="fs-3"
      >
        <i>{msg}</i>
      </p>
      <Link to='/'>
        <span
          className="fs-3"
        >
          Return Home
        </span>
        
      </Link>
    </Container>
  );
}


export default ErrorPage