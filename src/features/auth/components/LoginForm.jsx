import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Mail, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { loginAdmin } from "../api/auth.api";
import { clearAuthError, setAuthError, setCredentials } from "../authSlice";
import { setAccessToken } from "../services/tokenManager";
import { setStoredAdmin } from "../services/adminStorage";
import { adminLoginSchema } from "../schemas/auth.schema";

import PasswordInput from "./PasswordInput";
import styles from "../styles/LoginForm.module.css";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const loginMutation = useMutation({
    mutationFn: loginAdmin,

    onMutate: () => {
      dispatch(clearAuthError());
    },

    onSuccess: (data) => {
      const admin = data?.admin;
      const accessToken = data?.accessToken;

      if (!admin || !accessToken) {
        const message = "The server returned an invalid login response.";

        dispatch(setAuthError(message));
        toast.error(message);

        return;
      }

      setAccessToken(accessToken);
      setStoredAdmin(admin);

      dispatch(setCredentials(admin));

      toast.success(data.message || "Login successful.");

      const destination = location.state?.from?.pathname || "/dashboard";

      navigate(destination, {
        replace: true,
      });
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Unable to sign in. Please check your credentials.";

      dispatch(setAuthError(message));
      toast.error(message);
    },
  });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = (values) => {
    loginMutation.mutate(values);
  };

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <form
      className={styles.form}
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email address
        </label>

        <div
          className={`${styles.inputWrapper} ${
            emailError ? styles.inputError : ""
          }`}
        >
          <Mail
            size={18}
            strokeWidth={1.8}
            className={styles.leadingIcon}
            aria-hidden="true"
          />

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            className={styles.input}
            {...form.register("email")}
          />
        </div>

        {emailError && <p className={styles.errorMessage}>{emailError}</p>}
      </div>

      <PasswordInput
        id="password"
        label="Password"
        error={passwordError}
        registration={form.register("password")}
      />

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className={styles.submitButton}
      >
        {loginMutation.isPending ? (
          <>
            <LoaderCircle size={18} className={styles.spinner} />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}

export default LoginForm;
