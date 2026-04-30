import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

export default function AuthForm({
  mode,
  onSubmit,
  isSubmitting,
  errorMessage
}) {
  const isRegisterMode = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      role: formData.get("role")?.toString() || "Member"
    };

    await onSubmit(payload);
  }

  return (
    <form className="section-card w-full max-w-xl p-8 sm:p-10" onSubmit={handleSubmit}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
        {isRegisterMode ? "Create account" : "Welcome back"}
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-950">
        {isRegisterMode ? "Start leading projects with clarity." : "Sign in to your workspace."}
      </h1>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        Manage projects, assign tasks, track overdue work, and keep team comments in one place.
      </p>

      <div className="mt-8 space-y-5">
        {isRegisterMode ? (
          <div>
            <label className="field-label" htmlFor="name">
              Full name
            </label>
            <Input id="name" name="name" placeholder="Adarsh Sharma" required />
          </div>
        ) : null}

        <div>
          <label className="field-label" htmlFor="role">
            Role
          </label>
          <Select id="role" name="role" defaultValue="Member" required>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </Select>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            {isRegisterMode
              ? "Choose the role you want to request during signup. Admin signup is allowed only when no admin account exists yet."
              : "Choose the role for this account before signing in."}
          </p>
        </div>

        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        <div>
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <Input id="password" name="password" type="password" placeholder="Minimum 8 characters" required />
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <Button className="mt-8 w-full py-3" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : isRegisterMode ? "Create account" : "Sign in"}
      </Button>

      <p className="mt-5 text-sm text-slate-500">
        {isRegisterMode ? "Already have an account?" : "Need an account?"}{" "}
        <Link className="font-semibold text-teal-700 hover:text-teal-800" to={isRegisterMode ? "/login" : "/register"}>
          {isRegisterMode ? "Log in" : "Register"}
        </Link>
      </p>
    </form>
  );
}
