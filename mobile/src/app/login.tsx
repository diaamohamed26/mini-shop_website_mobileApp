import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { loginService } from "../services/auth.service";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      await loginService(email, password);

      router.replace("/(tabs)/home");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MINI SHOP</Text>

        <Text style={styles.subtitle}>
          Welcome back, sign in to continue
        </Text>
      </View>

      {/* Login Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.forgotContainer}
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/register")}
        >
          <Text style={styles.link}>
            Don't have an account?{" "}
            <Text style={styles.linkBold}>
              Create Account
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Fashion • Lifestyle • Premium Shopping
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 3,
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#111111",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#222",

    shadowColor: "#ffffff",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    color: "#fff",

    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,

    marginBottom: 14,
    fontSize: 15,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },

  forgotText: {
    color: "#9ca3af",
    fontSize: 14,
  },

  button: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  link: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 20,
    fontSize: 14,
  },

  linkBold: {
    color: "#fff",
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: "#555",
    marginTop: 30,
    fontSize: 13,
  },
});