'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface SummaryData {
  userStats: {
    totalUsers: number;
    totalVendors: number;
    totalCustomers: number;
  };
  listingStats: {
    totalListings: number;
    pendingListings: number;
    activeListings: number;
  };
  bookingStats: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    paidBookingsCount: number;
  };
  financialStats: {
    totalRevenue: number;
  };
}

interface RevenueItem {
  month: string;
  revenue: number;
  bookingsCount: number;
}

interface VendorStatsItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  bookingsCount: number;
  revenue: number;
}

interface UserGrowthItem {
  month: string;
  newUsers: number;
  newVendors: number;
  newCustomers: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [revenue, setRevenue] = useState<RevenueItem[]>([]);
  const [topVendors, setTopVendors] = useState<VendorStatsItem[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthItem[]>([]);
  const [loading, setLoading] = useState(true);

  const dummySummary: SummaryData = {
    userStats: {
      totalUsers: 500,
      totalVendors: 150,
      totalCustomers: 350,
    },
    listingStats: {
      totalListings: 120,
      pendingListings: 30,
      activeListings: 90,
    },
    bookingStats: {
      totalBookings: 200,
      pendingBookings: 20,
      confirmedBookings: 120,
      completedBookings: 60,
      paidBookingsCount: 180,
    },
    financialStats: {
      totalRevenue: 250000,
    },
  };

  const dummyRevenue: RevenueItem[] = [
    { month: 'January', revenue: 40000, bookingsCount: 40 },
    { month: 'February', revenue: 30000, bookingsCount: 35 },
    { month: 'March', revenue: 45000, bookingsCount: 50 },
  ];

  const dummyVendors: VendorStatsItem[] = [
    { id: '1', name: 'Royal Events', category: 'Decorator', rating: 4.8, bookingsCount: 30, revenue: 60000 },
    { id: '2', name: 'Elite Caterers', category: 'Catering', rating: 4.6, bookingsCount: 25, revenue: 50000 },
  ];

  const dummyUserGrowth: UserGrowthItem[] = [
    { month: 'January', newUsers: 50, newVendors: 15, newCustomers: 35 },
    { month: 'February', newUsers: 60, newVendors: 20, newCustomers: 40 },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, revenueRes, vendorRes, usersRes] = await Promise.all([
          axios.get('/api/admin/reports?type=summary'),
          axios.get('/api/admin/reports?type=revenue'),
          axios.get('/api/admin/reports?type=vendors'),
          axios.get('/api/admin/reports?type=users'),
        ]);

        // Apply fallbacks if no data
        setSummary(summaryRes.data || dummySummary);
        setRevenue(revenueRes.data?.revenueByMonth || dummyRevenue);
        setTopVendors(vendorRes.data?.topVendors || dummyVendors);
        setUserGrowth(usersRes.data?.userGrowth || dummyUserGrowth);

        // Warn in console
        if (!summaryRes.data) console.warn("Using dummy summary data");
        if (!revenueRes.data?.revenueByMonth) console.warn("Using dummy revenue data");
        if (!vendorRes.data?.topVendors) console.warn("Using dummy vendor data");
        if (!usersRes.data?.userGrowth) console.warn("Using dummy user growth data");

      } catch (error) {
        console.error("Dashboard API failed. Using fallback data:", error);
        setSummary(dummySummary);
        setRevenue(dummyRevenue);
        setTopVendors(dummyVendors);
        setUserGrowth(dummyUserGrowth);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!summary) return <div>Error loading dashboard.</div>;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Users" value={summary.userStats.totalUsers} />
        <Card title="Total Vendors" value={summary.userStats.totalVendors} />
        <Card title="Total Listings" value={summary.listingStats.totalListings} />
        <Card title="Total Revenue" value={`PKR ${summary.financialStats.totalRevenue.toLocaleString()}`} />
      </div>

      {/* Revenue Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Monthly Revenue</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Month</th>
                <th className="p-2">Revenue</th>
                <th className="p-2">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((item) => (
                <tr key={item.month}>
                  <td className="p-2">{item.month}</td>
                  <td className="p-2">PKR {item.revenue.toLocaleString()}</td>
                  <td className="p-2">{item.bookingsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Vendors Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Top Vendors</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Vendor</th>
                <th className="p-2">Category</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Bookings</th>
                <th className="p-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="p-2">{vendor.name}</td>
                  <td className="p-2">{vendor.category}</td>
                  <td className="p-2">{vendor.rating}</td>
                  <td className="p-2">{vendor.bookingsCount}</td>
                  <td className="p-2">PKR {vendor.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Growth Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">User Growth</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Month</th>
                <th className="p-2">New Users</th>
                <th className="p-2">New Vendors</th>
                <th className="p-2">New Customers</th>
              </tr>
            </thead>
            <tbody>
              {userGrowth.map((row) => (
                <tr key={row.month}>
                  <td className="p-2">{row.month}</td>
                  <td className="p-2">{row.newUsers}</td>
                  <td className="p-2">{row.newVendors}</td>
                  <td className="p-2">{row.newCustomers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white border rounded shadow p-4">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
