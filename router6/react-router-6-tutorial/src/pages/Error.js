import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section className="section">
      <h2>Error</h2>
      <h1>Page not found</h1>
      <Link to="/" className="btn">
        Back to home
      </Link>
    </section>
  );
};
export default Error;
