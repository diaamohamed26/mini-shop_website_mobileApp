import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../store/cart.store";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const { items, clearCart } = useCartStore();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const tabs = [
    { name: "Home", route: "/home", icon: "home" },
    { name: "Shop", route: "/products", icon: "bag" },
    { name: "Cart", route: "/cart", icon: "cart" },
    { name: "Logout", route: "logout", icon: "log-out" },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isLogout = tab.route === "logout";
          const active = !isLogout && pathname === tab.route;

          return (
            <Pressable
              key={tab.route}
              style={styles.item}
              onPress={() => {
                // 🚪 LOGOUT ACTION
                if (isLogout) {
                  clearCart();

                  // لو عندك auth store:
                  // useAuthStore.getState().logout();

                  router.replace("/login");
                  return;
                }

                router.push(tab.route as any);
              }}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={
                    active
                      ? (tab.icon as any)
                      : (`${tab.icon}-outline` as any)
                  }
                  size={22}
                  color={
                    isLogout ? "#ff4d4d" : active ? "#fff" : "#777"
                  }
                />

                {/* CART BADGE */}
                {tab.route === "/cart" && cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartCount}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.label,
                  active && styles.activeLabel,
                  isLogout && { color: "#ff4d4d" },
                ]}
              >
                {tab.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 10, // safe area
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",

    backgroundColor: "#111",
    borderTopWidth: 1,
    borderTopColor: "#222",

    paddingVertical: 14,
    paddingHorizontal: 20,

    width: "100%",

    elevation: 12,
  },

  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    position: "relative",
  },

  label: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
  },

  activeLabel: {
    color: "#fff",
    fontWeight: "700",
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -10,

    backgroundColor: "red",
    borderRadius: 10,

    minWidth: 16,
    height: 16,

    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});