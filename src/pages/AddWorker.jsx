import { useState, useEffect, useMemo } from "react";
import { addWorker, getWorkers } from "../services/api";
import Sidebar from "../components/Sidebar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

import "../styles/addWorker.css";

function AddWorker() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);

      const data = await getWorkers(userId);

      setWorkers(data);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone) {
      setMessage({
        text: "Please enter worker name and phone number.",
        type: "warn",
      });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      setMessage({
        text: "Enter a valid 10-digit phone number.",
        type: "warn",
      });
      return;
    }

    try {
      setAdding(true);

      await addWorker({
        name,
        phone,
        userId,
      });

      setMessage({
        text: "Worker added successfully.",
        type: "success",
      });

      setName("");
      setPhone("");

      fetchWorkers();
          } catch (error) {
                  console.error(error);

      setMessage({
        text: "Failed to add worker.",
        type: "error",
      });
    } finally {
      setAdding(false);

      setTimeout(() => {
        setMessage({
          text: "",
          type: "",
        });
      }, 3000);
    }
  };

  const workersByMonth = useMemo(() => {
    const map = {};

    workers.forEach((worker) => {
      const date = new Date(worker.createdAt);

      const key = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([month, count]) => ({
      month,
      count,
    }));
  }, [workers]);

  const paymentData = useMemo(() => {
    return workers
      .map((worker) => ({
        name: worker.name.split(" ")[0],

        total:
          worker.payments?.reduce(
            (sum, payment) => sum + (payment.amount || 0),
            0
          ) || 0,

        count: worker.payments?.length || 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [workers]);

  const totalPaid = workers.reduce(
    (sum, worker) =>
      sum +
      (worker.payments?.reduce(
        (s, payment) => s + (payment.amount || 0),
        0
      ) || 0),
    0
  );

  const totalTransactions = workers.reduce(
    (sum, worker) => sum + (worker.payments?.length || 0),
    0
  );

  const averagePaid =
    workers.length > 0
      ? Math.round(totalPaid / workers.length)
      : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="aw-tooltip">
        <span className="aw-tooltip-label">{label}</span>

        {payload.map((item, index) => (
          <span key={index} style={{ color: item.color }}>
            {item.name} :
            {item.name === "total"
              ? ` ₹${item.value.toLocaleString()}`
              : ` ${item.value}`}
          </span>
        ))}
      </div>
    );
  };

  return (
        <div className="aw-layout">
      <Sidebar />

      <div className="aw-page">

        {/* ================= LEFT PANEL ================= */}

        <aside className="aw-left">

          <div className="aw-header">
            <div className="aw-header-eyebrow">
              GOOD MORNING 🌿
            </div>

            <h1 className="aw-title">
              Add
              <span className="aw-title-accent">
                {" "}Worker
              </span>
            </h1>

            <p className="aw-subtitle">
              Register a new worker into your Daily Wage
              Management System.
            </p>
          </div>

          {/* ================= FORM ================= */}

          <div className="aw-form-card">

            <div className="aw-form-card-header">
              <div className="aw-form-card-dot" />
              <span>WORKER INFORMATION</span>
            </div>

            <div className="aw-field">

              <label className="aw-label">
                Worker Name
              </label>

              <input
                className="aw-input"
                type="text"
                placeholder="Enter worker name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmit()
                }
              />

            </div>

            <div className="aw-field">

              <label className="aw-label">
                Phone Number
              </label>

              <input
                className="aw-input"
                type="tel"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmit()
                }
              />

            </div>

            <button
              className={`aw-submit-btn ${
                adding ? "aw-submit-btn--loading" : ""
              }`}
              onClick={handleSubmit}
              disabled={adding}
            >
              {adding ? (
                <span className="aw-spinner" />
              ) : (
                <>
                  ➕ Add Worker
                </>
              )}
            </button>

            {message.text && (
              <div
                className={`aw-message aw-message--${message.type}`}
              >
                {message.text}
              </div>
            )}

          </div>

          {/* ================= WORKER LIST ================= */}

          <div className="aw-list-card">

            <div className="aw-list-header">
              <span className="aw-list-title">
                RECENT WORKERS
              </span>

              <span className="aw-list-badge">
                {workers.length}
              </span>
            </div>
                          <div className="aw-list-loading">

                {[1,2,3].map((item)=>(
                  <div
                    key={item}
                    className="aw-skeleton"
                  />
                ))}

              </div>

            ) : workers.length === 0 ? (

              <div className="aw-empty">

                <h3>No Workers</h3>

                <p>
                  Add your first worker to get started.
                </p>

              </div>

            ) : (

              <div className="aw-roster">

                {workers.map((worker,index)=>(
                  <div
                    key={worker._id}
                    className="aw-roster-item"
                  >

                    <div className="aw-roster-avatar">
                      {worker.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="aw-roster-info">

                      <span className="aw-roster-name">
                        {worker.name}
                      </span>

                      <span className="aw-roster-phone">
                        {worker.phone}
                      </span>

                    </div>

                    <div className="aw-roster-indicator"/>

                  </div>
                ))}

              </div>

            )

          </div>

          <button
            className="aw-back-btn"
            onClick={() => window.history.back()}
          >
            ← Dashboard
          </button>

        </aside>

        {/* ================= RIGHT SIDE ================= */}

        <main className="aw-right">

          <div className="aw-right-header">

            <span className="aw-right-eyebrow">
              TODAY'S SUMMARY
            </span>

            <h2 className="aw-right-title">
              Workforce Overview
            </h2>

          </div>

          <div className="aw-kpis">

            <div className="aw-kpi">

              <div className="aw-kpi-icon">
                👷
              </div>

              <span className="aw-kpi-val">
                {workers.length}
              </span>

              <span className="aw-kpi-lbl">
                Total Workers
              </span>

            </div>

            <div className="aw-kpi">

              <div className="aw-kpi-icon">
                💰
              </div>

              <span className="aw-kpi-val">
                ₹{totalPaid.toLocaleString()}
              </span>

              <span className="aw-kpi-lbl">
                Total Paid
              </span>

            </div>

            <div className="aw-kpi">

              <div className="aw-kpi-icon">
                📋
              </div>

              <span className="aw-kpi-val">
                {totalTransactions}
              </span>

              <span className="aw-kpi-lbl">
                Transactions
              </span>

            </div>

            <div className="aw-kpi">

              <div className="aw-kpi-icon">
                📈
              </div>

              <span className="aw-kpi-val">
                ₹{averagePaid.toLocaleString()}
              </span>

              <span className="aw-kpi-lbl">
                Average Payment
              </span>

            </div>

          </div>
                    {/* ================= CHARTS ================= */}

          <div className="aw-charts">

            <div className="aw-chart-card">

              <div className="aw-chart-header">

                <span className="aw-chart-title">
                  Worker Growth
                </span>

                <span className="aw-chart-sub">
                  Monthly registrations
                </span>

              </div>

              {workersByMonth.length === 0 ? (

                <div className="aw-chart-empty">
                  No worker data available.
                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height={220}
                >

                  <AreaChart
                    data={workersByMonth}
                  >

                    <defs>

                      <linearGradient
                        id="growth"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#8FAF84"
                          stopOpacity={0.5}
                        />

                        <stop
                          offset="100%"
                          stopColor="#8FAF84"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="month"
                    />

                    <YAxis />

                    <Tooltip
                      content={<CustomTooltip />}
                    />

                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#6F8C67"
                      fill="url(#growth)"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              )}

            </div>

            <div className="aw-chart-card">

              <div className="aw-chart-header">

                <span className="aw-chart-title">
                  Top Payments
                </span>

                <span className="aw-chart-sub">
                  Worker Earnings
                </span>

              </div>

              {paymentData.length === 0 ? (

                <div className="aw-chart-empty">
                  No payment records.
                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height={220}
                >

                  <BarChart
                    data={paymentData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="name"
                    />

                    <YAxis />

                    <Tooltip
                      content={<CustomTooltip />}
                    />

                    <Bar
                      dataKey="total"
                      fill="#8FAF84"
                      radius={[8,8,0,0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>

          {/* ================= RECENT ACTIVITY ================= */}

          <div className="aw-activity-card">

            <div className="aw-chart-header">

              <span className="aw-chart-title">
                Recently Added
              </span>

              <span className="aw-chart-sub">
                Latest Workers
              </span>

            </div>

            <div className="aw-activity-list">

              {workers.slice(0,5).map((worker)=>(
                <div
                  key={worker._id}
                  className="aw-activity-item"
                >

                  <div className="aw-activity-avatar">
                    {worker.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="aw-activity-info">

                    <span className="aw-activity-name">
                      {worker.name}
                    </span>

                    <span className="aw-activity-meta">
                      {worker.phone}
                    </span>

                  </div>

                  <div className="aw-activity-pill">
                    Active
                  </div>

                </div>
              ))}

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

export default AddWorker;