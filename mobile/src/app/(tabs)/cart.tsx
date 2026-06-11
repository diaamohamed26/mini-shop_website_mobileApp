import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useCartStore } from "../../store/cart.store";

export default function Cart() {
  const { items, removeFromCart, updateQuantity } = useCartStore();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!items.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptyText}>
          Add products to start shopping
        </Text>

        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => router.push("/products")}
        >
          <Text style={styles.shopBtnText}>Go Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <Text style={styles.subtitle}>Review your items</Text>

      {/* LIST */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 160 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.category || "General"}
              </Text>

              {/* QUANTITY CONTROL */}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{item.quantity}</Text>

                <TouchableOpacity
                  onPress={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* PRICE + REMOVE */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.price}>
                ${item.price * item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => removeFromCart(item.id)}
              >
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${total.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
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

  // CART CARD (same system)
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

  meta: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },

  price: {
    color: "#fff",
    fontWeight: "800",
  },

  // quantity
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyBtn: {
    backgroundColor: "#222",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  qtyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  qty: {
    color: "#fff",
    marginHorizontal: 10,
  },

  remove: {
    color: "red",
    marginTop: 10,
    fontSize: 12,
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

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  totalLabel: {
    color: "#777",
  },

  totalValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  checkoutBtn: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  checkoutText: {
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

  shopBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  shopBtnText: {
    color: "#000",
    fontWeight: "700",
  },
});