import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'password'>('users');
  // Placeholder user data and handlers (replace with API integration)
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'staff1', role: 'staff' },
  ]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const handleAddUser = () => {
    // Add user logic (API call)
    setUsers([...users, { id: Date.now(), ...newUser }]);
    setNewUser({ username: '', password: '', role: 'staff' });
  };
  const handleDeleteUser = (id: number) => setUsers(users.filter(u => u.id !== id));
  const handleResetPassword = (id: number) => alert('Password reset (demo)');
  const handleChangePassword = () => alert('Password changed (demo)');

  return (
    <div className="p-8 animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>User Management</button>
        <button onClick={() => setTab('password')} className={`px-4 py-2 rounded ${tab === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Change Password</button>
      </div>
      {tab === 'users' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.username}</td>
                  <td className="p-2 capitalize">{u.role}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleResetPassword(u.id)} className="px-2 py-1 bg-yellow-500 text-white rounded">Reset Password</button>
                    {u.role !== 'admin' && <button onClick={() => handleDeleteUser(u.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex space-x-2 mb-2">
            <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} className="p-2 border rounded" />
            <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="p-2 border rounded" />
            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="p-2 border rounded">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleAddUser} className="px-4 py-2 bg-blue-600 text-white rounded">Add User</button>
          </div>
        </div>
      )}
      {tab === 'password' && (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="flex flex-col space-y-3">
            <input type="password" placeholder="Old Password" value={passwords.old} onChange={e => setPasswords({ ...passwords, old: e.target.value })} className="p-2 border rounded" />
            <input type="password" placeholder="New Password" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} className="p-2 border rounded" />
            <input type="password" placeholder="Confirm New Password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} className="p-2 border rounded" />
            <button onClick={handleChangePassword} className="px-4 py-2 bg-green-600 text-white rounded">Change Password</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 