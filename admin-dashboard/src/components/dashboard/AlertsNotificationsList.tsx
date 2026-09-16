import React from 'react';
import { AlertTriangle, Download, CheckCircle2 } from 'lucide-react';

interface AlertsNotificationsListProps {
  onViewAll?: () => void;
}

export const AlertsNotificationsList: React.FC<AlertsNotificationsListProps> = ({ onViewAll }) => {
  const alerts = [
    {
      id: 'al1',
      icon: AlertTriangle,
      iconColor: 'bg-rose-50 text-rose-600',
      title: 'Low activity at Dhanbad Site',
      subtitle: 'Only 3 workers active',
      time: '10 mins ago',
    },
    {
      id: 'al2',
      icon: AlertTriangle,
      iconColor: 'bg-amber-50 text-amber-600',
      title: 'Module completion rate low',
      subtitle: 'Mine Equipment Safety (56%)',
      time: '30 mins ago',
    },
    {
      id: 'al3',
      icon: Download,
      iconColor: 'bg-blue-50 text-blue-600',
      title: 'New software update available',
      subtitle: 'Version 2.1.0',
      time: '1 hour ago',
    },
    {
      id: 'al4',
      icon: CheckCircle2,
      iconColor: 'bg-emerald-50 text-emerald-600',
      title: 'All systems operational',
      subtitle: 'No critical issues',
      time: '2 hours ago',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Alerts & Notifications</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3.5 my-auto">
        {alerts.map((al) => {
          const Icon = al.icon;
          return (
            <div key={al.id} className="flex items-start justify-between space-x-3">
              <div className="flex items-start space-x-3 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${al.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                    {al.title}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {al.subtitle}
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap shrink-0 pt-0.5">
                {al.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
