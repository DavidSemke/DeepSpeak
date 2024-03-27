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
    <>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{msg}</i>
      </p>
      <Link to='/'>
        Return Home
      </Link>
      
    </>
  );
}


export default ErrorPage