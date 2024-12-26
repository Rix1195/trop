import {Link} from "react-router-dom";

export default function HomeScreen() {
  return (
    <main className="p-6 flex flex-col justify-center items-center h-[90vh] gap-3">
      <h1>TROP</h1>
      <Link to="/signUp">
        <button>Rozpocznij</button>
      </Link>
    </main>
  );
}
