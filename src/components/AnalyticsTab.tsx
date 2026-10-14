import { useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, ShoppingBag, IndianRupee, Users,
  Package, Star, Award, AlertCircle, Calendar, ChevronLeft, ChevronRight,
  RotateCcw, Sparkles
} from 'lucide-react';
import { Order } from '@/types';

interface AnalyticsTabProps {
  orders: Order[];
}

type Period = 'daily' | 'monthly' | 'yearly' | 'all';

const COLORS = ['#4ade80', '#60a5fa', '#f472b6', '#fb923c', '#a78bfa', '#34d399', '#fbbf24'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

const toValidDate = (val: any): Date | null => {
  if (!val) return null;
  const d = val instanceof Date ? val : new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-xl p-3 shadow-lg text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey === 'revenue' ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

const PieCustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-xl p-3 shadow-lg text-sm">
      <p className="font-medium">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }}>
        {payload[0].value} orders ({payload[0].payload.pct}%)
      </p>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color: string;
}

const KPICard = ({ title, value, sub, icon, trend, trendLabel = 'vs last period', color }: KPICardProps) => (
  <div className="card-herbal p-5 flex flex-col gap-3 transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
    {trend !== undefined && (
      <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        <span>{Math.abs(trend)}% {trendLabel}</span>
      </div>
    )}
  </div>
);

