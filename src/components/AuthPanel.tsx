import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { auth, googleProvider, hasFirebaseConfig } from "../lib/firebase";

type AccessState = "idle" | "ready" | "error";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<AccessState>("idle");
  const [message, setMessage] = useState("Firebase credentials are not connected in this preview.");

  const handleEmailAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasFirebaseConfig || !auth) {
      setStatus("ready");
      setMessage("Preview mode: account access is ready for Firebase connection.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus("ready");
      setMessage("Secure access confirmed.");
    } catch {
      setStatus("error");
      setMessage("We could not sign you in. Check the email and password, then try again.");
    }
  };

  const handleGoogleAccess = async () => {
    if (!hasFirebaseConfig || !auth || !googleProvider) {
      setStatus("ready");
      setMessage("Preview mode: Google sign-in is ready for Firebase connection.");
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
      setStatus("ready");
      setMessage("Google access confirmed.");
    } catch {
      setStatus("error");
      setMessage("Google sign-in was interrupted. Try again when you are ready.");
    }
  };

  return (
    <section className="panel access-panel" aria-labelledby="access-title">
      <div className="panel-heading">
        <ShieldCheck aria-hidden="true" />
        <div>
          <p className="eyebrow">Account Access</p>
          <h2 id="access-title">Traveler-safe sign in</h2>
        </div>
      </div>

      <form onSubmit={handleEmailAccess} className="access-form">
        <label>
          Email
          <span>
            <Mail aria-hidden="true" />
            <input
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              type="email"
              value={email}
            />
          </span>
        </label>
        <label>
          Password
          <span>
            <KeyRound aria-hidden="true" />
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              type="password"
              value={password}
            />
          </span>
        </label>
        <button type="submit">Continue</button>
      </form>

      <button className="secondary-action" onClick={handleGoogleAccess} type="button">
        Continue with Google
      </button>

      <p className={`access-message ${status}`}>{message}</p>
    </section>
  );
}
