import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

export const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};