const AnalyticsTab = ({ orders }: AnalyticsTabProps) => {
  const now = new Date();
  const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentYearNum = now.getFullYear();

  // Filter States
  const [period, setPeriod] = useState<Period>('monthly');
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState<number>(currentYearNum);

  // Available distinct years from all orders data
  const availableYears = useMemo(() => {
    const yearSet = new Set<number>();
    yearSet.add(now.getFullYear());
    orders.forEach(o => {
      const d = toValidDate(o.createdAt);
      if (d) yearSet.add(d.getFullYear());
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [orders]);

  // Derive active date ranges for Current and Previous comparison periods
  const { currentRange, prevRange, periodTitle, trendSuffix } = useMemo(() => {
    if (period === 'daily') {
      const parts = selectedDate.split('-').map(Number);
      const y = parts[0] || now.getFullYear();
      const m = parts[1] || now.getMonth() + 1;
      const d = parts[2] || now.getDate();

      const start = new Date(y, m - 1, d, 0, 0, 0, 0);
      const end = new Date(y, m - 1, d + 1, 0, 0, 0, 0);

      const prevStart = new Date(y, m - 1, d - 1, 0, 0, 0, 0);
      const prevEnd = new Date(y, m - 1, d, 0, 0, 0, 0);

      const title = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return {
        currentRange: { start, end },
        prevRange: { start: prevStart, end: prevEnd },
        periodTitle: title,
        trendSuffix: 'vs previous day',
      };
    }

    if (period === 'monthly') {
      const parts = selectedMonth.split('-').map(Number);
      const y = parts[0] || now.getFullYear();
      const m = parts[1] || now.getMonth() + 1;

      const start = new Date(y, m - 1, 1, 0, 0, 0, 0);
      const end = new Date(y, m, 1, 0, 0, 0, 0);

      const prevStart = new Date(y, m - 2, 1, 0, 0, 0, 0);
      const prevEnd = new Date(y, m - 1, 1, 0, 0, 0, 0);

      const title = start.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      return {
        currentRange: { start, end },
        prevRange: { start: prevStart, end: prevEnd },
        periodTitle: title,
        trendSuffix: 'vs previous month',
      };
    }

    if (period === 'yearly') {
      const y = selectedYear || now.getFullYear();

      const start = new Date(y, 0, 1, 0, 0, 0, 0);
      const end = new Date(y + 1, 0, 1, 0, 0, 0, 0);

      const prevStart = new Date(y - 1, 0, 1, 0, 0, 0, 0);
      const prevEnd = new Date(y, 0, 1, 0, 0, 0, 0);

      return {
        currentRange: { start, end },
        prevRange: { start: prevStart, end: prevEnd },
        periodTitle: `Year ${y}`,
        trendSuffix: 'vs previous year',
      };
    }

    // All-time mode
    return {
      currentRange: null,
      prevRange: null,
      periodTitle: 'All Time',
      trendSuffix: '',
    };
  }, [period, selectedDate, selectedMonth, selectedYear]);

  // Filter orders for the selected period & previous period
  const { filteredOrders, prevOrders } = useMemo(() => {
    if (!currentRange) {
      return { filteredOrders: orders, prevOrders: [] };
    }

    const cur = orders.filter(o => {
      const d = toValidDate(o.createdAt);
      return d ? d >= currentRange.start && d < currentRange.end : false;
    });

    const prev = prevRange
      ? orders.filter(o => {
          const d = toValidDate(o.createdAt);
          return d ? d >= prevRange.start && d < prevRange.end : false;
        })
      : [];

    return { filteredOrders: cur, prevOrders: prev };
  }, [orders, currentRange, prevRange]);

  // Compute all analytics metrics reactively from filteredOrders
  const analytics = useMemo(() => {
    const revenue = filteredOrders.reduce((s, o) => s + (o.total || 0), 0);
    const paidRev = filteredOrders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.total || 0), 0);
    const ordCount = filteredOrders.length;
    const avg = ordCount ? Math.round(revenue / ordCount) : 0;
    const customers = new Set(filteredOrders.map(o => o.mobile).filter(Boolean)).size;

    // Trends vs previous period
    const prevRevenue = prevOrders.reduce((s, o) => s + (o.total || 0), 0);
    const prevOrdCount = prevOrders.length;
    const revTrend = prevRevenue ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : (prevOrders.length ? 0 : undefined);
    const ordTrend = prevOrdCount ? Math.round(((ordCount - prevOrdCount) / prevOrdCount) * 100) : (prevOrders.length ? 0 : undefined);

    // Chart Data depending on Period
    let chartData: { name: string; revenue: number; orders: number }[] = [];

    if (period === 'daily') {
      // 24 hours of that selected day
      const hoursMap: Record<string, { revenue: number; orders: number }> = {};
      for (let h = 0; h < 24; h++) {
        const key = `${String(h).padStart(2, '0')}:00`;
        hoursMap[key] = { revenue: 0, orders: 0 };
      }
      filteredOrders.forEach(o => {
        const d = toValidDate(o.createdAt);
        if (d) {
          const key = `${String(d.getHours()).padStart(2, '0')}:00`;
          if (hoursMap[key]) {
            hoursMap[key].revenue += o.total || 0;
            hoursMap[key].orders += 1;
          }
        }
      });
      chartData = Object.entries(hoursMap).map(([name, v]) => ({ name, ...v }));
    } else if (period === 'monthly') {
      // Days of the selected month
      const parts = selectedMonth.split('-').map(Number);
      const y = parts[0] || now.getFullYear();
      const m = parts[1] || now.getMonth() + 1;
      const daysInMonth = new Date(y, m, 0).getDate();

      const dayMap: Record<string, { revenue: number; orders: number }> = {};
      for (let i = 1; i <= daysInMonth; i++) {
        const key = String(i).padStart(2, '0');
        dayMap[key] = { revenue: 0, orders: 0 };
      }
      filteredOrders.forEach(o => {
        const d = toValidDate(o.createdAt);
        if (d) {
          const key = String(d.getDate()).padStart(2, '0');
          if (dayMap[key]) {
            dayMap[key].revenue += o.total || 0;
            dayMap[key].orders += 1;
          }
        }
      });
      chartData = Object.entries(dayMap).map(([name, v]) => ({ name, ...v }));
    } else if (period === 'yearly') {
      // 12 months of the selected year
      const monthMap: Record<string, { revenue: number; orders: number }> = {};
      MONTH_SHORT.forEach(name => {
        monthMap[name] = { revenue: 0, orders: 0 };
      });
      filteredOrders.forEach(o => {
        const d = toValidDate(o.createdAt);
        if (d) {
          const name = MONTH_SHORT[d.getMonth()];
          if (monthMap[name]) {
            monthMap[name].revenue += o.total || 0;
            monthMap[name].orders += 1;
          }
        }
      });
      chartData = Object.entries(monthMap).map(([name, v]) => ({ name, ...v }));
    } else {
      // All-time yearly trend
      const yearlyMap: Record<string, { revenue: number; orders: number }> = {};
      orders.forEach(o => {
        const d = toValidDate(o.createdAt);
        if (d) {
          const key = d.getFullYear().toString();
          if (!yearlyMap[key]) yearlyMap[key] = { revenue: 0, orders: 0 };
          yearlyMap[key].revenue += o.total || 0;
          yearlyMap[key].orders += 1;
        }
      });
      chartData = Object.entries(yearlyMap)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([name, v]) => ({ name, ...v }));
    }

    // Payment status pie for filtered orders
    const payMap: Record<string, number> = { paid: 0, pending: 0, pay_later: 0, failed: 0 };
    filteredOrders.forEach(o => {
      const s = o.paymentStatus || 'pending';
      payMap[s] = (payMap[s] || 0) + 1;
    });
    const payPie = [
      { name: 'Paid', value: payMap.paid, pct: ordCount ? Math.round((payMap.paid / ordCount) * 100) : 0, fill: '#4ade80' },
      { name: 'Pending', value: payMap.pending, pct: ordCount ? Math.round((payMap.pending / ordCount) * 100) : 0, fill: '#fb923c' },
      { name: 'Pay Later', value: payMap.pay_later, pct: ordCount ? Math.round((payMap.pay_later / ordCount) * 100) : 0, fill: '#fbbf24' },
      { name: 'Failed', value: payMap.failed, pct: ordCount ? Math.round((payMap.failed / ordCount) * 100) : 0, fill: '#f87171' },
    ].filter(d => d.value > 0);

    // Order status breakdown for filtered orders
    const statusMap: Record<string, number> = { pending: 0, processing: 0, shipped: 0, delivered: 0 };
    filteredOrders.forEach(o => {
      const s = o.status || 'pending';
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    const statusData = [
      { name: 'Pending', value: statusMap.pending, fill: '#fb923c' },
      { name: 'Processing', value: statusMap.processing, fill: '#60a5fa' },
      { name: 'Shipped', value: statusMap.shipped, fill: '#a78bfa' },
      { name: 'Delivered', value: statusMap.delivered, fill: '#4ade80' },
    ];

    // Category revenue for filtered orders
    const catRevMap: Record<string, number> = {};
    filteredOrders.forEach(o =>
      o.items?.forEach(item => {
        const cat = item.product?.category || 'herbal';
        catRevMap[cat] = (catRevMap[cat] || 0) + (item.product?.price || 0) * (item.quantity || 1);
      })
    );
    const catData = Object.entries(catRevMap)
      .map(([name, rev], i) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        revenue: rev,
        fill: COLORS[i % COLORS.length],
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Top products by sales for filtered orders
    const productQty: Record<string, { name: string; qty: number; revenue: number }> = {};
    filteredOrders.forEach(o =>
      o.items?.forEach(item => {
        if (!item.product) return;
        const key = item.product.id || item.product.name;
        if (!productQty[key]) productQty[key] = { name: item.product.name, qty: 0, revenue: 0 };
        productQty[key].qty += item.quantity || 1;
        productQty[key].revenue += (item.product.price || 0) * (item.quantity || 1);
      })
    );
    const productList = Object.values(productQty).sort((a, b) => b.qty - a.qty);
    const topProduct = productList[0] || null;

    // Top customers for filtered orders
    const custMap: Record<string, { name: string; mobile: string; orders: number; spent: number }> = {};
    filteredOrders.forEach(o => {
      const m = o.mobile || 'unknown';
      if (!custMap[m]) custMap[m] = { name: o.customerName || 'Customer', mobile: m, orders: 0, spent: 0 };
      custMap[m].orders += 1;
      custMap[m].spent += o.total || 0;
    });
    const topCustomers = Object.values(custMap).sort((a, b) => b.spent - a.spent).slice(0, 5);

    const deliveredCount = statusMap.delivered ?? 0;

    return {
      revenue,
      paidRev,
      ordCount,
      avg,
      customers,
      revTrend,
      ordTrend,
      chartData,
      payPie,
      statusData,
      catData,
      productList,
      topProduct,
      topCustomers,
      deliveredCount,
    };
  }, [filteredOrders, prevOrders, period, selectedMonth]);

  // Step backward / forward for Daily mode
  const handlePrevDay = () => {
    const parts = selectedDate.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2] - 1);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const handleNextDay = () => {
    const parts = selectedDate.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2] + 1);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  // Month & Year parsing for Month picker
  const [selMonthYear, selMonthNum] = useMemo(() => {
    const parts = selectedMonth.split('-').map(Number);
    return [parts[0] || now.getFullYear(), parts[1] || now.getMonth() + 1];
  }, [selectedMonth]);

  const activePeriods = analytics.chartData.filter(d => d.revenue > 0);
  const periodLabel = period === 'daily' ? 'hour' : period === 'monthly' ? 'day' : 'month';

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground card-herbal">
        <AlertCircle size={56} className="mb-4 opacity-40 text-primary" />
        <p className="text-lg font-medium text-foreground">No order data yet</p>
        <p className="text-sm mt-1">Analytics will automatically appear once orders are placed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">

      {/* Header Toolbar: Period selector & specific Date/Month/Year filters */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-foreground">Analytics & Insights</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                Live Data
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Filtered for <span className="font-semibold text-foreground">{periodTitle}</span> ({filteredOrders.length} orders found)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Period Toggle Tabs */}
            <div className="flex gap-1 bg-secondary rounded-xl p-1">
              {(['daily', 'monthly', 'yearly', 'all'] as Period[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    period === p
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                  }`}
                >
                  {p === 'all' ? 'All Time' : p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Selector Row based on selected Period */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Daily: Specific Date Picker */}
            {period === 'daily' && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
                  <Calendar size={14} className="text-primary" /> Date:
                </span>
                <button
                  onClick={handlePrevDay}
                  title="Previous Day"
                  className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors text-foreground"
                >
                  <ChevronLeft size={16} />
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="input-herbal py-1.5 px-3 text-sm font-medium"
                />
                <button
                  onClick={handleNextDay}
                  title="Next Day"
                  className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors text-foreground"
                >
                  <ChevronRight size={16} />
                </button>
                {selectedDate !== todayDateStr && (
                  <button
                    onClick={() => setSelectedDate(todayDateStr)}
                    className="flex items-center gap-1 text-xs text-primary font-medium hover:underline px-2 py-1 rounded bg-primary/10 transition-colors"
                  >
                    <RotateCcw size={12} /> Today
                  </button>
                )}
              </div>
            )}

            {/* 2. Monthly: Month and Year Dropdowns */}
            {period === 'monthly' && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
                  <Calendar size={14} className="text-primary" /> Month & Year:
                </span>
                <select
                  value={selMonthNum}
                  onChange={e => setSelectedMonth(`${selMonthYear}-${String(e.target.value).padStart(2, '0')}`)}
                  className="input-herbal py-1.5 px-3 text-sm font-medium"
                >
                  {MONTH_NAMES.map((name, i) => (
                    <option key={i} value={i + 1}>
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  value={selMonthYear}
                  onChange={e => setSelectedMonth(`${e.target.value}-${String(selMonthNum).padStart(2, '0')}`)}
                  className="input-herbal py-1.5 px-3 text-sm font-medium"
                >
                  {availableYears.map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                {selectedMonth !== currentMonthStr && (
                  <button
                    onClick={() => setSelectedMonth(currentMonthStr)}
                    className="flex items-center gap-1 text-xs text-primary font-medium hover:underline px-2 py-1 rounded bg-primary/10 transition-colors"
                  >
                    <RotateCcw size={12} /> Current Month
                  </button>
                )}
              </div>
            )}

            {/* 3. Yearly: Specific Year Dropdown */}
            {period === 'yearly' && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
                  <Calendar size={14} className="text-primary" /> Year:
                </span>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}
                  className="input-herbal py-1.5 px-3 text-sm font-medium"
                >
                  {availableYears.map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                {selectedYear !== currentYearNum && (
                  <button
                    onClick={() => setSelectedYear(currentYearNum)}
                    className="flex items-center gap-1 text-xs text-primary font-medium hover:underline px-2 py-1 rounded bg-primary/10 transition-colors"
                  >
                    <RotateCcw size={12} /> Current Year
                  </button>
                )}
              </div>
            )}

            {/* 4. All Time indicator */}
            {period === 'all' && (
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" /> Showing aggregated metrics across the entire store history.
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {filteredOrders.length === 0 ? (
              <span className="text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">No orders in this timeframe</span>
            ) : (
              <span>
                Total Period Sales:{' '}
                <strong className="text-green-600 font-bold">₹{analytics.revenue.toLocaleString()}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards — All reflect filtered period */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Revenue"
          value={fmt(analytics.revenue)}
          sub={`₹${analytics.paidRev.toLocaleString()} collected`}
          icon={<IndianRupee size={20} className="text-green-600" />}
          color="bg-green-100"
          trend={analytics.revTrend}
          trendLabel={trendSuffix}
        />
        <KPICard
          title="Orders"
          value={analytics.ordCount.toString()}
          sub={`for ${periodTitle}`}
          icon={<ShoppingBag size={20} className="text-blue-600" />}
          color="bg-blue-100"
          trend={analytics.ordTrend}
          trendLabel={trendSuffix}
        />
        <KPICard
          title="Avg. Order Value"
          value={analytics.avg ? `₹${analytics.avg.toLocaleString()}` : '—'}
          sub="per order"
          icon={<TrendingUp size={20} className="text-purple-600" />}
          color="bg-purple-100"
        />
        <KPICard
          title="Customers"
          value={analytics.customers.toString()}
          sub={`for ${periodTitle}`}
          icon={<Users size={20} className="text-orange-600" />}
          color="bg-orange-100"
        />
      </div>

      {/* Revenue & Orders Trend Chart */}
      <div className="card-herbal p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-display text-xl font-semibold">
              {period === 'daily' ? `${periodTitle} — Hourly Breakdown` :
               period === 'monthly' ? `${periodTitle} — Daily Breakdown` :
               period === 'yearly' ? `${periodTitle} — Monthly Breakdown` :
               'All-Time Yearly Revenue & Orders'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {period === 'daily' ? 'Hourly revenue & orders trend across 24 hours' :
               period === 'monthly' ? `Day-by-day distribution for ${periodTitle}` :
               period === 'yearly' ? `Month-by-month distribution across ${periodTitle}` :
               'Annual sales performance over time'}
            </p>
          </div>
          <span className="text-xs text-muted-foreground capitalize bg-secondary px-3 py-1 rounded-full font-medium self-start sm:self-auto">
            {periodTitle}
          </span>
        </div>

        {analytics.chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analytics.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis yAxisId="rev" orientation="left" tick={{ fontSize: 11 }} tickFormatter={v => fmt(v)} tickLine={false} axisLine={false} />
              <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#4ade80" fill="url(#revGrad)" strokeWidth={2} dot={false} />
              <Area yAxisId="ord" type="monotone" dataKey="orders" name="Orders" stroke="#60a5fa" fill="url(#ordGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-60 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            No chart data recorded for this timeframe
          </div>
        )}

        {/* Period Summary Footnote */}
        <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Period Revenue</p>
            <p className="font-bold text-green-600">₹{analytics.revenue.toLocaleString()}</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Period Orders</p>
            <p className="font-bold text-blue-600">{analytics.ordCount}</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Avg / {periodLabel}</p>
            <p className="font-bold text-foreground">
              ₹{activePeriods.length
                ? Math.round(analytics.revenue / activePeriods.length).toLocaleString()
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Status + Order Status (both reflect the filtered period) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-herbal p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Payment Status</h3>
              <span className="text-xs text-muted-foreground">in {periodTitle}</span>
            </div>

            {analytics.payPie.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={analytics.payPie} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {analytics.payPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip content={<PieCustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                No payment data for this period
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border">
            {analytics.payPie.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                <span className="text-muted-foreground">{d.name}:</span>
                <span className="font-semibold">{d.value} ({d.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-herbal p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Order Fulfillment</h3>
              <span className="text-xs text-muted-foreground">in {periodTitle}</span>
            </div>

            {filteredOrders.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics.statusData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Orders" radius={[6, 6, 0, 0]}>
                    {analytics.statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                No orders for this period
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border">
            {analytics.statusData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                <span className="text-muted-foreground">{d.name}:</span>
                <span className="font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Revenue + Top Products (both reflect the filtered period) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-herbal p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold">Revenue by Category</h3>
            <span className="text-xs text-muted-foreground">in {periodTitle}</span>
          </div>

          {analytics.catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.catData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => fmt(v)} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" radius={[0, 6, 6, 0]}>
                  {analytics.catData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
              No category sales in this period
            </div>
          )}
        </div>

        <div className="card-herbal p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold flex items-center gap-2">
              <Star size={18} className="text-yellow-500" />
              Top Products by Sales
            </h3>
            <span className="text-xs text-muted-foreground">in {periodTitle}</span>
          </div>

          {analytics.productList.length > 0 ? (
            <div className="space-y-3">
              {analytics.productList.slice(0, 6).map((p, i) => {
                const maxRev = analytics.productList[0]?.revenue || 1;
                const pct = Math.round((p.revenue / maxRev) * 100);
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-yellow-400 text-white' :
                          i === 1 ? 'bg-gray-400 text-white' :
                          i === 2 ? 'bg-amber-600 text-white' :
                          'bg-secondary text-foreground'
                        }`}>{i + 1}</span>
                        <span className="font-medium truncate max-w-[150px]">{p.name}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-primary font-semibold">₹{p.revenue.toLocaleString()}</span>
                        <span className="text-muted-foreground text-xs ml-2">×{p.qty} sold</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
              No product sales in this period
            </div>
          )}
        </div>
      </div>

      {/* Top Customers in Selected Period */}
      <div className="card-herbal p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-semibold flex items-center gap-2">
            <Award size={18} className="text-primary" />
            Top Customers
          </h3>
          <span className="text-xs text-muted-foreground">in {periodTitle}</span>
        </div>

        {analytics.topCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3 font-medium text-muted-foreground w-8">#</th>
                  <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                  <th className="pb-3 font-medium text-muted-foreground">Mobile</th>
                  <th className="pb-3 font-medium text-muted-foreground text-center">Orders</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {analytics.topCustomers.map((c, i) => (
                  <tr key={c.mobile} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3 text-muted-foreground">{i + 1}</td>
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3 text-muted-foreground">{c.mobile}</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {c.orders}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-primary">₹{c.spent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            No customer orders in this period
          </div>
        )}
      </div>

      {/* Quick Insights (Dynamically computed for the selected period) */}
      <div className="card-herbal p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-semibold flex items-center gap-2">
            <Package size={18} className="text-primary" />
            Period Insights
          </h3>
          <span className="text-xs text-muted-foreground">Summary for {periodTitle}</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.topProduct ? (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">🏆 Best Selling Product</p>
              <p className="font-bold text-foreground truncate">{analytics.topProduct.name}</p>
              <p className="text-sm text-primary mt-0.5">{analytics.topProduct.qty} units sold (₹{analytics.topProduct.revenue.toLocaleString()})</p>
            </div>
          ) : (
            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">🏆 Best Selling Product</p>
              <p className="font-bold text-muted-foreground">None</p>
              <p className="text-sm text-muted-foreground mt-0.5">No units sold in this period</p>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">💰 Collected Revenue</p>
            <p className="font-bold text-foreground">₹{analytics.paidRev.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {analytics.revenue ? Math.round((analytics.paidRev / analytics.revenue) * 100) : 0}% of period total
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">📦 Delivery Rate</p>
            <p className="font-bold text-foreground">
              {analytics.ordCount ? Math.round((analytics.deliveredCount / analytics.ordCount) * 100) : 0}%
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {analytics.deliveredCount} of {analytics.ordCount} orders delivered
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">⏳ Pending Collection</p>
            <p className="font-bold text-foreground">₹{(analytics.revenue - analytics.paidRev).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-0.5">unpaid / pay later orders in period</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">🔄 Repeat Customers</p>
            <p className="font-bold text-foreground">
              {analytics.topCustomers.filter(c => c.orders > 1).length}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">customers with 2+ orders in this period</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">📅 Period Overview</p>
            <p className="font-bold text-foreground">{analytics.ordCount} orders placed</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {analytics.customers} unique customers
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsTab;
