import React, { useState } from 'react';
import { LogOut, Bell, User, BookOpen, Clock, Award, Shield } from 'lucide-react';
import { Student, Notification } from '../types';
import EvaceLogo from './EvaceLogo';

interface HeaderProps {
  student: Student;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearNotifications: () => void;
}

export default function Header({
  student,
  onLogout,
  notifications,
  onMarkNotificationAsRead,
  onClearNotifications
}: HeaderProps) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="w-full select-none" id="evace-primary-header">
      {/* Green Top Branding Bar */}
      <div className="bg-[#0a4d2c] text-white h-[66px] px-6 flex items-center justify-between shadow-md relative z-30">
        {/* EVACE Logo on Left */}
        <div className="flex items-center space-x-3 cursor-pointer group" id="brand-logo-container">
          <EvaceLogo size="md" variant="light" />
        </div>

        {/* Power Logout Button on Right of Green Bar */}
        <button
          onClick={onLogout}
          id="btn-evace-logout"
          className="text-white hover:text-green-200 p-2 rounded-full hover:bg-white/10 transition-all focus:outline-none"
          title="Sair do Portal"
        >
          <LogOut className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Floating Student greeting & secondary action controls */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0" id="secondary-greeting-bar">
        {/* Breadcrumb or sub-title */}
        <div className="flex items-center space-x-2 text-xs text-emerald-900/60 font-semibold uppercase tracking-wider">
          <span>Portal do Aluno</span>
          <span>•</span>
          <span>Cursos Ativos</span>
        </div>

        {/* Floating Greeting cards, avatar and notifications */}
        <div className="flex items-center space-x-4 self-end md:self-auto relative" id="student-actions-area">
          <span className="text-gray-700 font-medium text-[15px]" id="student-welcome-text">
            Bem-vindo!
          </span>

          {/* Student initials avatar */}
          <div 
            className="w-9 h-9 bg-gradient-to-tr from-[#0a4d2c] to-emerald-400 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-white"
            title={`${student.name} (${student.enrollmentId})`}
          >
            {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>

          {/* Notifications Trigger with unread counter */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              id="btn-notifications-toggle"
              className={`p-2 rounded-full hover:bg-white/80 transition-all border border-gray-200 shadow-xs relative ${showNotifMenu ? 'bg-white text-[#0a4d2c] border-emerald-300' : 'bg-white/50 text-gray-600'}`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifMenu && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
                id="notifications-dropdown"
              >
                <div className="px-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm">Notificações</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={onClearNotifications}
                      className="text-xs text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-gray-400 text-xs flex flex-col items-center justify-center">
                      <Shield className="w-8 h-8 opacity-40 mb-2" />
                      Não há notificações
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => onMarkNotificationAsRead(notif.id)}
                        className={`px-4 py-3 hover:bg-emerald-50/50 transition-colors flex space-x-3 cursor-pointer border-b border-gray-55 last:border-0 ${!notif.read ? 'bg-emerald-50/20' : ''}`}
                      >
                        <div className="mt-1">
                          {notif.type === 'grade' && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          )}
                          {notif.type === 'schedule' && (
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          )}
                          {notif.type === 'general' && (
                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs text-gray-700 ${!notif.read ? 'font-semibold' : ''}`}>
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {notif.date}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
