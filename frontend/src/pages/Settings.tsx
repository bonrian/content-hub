import { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Palette, Globe, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Lock },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
    { id: 'language', label: 'Ngôn ngữ', icon: Globe },
  ];

  const handleSave = () => {
    toast.success('Đã lưu cài đặt!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-purple-600" />
            Cài đặt
          </h1>
          <p className="text-gray-600">Quản lý tài khoản và tùy chỉnh ứng dụng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-purple-50 text-purple-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        placeholder="+84 xxx xxx xxx"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới thiệu
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Viết vài dòng về bản thân..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảo mật</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="pt-4 border-t">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700">Bật xác thực 2 yếu tố (2FA)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông báo</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900">Thông báo email</div>
                        <div className="text-sm text-gray-600">Nhận thông báo qua email</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600" />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900">Ý tưởng mới</div>
                        <div className="text-sm text-gray-600">Thông báo khi có ý tưởng mới</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600" />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900">Cập nhật hệ thống</div>
                        <div className="text-sm text-gray-600">Thông báo về tính năng mới</div>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-purple-600" />
                    </label>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Giao diện</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Chế độ hiển thị
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {['light', 'dark', 'auto'].map((mode) => (
                          <div
                            key={mode}
                            className="border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors"
                          >
                            <div className="text-sm font-medium capitalize">{mode === 'light' ? 'Sáng' : mode === 'dark' ? 'Tối' : 'Tự động'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Màu chủ đạo
                      </label>
                      <div className="flex gap-3">
                        {['purple', 'blue', 'green', 'pink', 'orange'].map((color) => (
                          <button
                            key={color}
                            className={`w-10 h-10 rounded-full bg-${color}-600 hover:ring-4 ring-${color}-200 transition-all`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Tab */}
              {activeTab === 'language' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Ngôn ngữ</h2>
                  <div className="space-y-3">
                    {[
                      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
                      { code: 'en', name: 'English', flag: '🇺🇸' },
                      { code: 'ja', name: '日本語', flag: '🇯🇵' },
                    ].map((lang) => (
                      <label
                        key={lang.code}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
                      >
                        <input type="radio" name="language" defaultChecked={lang.code === 'vi'} className="w-4 h-4" />
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium text-gray-900">{lang.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

