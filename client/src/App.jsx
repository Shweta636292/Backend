
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddBook from "./pages/AddBook";
import Books from "./pages/book";
import MyBorrowedBooks from "./pages/MyBorrowedBooks";
import BorrowBook from "./pages/BorrowBook";
import Fines from "./pages/Fines";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
       <Route path="/books/add" element={<AddBook />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/books" element={<book />} />
       <Route path="/borrow-book" element={<BorrowBook />} />
       <Route path="/fines" element={<Fines />} />
       <Route
  path="/my-borrowed-books"
  element={<MyBorrowedBooks />}
/>
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
