import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

import API from "../../api/client";
import { useCartStore } from "../../store/cart.store";

export default function Checkout() {
  const { items, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isValid =
    phone.trim().length >= 8 && address.trim().length >= 5;

  const handleCheckout = async () => {
    if (!isValid) {
      Alert.alert("Invalid Data", "Please enter valid phone & address");
      return;
    }

    try {
      setLoading(true);

      await API.post("/orders", {
        phone,
        address,
        items: items.map((item) => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
        })),
        total,
      });

      clearCart();
      router.replace("/products");
    } catch (err: any) {
      console.log("CHECKOUT ERROR:", err?.response?.data || err.message);
      Alert.alert("Error", "Order failed, try again");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptyText}>
          Add products before checkout
        </Text>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.push("/products")}
        >
          <Text style={styles.shopButtonText}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>
          Complete your order
        </Text>

        {/* PRODUCTS LIST */}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 220 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.sub}>
                  {item.category || "General"} • Qty: {item.quantity}
                </Text>
              </View>

              <Text style={styles.price}>
                ${item.price * item.quantity}
              </Text>
            </View>
          )}
        />

        {/* INPUTS */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="Enter phone"
            placeholderTextColor="#666"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Delivery Address</Text>
          <TextInput
            placeholder="Enter address"
            placeholderTextColor="#666"
            value={address}
            onChangeText={setAddress}
            multiline
            style={[styles.input, { height: 80 }]}
          />
        </View>

        {/* TOTAL CARD */}
        <View style={styles.totalCard}>
          <Text style={styles.totalTitle}>Order Summary</Text>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* BOTTOM BUTTON */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            onPress={handleCheckout}
            disabled={loading || !isValid}
            style={[
              styles.button,
              (!isValid || loading) && { opacity: 0.5 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>
                Place Order
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    color: "#777",
    marginTop: 6,
    marginBottom: 14,
  },

  // product card (same as products page)
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  sub: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },

  price: {
    color: "#fff",
    fontWeight: "800",
  },

  // input cards
  inputCard: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  label: {
    color: "#777",
    fontSize: 12,
    marginBottom: 6,
  },

  input: {
    color: "#fff",
    fontSize: 14,
  },

  // total card
  totalCard: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 16,
    padding: 14,
    marginTop: 6,
    marginBottom: 80,
  },

  totalTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalLabel: {
    color: "#777",
  },

  totalValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  // bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#222",
    padding: 16,
  },

  button: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontWeight: "800",
  },

  // empty
  emptyContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  emptyText: {
    color: "#777",
    marginTop: 8,
    marginBottom: 20,
    textAlign: "center",
  },

  shopButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  shopButtonText: {
    color: "#000",
    fontWeight: "700",
  },
});