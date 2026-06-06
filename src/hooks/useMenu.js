import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db, isDummyConfig } from '../firebase/config';

const DUMMY_CATEGORIES = [
  { id: '1', name: 'Coffee', icon: '☕' },
  { id: '2', name: 'Pizza', icon: '🍕' },
  { id: '3', name: 'Burger', icon: '🍔' },
  { id: '4', name: 'Dessert', icon: '🍰' },
  { id: '5', name: 'Drinks', icon: '🥤' },
];

const DUMMY_MENU = [
  { 
    id: 'm1', 
    name: 'Cappuccino', 
    description: 'Rich espresso with smooth steamed milk and a thick layer of foam.', 
    price: 180, 
    discount: 10, // 10% OFF
    category: 'Coffee', 
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop', 
    available: true,
    rating: 4.8,
    prepTime: '10 min',
    isVeg: true,
    isBestseller: true
  },
  { 
    id: 'm2', 
    name: 'Margherita Pizza', 
    description: 'Classic sourdough base topped with San Marzano tomatoes and mozzarella.', 
    price: 350, 
    discount: 0,
    category: 'Pizza', 
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=600&auto=format&fit=crop', 
    available: true,
    rating: 4.5,
    prepTime: '20 min',
    isVeg: true,
    isBestseller: false
  },
  { 
    id: 'm3', 
    name: 'Classic Beef Burger', 
    description: 'Juicy Angus beef patty, fresh lettuce, and our secret house sauce.', 
    price: 250, 
    discount: 20, // 20% OFF
    category: 'Burger', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop', 
    available: true,
    rating: 4.7,
    prepTime: '15 min',
    isVeg: false,
    isBestseller: true
  },
  { 
    id: 'm4', 
    name: 'Chocolate Lava Cake', 
    description: 'Warm chocolate cake with a molten center, served with vanilla scoop.', 
    price: 200, 
    discount: 0,
    category: 'Dessert', 
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop', 
    available: true,
    rating: 4.9,
    prepTime: '12 min',
    isVeg: true,
    isBestseller: true
  },
  { 
    id: 'm5', 
    name: 'Iced Caramel Macchiato', 
    description: 'Freshly pulled espresso with vanilla-flavored syrup and caramel drizzle.', 
    price: 220, 
    discount: 5,
    category: 'Drinks', 
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=600&auto=format&fit=crop', 
    available: true,
    rating: 4.6,
    prepTime: '8 min',
    isVeg: true,
    isBestseller: false
  },
];

export function useMenu() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDummyConfig) {
      setCategories(DUMMY_CATEGORIES);
      setMenuItems(DUMMY_MENU);
      setLoading(false);
      return () => {};
    }

    const catQuery = query(collection(db, 'categories'));
    const menuQuery = query(collection(db, 'menuItems'), where('available', '==', true));

    const unsubscribeCat = onSnapshot(catQuery, (snapshot) => {
      if (!snapshot.empty) {
        setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setCategories(DUMMY_CATEGORIES);
      }
    }, (error) => {
      console.warn("Firestore error (categories):", error);
      setCategories(DUMMY_CATEGORIES);
    });

    const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
      if (!snapshot.empty) {
        setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setMenuItems(DUMMY_MENU);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Firestore error (menuItems):", error);
      setMenuItems(DUMMY_MENU);
      setLoading(false);
    });

    return () => {
      unsubscribeCat();
      unsubscribeMenu();
    };
  }, []);

  return { categories, menuItems, loading };
}
