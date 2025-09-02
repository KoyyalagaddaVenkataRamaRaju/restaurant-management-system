import Login from "../pages/Login";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import OwnerDashboard from "../pages/OwnerDashboard";
import Home from "../pages/Home";
// import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

export const routes = [
  { path: "/home", element: <Home /> },
  { path: "/", element: <Login /> },
  { path: "/menu/:tableNumber", element: <Menu /> }, // Updated to accept table number
  { path: "/cart/:tableNumber", element: <Cart /> },
  { path: "/orders", element: <Orders/>},
  {
    path: "/owner-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["owner"]}>
        <OwnerDashboard />
      </ProtectedRoute>
    ),
  },
  // { path: "*", element: <NotFound /> }, // 404 Page
];
