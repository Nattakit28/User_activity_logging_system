import { useState, useEffect } from 'react';
import ActivityModal from '../components/ActivityModal';
import api from '../services/api';
import '../styles/Home.css';

export default function Home() {
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getActivities();
      console.log('📊 Activities fetched:', data);
      
      // ✅ Ensure it's always an array
      setActivities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Failed to fetch activities:', error);
      setError('ไม่สามารถโหลดกิจกรรมได้');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleSaveActivity = async (formData) => {
    try {
      if (selectedActivity) {
        // ✅ Update activity
        await api.updateActivity(selectedActivity.id, formData);
        console.log('✏️ Activity updated:', selectedActivity.id);
        alert('✅ แก้ไขกิจกรรมสำเร็จ');
      } else {
        // ✅ Create new activity
        await api.createActivity(formData);
        console.log('➕ Activity created');
        alert('✅ เพิ่มกิจกรรมสำเร็จ');
      }
      
      setIsModalOpen(false);
      setSelectedActivity(null);
      await fetchActivities();
    } catch (error) {
      console.error('❌ Failed to save activity:', error);
      alert('❌ ไม่สามารถบันทึกกิจกรรมได้: ' + error.response?.data?.error);
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('คุณแน่ใจที่จะลบกิจกรรมนี้ไหม?')) return;

    try {
      await api.deleteActivity(id);
      console.log('🗑️ Activity deleted:', id);
      alert('✅ ลบกิจกรรมสำเร็จ');
      await fetchActivities();
    } catch (error) {
      console.error('❌ Failed to delete activity:', error);
      alert('❌ ไม่สามารถลบกิจกรรมได้');
    }
  };

  const handleLogout = () => {
    if (window.confirm('คุณแน่ใจที่จะออกจากระบบ?')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>📋 ระบบบันทึกกิจกรรมของผู้ใช้งาน</h1>
        <button onClick={handleLogout} className="btn-logout">
          ออกจากระบบ
        </button>
      </header>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="home-actions">
        <button onClick={handleAddActivity} className="btn-add">
          ➕ เพิ่มกิจกรรมใหม่
        </button>
      </div>

      <div className="activities-table-wrapper">
        {loading ? (
          <p className="loading-message">⏳ กำลังโหลดข้อมูล...</p>
        ) : activities && activities.length === 0 ? (
          <p className="empty-message">ยังไม่มีกิจกรรม กรุณาเพิ่มกิจกรรมใหม่</p>
        ) : (
          <table className="activities-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ชื่อกิจกรรม</th>
                <th>วันที่</th>
                <th>เวลา</th>
                <th>รายละเอียด</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={activity.id}>
                  <td>{index + 1}</td>
                  <td>{activity.activity_name}</td>
                  <td>{activity.activity_date}</td>
                  <td>{activity.activity_time}</td>
                  <td>{activity.description || '-'}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleEditActivity(activity)}
                      className="btn-edit"
                    >
                      ✏️ แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="btn-delete"
                    >
                      🗑️ ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(null);
        }}
        onSave={handleSaveActivity}
        activity={selectedActivity}
      />
    </div>
  );
}