import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ManageOrders from './pages/ManageOrders';
import ManagePayments from './pages/ManagePayments';
import PaymentSettings from './pages/PaymentSettings';

// একটি ডামি ড্যাশবোর্ড পেজ (যদি আলাদাভাবে না থাকে)
const AdminDashboard = () => <div className="text-2xl font-bold">স্বাগতম এডমিন ড্যাশবোর্ডে!</div>;

function App() {
  return (
    <Routes>
      {/* আমরা AdminLayout-কে মেইন রুট হিসেবে রাখছি */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="payments" element={<ManagePayments />} />
        <Route path="payment-settings" element={<PaymentSettings />} />
      </Route>

      {/* যদি কেউ ভুল লিংকে যায় তাকে এডমিন হোমে পাঠানো */}
      <Route path="*" element={<div className="p-10 text-center">৪ঠা৪: পেজ পাওয়া যায়নি।</div>} />
    </Routes>
  );
}

export default App;
