import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../features/auth/AuthForm";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(payload) {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await login(payload);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="section-card mesh-background overflow-hidden bg-slate-950 p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">Command center</p>
          <h2 className="mt-4 text-5xl font-bold leading-tight">Ship the right work with less friction.</h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
            See status at a glance, highlight overdue tasks, keep project membership clean, and hold the whole team inside one focused workflow.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <AuthForm mode="login" onSubmit={handleLogin} isSubmitting={isSubmitting} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}

