import {Link} from "react-router-dom";

export default function PageNotFoundScreen() {
  return (
    <div className="h-screen flex justify-center items-center flex-col p-3 gap-3">
      <h1 className="text-center">Nie znaleziono stony</h1>
      <p>Wygląda na to, ze ta strona nie istnieje :(</p>

      <Link to="/">
        <button>Wróć do strony głównej</button>
      </Link>
    </div>
  );
}
