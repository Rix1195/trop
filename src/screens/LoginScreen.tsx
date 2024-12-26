export default function LoginScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] p-3 gap-6">
      <h1>Zaloguj się</h1>

      <form className="w-full flex flex-col gap-5">
        <div>
          <p>Email:</p>
          <input type="email" />
        </div>

        <div>
          <p>Hasło:</p>
          <input type="password" />
        </div>

        <button type="submit" className="self-center">
          Zaloguj się
        </button>
      </form>
    </div>
  );
}
