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
import { registerService } from "../services/auth.service";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      await registerService(name, email, password);

      router.replace("/(tabs)/home");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Register failed");
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
          Create your account and start shopping
        </Text>
      </View>

      {/* Register Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

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
          style={styles.button}
          disabled={loading}
          onPress={handleRegister}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/login")}
        >
          <Text style={styles.link}>
            Already have an account?{" "}
            <Text style={styles.linkBold}>
              Sign In
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

  button: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
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