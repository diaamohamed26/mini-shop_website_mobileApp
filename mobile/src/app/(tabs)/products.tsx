import { useEffect, useState, useMemo } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

import API from "../../api/client";
import ProductCard from "../../components/ProductCard";
import { useCartStore } from "../../store/cart.store";

type Product = {
  id: string;
  title: string;
  price: number;
  image?: string;
  category?: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const addToCart = useCartStore((s) => s.addToCart);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await API.get("/products");

      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#fff"
        />

        <Text style={styles.loadingText}>
          Loading Products...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          Explore Collection
        </Text>

        <Text style={styles.subHeader}>
          {filtered.length} Products Available
        </Text>
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Search products..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* PRODUCTS */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onAddToCart={addToCart}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  headerContainer: {
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 16,
  },

  header: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },

  subHeader: {
    color: "#888",
    marginTop: 6,
    fontSize: 14,
  },

  search: {
    marginHorizontal: 16,
    marginBottom: 20,

    backgroundColor: "#111",

    borderWidth: 1,
    borderColor: "#222",

    color: "#fff",

    paddingHorizontal: 18,
    paddingVertical: 15,

    borderRadius: 18,
    fontSize: 15,
  },

  list: {
    paddingHorizontal: 12,
    paddingBottom: 120,
  },

  row: {
    justifyContent: "space-between",
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
});