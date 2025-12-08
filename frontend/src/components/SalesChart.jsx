import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const COLORS = ["#f87171", "#a78bfa", "#fb7185", "#60a5fa", "#34d399", "#fbbf24"];

function SalesChart({ sales = [] }) {
  // Process sales data for time-based chart
  const timeSeriesData = useMemo(() => {
    if (!sales || sales.length === 0) return [];

    // Group sales by date
    const salesByDate = sales.reduce((acc, sale) => {
      const date = new Date(sale.date || sale.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      
      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          count: 0,
        };
      }
      
      acc[date].total += sale.total || sale.price * sale.quantity || 0;
      acc[date].count += 1;
      
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(salesByDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // Show last 30 days
  }, [sales]);

  // Process sales data for category chart
  const categoryData = useMemo(() => {
    if (!sales || sales.length === 0) return [];

    const salesByCategory = sales.reduce((acc, sale) => {
      const categoryName = sale.category?.name || "Uncategorized";
      const total = sale.total || sale.price * sale.quantity || 0;
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          total: 0,
          count: 0,
        };
      }
      
      acc[categoryName].total += total;
      acc[categoryName].count += 1;
      
      return acc;
    }, {});

    return Object.values(salesByCategory).sort((a, b) => b.total - a.total);
  }, [sales]);

  // Process data for monthly revenue chart
  const monthlyData = useMemo(() => {
    if (!sales || sales.length === 0) return [];

    const salesByMonth = sales.reduce((acc, sale) => {
      const date = new Date(sale.date || sale.createdAt);
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          revenue: 0,
          sales: 0,
        };
      }
      
      acc[monthKey].revenue += sale.total || sale.price * sale.quantity || 0;
      acc[monthKey].sales += 1;
      
      return acc;
    }, {});

    return Object.values(salesByMonth)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Show last 6 months
  }, [sales]);

  // Calculate total stats
  const stats = useMemo(() => {
    if (!sales || sales.length === 0) {
      return { totalRevenue: 0, totalSales: 0, averageSale: 0 };
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || sale.price * sale.quantity || 0), 0);
    const totalSales = sales.length;
    const averageSale = totalRevenue / totalSales;

    return {
      totalRevenue,
      totalSales,
      averageSale,
    };
  }, [sales]);

  if (!sales || sales.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <p className="text-slate-400">No sales data available to display charts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">₱{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <i className="fa-solid fa-dollar-sign text-4xl opacity-80"></i>
          </div>
        </div>
        <div className="bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lavender-100 text-sm font-medium">Total Sales</p>
              <p className="text-3xl font-bold mt-1">{stats.totalSales}</p>
            </div>
            <i className="fa-solid fa-chart-line text-4xl opacity-80"></i>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Average Sale</p>
              <p className="text-3xl font-bold mt-1">₱{stats.averageSale.toFixed(0).toLocaleString()}</p>
            </div>
            <i className="fa-solid fa-calculator text-4xl opacity-80"></i>
          </div>
        </div>
      </div>

      {/* Sales Over Time Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Sales Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              style={{ fontSize: "12px" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `₱${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value) => [`₱${value.toLocaleString()}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#f87171"
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category - Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `₱${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`₱${value.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="total" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution - Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="total"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) => `₱${value.toLocaleString()}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {monthlyData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                style={{ fontSize: "12px" }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `₱${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`₱${value.toLocaleString()}`, "Revenue"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f87171"
                strokeWidth={3}
                dot={{ fill: "#f87171", r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default SalesChart;

