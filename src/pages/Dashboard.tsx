import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Users, TrendingUp, Calendar, Zap, ArrowUpRight } from 'lucide-react';
import './Dashboard.css';

const AnimatedCounter: React.FC<{value: number}> = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);
  return <>{count}</>;
};

export const Dashboard: React.FC = () => {
  const students = useStore((state) => state.students);

  const total = students.length;
  const now = new Date();
  
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const newToday = students.filter(s => new Date(s.created_at) >= startOfToday).length;
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const newThisMonth = students.filter(s => new Date(s.created_at) >= startOfMonth).length;

  const newLeads = students.filter(s => s.status === 'New Lead').length;
  const beginnersCount = students.filter(s => s.skill_level === 'I am completely new').length;

  const recentStudents = students.slice(0, 5);

  const getStatusBadgeClass = (status: string) => {
    return `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h2>Overview</h2>
          <p className="subtitle">Real-time metrics for Shahi Coaching</p>
        </div>
      </div>

      <div className="bento-grid">
        <div className="bento-card bento-hero card">
          <div className="bento-bg-gradient"></div>
          <div className="bento-content">
            <div className="stat-icon-wrapper bento-icon-primary">
              <Users size={24} />
            </div>
            <div className="stat-text-area">
              <p className="stat-label">Total Registrations</p>
              <h3 className="stat-value hero-value"><AnimatedCounter value={total} /></h3>
            </div>
            <div className="bento-trend primary-trend">
              <ArrowUpRight size={16} /> +12% this month
            </div>
          </div>
        </div>

        <div className="bento-card card">
          <div className="bento-content">
            <div className="stat-icon-wrapper bento-icon-secondary">
              <Zap size={20} />
            </div>
            <div className="stat-text-area">
              <p className="stat-label">Today's Registrations</p>
              <h3 className="stat-value"><AnimatedCounter value={newToday} /></h3>
            </div>
          </div>
        </div>

        <div className="bento-card card">
          <div className="bento-content">
            <div className="stat-icon-wrapper bento-icon-tertiary">
              <Calendar size={20} />
            </div>
            <div className="stat-text-area">
              <p className="stat-label">This Month</p>
              <h3 className="stat-value"><AnimatedCounter value={newThisMonth} /></h3>
            </div>
          </div>
        </div>

        <div className="bento-card card">
          <div className="bento-content">
            <div className="stat-icon-wrapper bento-icon-quaternary">
              <TrendingUp size={20} />
            </div>
            <div className="stat-text-area">
              <p className="stat-label">New Leads</p>
              <h3 className="stat-value"><AnimatedCounter value={newLeads} /></h3>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="recent-header">
          <h3>Recent Activity</h3>
          <button className="btn-secondary">View All</button>
        </div>
        <div className="table-card card">
          <div className="table-responsive">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>City</th>
                  <th>Skill Level</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="font-medium text-main">{student.full_name}</td>
                    <td className="text-muted">{student.city}</td>
                    <td>
                      <span className="skill-badge">{student.skill_level}</span>
                    </td>
                    <td className="text-muted">{new Date(student.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={getStatusBadgeClass(student.status || 'New Lead')}>
                        {student.status || 'New Lead'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
