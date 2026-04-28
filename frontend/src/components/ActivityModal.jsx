import { useState } from 'react';
import '../styles/Modal.css';

export default function ActivityModal({ isOpen, onClose, onSave, activity }) {
  const [title, setTitle] = useState(activity?.activity_name || '');
  const [date, setDate] = useState(activity?.activity_date || '');
  const [time, setTime] = useState(activity?.activity_time || '');
  const [description, setDescription] = useState(activity?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✅ ส่ง field ที่ backend expect
    onSave({
      activity_name: title,
      activity_date: date,
      activity_time: time,
      description: description,
    });

    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{activity ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อกิจกรรมหรือการนัดหมาย *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="เช่น ประชุมทีม"
            />
          </div>

          <div className="form-group">
            <label>วันที่ของกิจกรรมหรือเวลานัดหมาย *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>เวลาที่เริ่มกิจกรรมหรือเวลานัดหมาย *</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>รายละเอียดเพิ่มเติม</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เพิ่มรายละเอียด (ไม่จำเป็น)"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              {activity ? 'บันทึกการแก้ไข' : 'บันทึกกิจกรรม'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}