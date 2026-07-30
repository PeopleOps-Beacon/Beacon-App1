import { FormEvent, useEffect, useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";
import { KeyRound, LogOut, Mail, RotateCcw, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { auth, googleProvider, hasFirebaseConfig } from "../lib/firebase";
import { analytics } from "../services/analytics";
import {
  clearPilotSession,
  createPilotProfile,
  readPilotSession,
  savePilotSession,
  updatePilotProfile,
  userRoleLabels
} from "../services/authSession";
import type { UserProfile, UserRole } from "../types";

type AccessState = "idle" | "ready" | "error";

const roleOptions: UserRole[] = ["traveler", "airport-admin", "beacon-admin"];

function profileFromFirebaseUser(user: User, role: UserRole): UserProfile {
  const timestamp = new Date().toISOString();

  return {
    id: user.uid,
    email: user.email ?? "firebase-user@beacon.local",
    displayName: user.displayName ?? user.email?.split("@")[0] ?? "Beacon user",
    role,
    provider: "firebase",
    createdAt: user.metadata.creationTime ?? timestamp,
    updatedAt: timestamp
  };
}

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("traveler");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState<UserRole>("traveler");
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [status, setStatus] = useState<AccessState>("idle");
  const [message, setMessage] = useState(
    hasFirebaseConfig
      ? "Firebase authentication is connected."
      : "Pilot session mode is active until Firebase credentials are connected."
  );

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) {
      const storedSession = readPilotSession();

      if (storedSession) {
        setProfile(storedSession.profile);
        setDraftName(storedSession.profile.displayName);
        setDraftRole(storedSession.profile.role);
        setRememberMe(storedSession.remember);
        setStatus("ready");
        setMessage("Session restored for this pilot device.");
      }

      return;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setProfile(null);
        return;
      }

      const firebaseProfile = profileFromFirebaseUser(firebaseUser, selectedRole);
      setProfile(firebaseProfile);
      setDraftName(firebaseProfile.displayName);
      setDraftRole(firebaseProfile.role);
      setStatus("ready");
      setMessage("Secure session restored.");
    });
  }, [selectedRole]);

  const activateProfile = (nextProfile: UserProfile, remember: boolean) => {
    const session = savePilotSession(nextProfile, remember);
    setProfile(session.profile);
    setDraftName(session.profile.displayName);
    setDraftRole(session.profile.role);
    setRememberMe(session.remember);
    setDeleteRequested(false);
  };

  const handleEmailAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDeleteRequested(false);

    if (!email.trim()) {
      setStatus("error");
      setMessage("Enter an email address to continue.");
      return;
    }

    if (!hasFirebaseConfig || !auth) {
      const pilotProfile = createPilotProfile(email, selectedRole);
      activateProfile(pilotProfile, rememberMe);
      setPassword("");
      setStatus("ready");
      setMessage("Pilot session active. No password was stored on this device.");
      analytics.track("auth_login", { provider: "pilot", role: selectedRole, remembered: rememberMe });
      return;
    }

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseProfile = profileFromFirebaseUser(credential.user, selectedRole);
      setProfile(firebaseProfile);
      setDraftName(firebaseProfile.displayName);
      setDraftRole(firebaseProfile.role);
      setPassword("");
      setStatus("ready");
      setMessage("Secure access confirmed.");
      analytics.track("auth_login", { provider: "firebase", role: selectedRole, remembered: rememberMe });
    } catch {
      setStatus("error");
      setMessage("We could not sign you in. Check the email and password, then try again.");
    }
  };

  const handleCreateAccount = async () => {
    setDeleteRequested(false);

    if (!email.trim()) {
      setStatus("error");
      setMessage("Enter an email address before creating an account.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Use at least 8 characters for account creation.");
      return;
    }

    if (!hasFirebaseConfig || !auth) {
      const pilotProfile = createPilotProfile(email, selectedRole);
      activateProfile(pilotProfile, rememberMe);
      setPassword("");
      setStatus("ready");
      setMessage("Pilot account created. No password was stored on this device.");
      analytics.track("auth_register", { provider: "pilot", role: selectedRole, remembered: rememberMe });
      return;
    }

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: email.split("@")[0] ?? "Beacon user" });
      const firebaseProfile = profileFromFirebaseUser(credential.user, selectedRole);
      setProfile(firebaseProfile);
      setDraftName(firebaseProfile.displayName);
      setDraftRole(firebaseProfile.role);
      setPassword("");
      setStatus("ready");
      setMessage("Account created and secure session started.");
      analytics.track("auth_register", { provider: "firebase", role: selectedRole, remembered: rememberMe });
    } catch {
      setStatus("error");
      setMessage("We could not create that account. Check the email and password, then try again.");
    }
  };

  const handleGoogleAccess = async () => {
    setDeleteRequested(false);

    if (!hasFirebaseConfig || !auth || !googleProvider) {
      const pilotProfile = createPilotProfile(email || "pilot@beacon.local", selectedRole);
      activateProfile(pilotProfile, rememberMe);
      setStatus("ready");
      setMessage("Pilot Google session active. Connect Firebase to use real provider sign-in.");
      analytics.track("auth_login", { provider: "pilot-google", role: selectedRole, remembered: rememberMe });
      return;
    }

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithPopup(auth, googleProvider);
      const firebaseProfile = profileFromFirebaseUser(credential.user, selectedRole);
      setProfile(firebaseProfile);
      setDraftName(firebaseProfile.displayName);
      setDraftRole(firebaseProfile.role);
      setStatus("ready");
      setMessage("Google access confirmed.");
      analytics.track("auth_login", { provider: "google", role: selectedRole, remembered: rememberMe });
    } catch {
      setStatus("error");
      setMessage("Google sign-in was interrupted. Try again when you are ready.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setStatus("error");
      setMessage("Enter your email address before requesting a password reset.");
      return;
    }

    if (!hasFirebaseConfig || !auth) {
      setStatus("ready");
      setMessage("Pilot mode has no stored password. Firebase will send reset emails when connected.");
      analytics.track("auth_password_reset", { provider: "pilot" });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("ready");
      setMessage("Password reset email sent.");
      analytics.track("auth_password_reset", { provider: "firebase" });
    } catch {
      setStatus("error");
      setMessage("Password reset could not be sent. Confirm the email and try again.");
    }
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile) {
      return;
    }

    try {
      if (hasFirebaseConfig && auth?.currentUser) {
        await updateProfile(auth.currentUser, { displayName: draftName.trim() || profile.displayName });
        const updatedProfile: UserProfile = {
          ...profile,
          displayName: draftName.trim() || profile.displayName,
          role: draftRole,
          updatedAt: new Date().toISOString()
        };
        setProfile(updatedProfile);
      } else {
        const session = updatePilotProfile(profile, { displayName: draftName, role: draftRole }, rememberMe);
        setProfile(session.profile);
      }

      setSelectedRole(draftRole);
      setStatus("ready");
      setMessage("Profile updated.");
      analytics.track("auth_profile_updated", { role: draftRole, provider: profile.provider });
    } catch {
      setStatus("error");
      setMessage("Profile update failed. Try again before continuing.");
    }
  };

  const handleLogout = async () => {
    try {
      if (hasFirebaseConfig && auth?.currentUser) {
        await signOut(auth);
      }

      clearPilotSession();
      setProfile(null);
      setPassword("");
      setDeleteRequested(false);
      setStatus("ready");
      setMessage("Signed out securely.");
      analytics.track("auth_logout", { provider: profile?.provider ?? "unknown" });
    } catch {
      setStatus("error");
      setMessage("Secure logout failed. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteRequested) {
      setDeleteRequested(true);
      setStatus("error");
      setMessage("Press Delete account again to permanently remove this profile from the current auth provider.");
      return;
    }

    try {
      if (hasFirebaseConfig && auth?.currentUser) {
        await deleteUser(auth.currentUser);
      }

      clearPilotSession();
      analytics.track("auth_account_deleted", { provider: profile?.provider ?? "unknown" });
      setProfile(null);
      setPassword("");
      setDeleteRequested(false);
      setStatus("ready");
      setMessage("Account removed from this pilot session.");
    } catch {
      setStatus("error");
      setMessage("Account deletion needs a fresh sign-in before it can continue.");
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

      {profile ? (
        <div className="session-panel">
          <div className="session-summary">
            <UserRound aria-hidden="true" />
            <div>
              <strong>{profile.displayName}</strong>
              <span>{profile.email}</span>
              <small>{userRoleLabels[profile.role]} session</small>
            </div>
          </div>

          <form className="access-form profile-form" onSubmit={handleSaveProfile}>
            <label>
              Display name
              <span>
                <UserRound aria-hidden="true" />
                <input
                  autoComplete="name"
                  onChange={(event) => setDraftName(event.target.value)}
                  type="text"
                  value={draftName}
                />
              </span>
            </label>
            <label>
              Role
              <select onChange={(event) => setDraftRole(event.target.value as UserRole)} value={draftRole}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {userRoleLabels[role]}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Save profile</button>
          </form>

          <div className="profile-actions">
            <button className="secondary-action" onClick={handleLogout} type="button">
              <LogOut aria-hidden="true" />
              Secure logout
            </button>
            <button className="danger-action" onClick={handleDeleteAccount} type="button">
              <Trash2 aria-hidden="true" />
              {deleteRequested ? "Confirm delete" : "Delete account"}
            </button>
          </div>
        </div>
      ) : (
        <>
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
                  placeholder="Password"
                  type="password"
                  value={password}
                />
              </span>
            </label>
            <label>
              Role
              <select onChange={(event) => setSelectedRole(event.target.value as UserRole)} value={selectedRole}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {userRoleLabels[role]}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-check">
              <input
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                type="checkbox"
              />
              Remember me on this device
            </label>
            <button type="submit">Continue</button>
          </form>

          <button className="secondary-action" onClick={handleCreateAccount} type="button">
            Create account
          </button>

          <button className="secondary-action" onClick={handleGoogleAccess} type="button">
            Continue with Google
          </button>

          <button className="text-action" onClick={handlePasswordReset} type="button">
            <RotateCcw aria-hidden="true" />
            Reset password
          </button>
        </>
      )}

      <p className={`access-message ${status}`}>{message}</p>
    </section>
  );
}
