import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const hydrate = useAuthStore.persist?.rehydrate;

  useEffect(() => {
    // 🔥 مهم: تحميل البيانات من localStorage قبل أي request
    hydrate?.();
  }, [hydrate]);

  return <AppRoutes />;
};

export default App;