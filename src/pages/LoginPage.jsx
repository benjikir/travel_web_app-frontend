// src/pages/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email?.value;
    const password = form.password?.value;

    // TODO: Eigentliche Authentifizierung (z. B. api.login(email, password))
    // await api.login({ email, password });

    // Nach erfolgreichem Login weiterleiten
    navigate("/");
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
}

export default LoginPage;
