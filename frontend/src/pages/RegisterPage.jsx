import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../features/auth/AuthForm";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(payload) {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await register(payload);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="section-card overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-slate-950 p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">New workspace</p>
          <h2 className="mt-4 text-5xl font-bold leading-tight">Bring projects, tasks, and comments into one rhythm.</h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-200">
            The first registered account becomes the admin, so you can immediately create projects, assign tasks, and manage the team.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <AuthForm mode="register" onSubmit={handleRegister} isSubmitting={isSubmitting} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}

