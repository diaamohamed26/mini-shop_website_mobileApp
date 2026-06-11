import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import API from "../../api/client";
import ProductCard from "../../components/ProductCard";
import { useCartStore } from "../../store/cart.store";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>
          Loading products...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#fff"
        />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>MINI SHOP</Text>

        <Text style={styles.subTitle}>
          Discover premium fashion collections
        </Text>
      </View>

      {/* HERO BANNER */}
      <View style={styles.hero}>
        <Text style={styles.heroBadge}>
          NEW COLLECTION
        </Text>

        <Text style={styles.heroTitle}>
          Summer{"\n"}Collection 2026
        </Text>

        <Text style={styles.heroDescription}>
          Discover the latest trends and get up to
          50% OFF selected products.
        </Text>

        <TouchableOpacity style={styles.shopButton}>
          <Text style={styles.shopButtonText}>
            Shop Now
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECTION HEADER */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Popular Products
        </Text>

        <Text style={styles.count}>
          {products.length} items
        </Text>
      </View>

      {/* PRODUCTS */}
      <View style={styles.grid}>
        {products.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onAddToCart={addToCart}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
  },

  center: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#888",
    marginTop: 12,
    fontSize: 14,
  },

  header: {
    marginTop: 60,
    marginBottom: 24,
  },

  logo: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 2,
  },

  subTitle: {
    color: "#9ca3af",
    marginTop: 6,
    fontSize: 15,
  },

  hero: {
    backgroundColor: "#111",
    borderRadius: 30,
    padding: 24,
    marginBottom: 30,

    borderWidth: 1,
    borderColor: "#222",
  },

  heroBadge: {
    color: "#fff",
    backgroundColor: "#222",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 18,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 42,
  },

  heroDescription: {
    color: "#9ca3af",
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 22,
  },

  shopButton: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
  },

  shopButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  count: {
    color: "#888",
    fontSize: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 120,
  },
});