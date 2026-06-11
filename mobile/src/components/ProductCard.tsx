import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

type Product = {
  id: string;
  title: string;
  price: number;
  image?: string;
};

type Props = {
  item: Product;
  onAddToCart: (item: Product) => Promise<void> | void;
  loadingId?: string | null;
};

export default function ProductCard({
  item,
  onAddToCart,
  loadingId,
}: Props) {
  const isLoading = loadingId === item.id;

  const handleAddToCart = async () => {
    await onAddToCart(item);
    router.push("/cart");
  };

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.image ||
            "https://via.placeholder.com/500x500",
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Text style={styles.price}>
          ${item.price}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              Add to Cart
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#111",
    borderRadius: 22,
    overflow: "hidden",

    marginBottom: 18,

    borderWidth: 1,
    borderColor: "#222",
  },

  image: {
    width: "100%",
    height: 190,
    backgroundColor: "#1a1a1a",
  },

  content: {
    padding: 14,
  },

  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    minHeight: 42,
  },

  price: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "700",
  },
});