import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // بيانات افتراضية للأطباء
  useEffect(() => {
    const dummyDoctors = [
      { id: '1', name: 'د. أحمد محمد', specialty: 'أسنان' },
      { id: '2', name: 'د. سارة خالد', specialty: 'جلدية' },
      { id: '3', name: 'د. علي حسن', specialty: 'عظام' },
      { id: '4', name: 'د. لمى عبدالله', specialty: 'أطفال' }
    ];
    setDoctors(dummyDoctors);
  }, []);

  // توليد أوقات افتراضية عند اختيار طبيب
  useEffect(() => {
    if (selectedDoctor) {
      const slots = [];
      const startTime = 9; // 9 AM
      
      for (let i = 0; i < 8; i++) {
        const time = startTime + i;
        slots.push({
          id: `${selectedDoctor}-${time}`,
          time: `${time}:00 - ${time + 1}:00`,
          available: Math.random() > 0.3 // 70% فرصة أن يكون الموعد متاحاً
        });
      }
      
      setAvailableSlots(slots);
    }
  }, [selectedDoctor]);

  const handleDoctorSelect = (e) => {
    setSelectedDoctor(e.target.value);
    setSelectedSlot('');
  };

  const handleSlotSelect = (slotId) => {
    setSelectedSlot(slotId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // محاكاة إرسال البيانات إلى الخادم
    setTimeout(() => {
      const newBooking = {
        id: Date.now(),
        doctor: doctors.find(d => d.id === selectedDoctor).name,
        slot: availableSlots.find(s => s.id === selectedSlot).time,
        patient: { ...patientInfo },
        date: new Date().toLocaleDateString('ar-SA')
      };
      
      setBookings(prev => [...prev, newBooking]);
      setMessage('تم حجز الموعد بنجاح!');
      setIsLoading(false);
      
      // إعادة تعيين النموذج
      setSelectedDoctor('');
      setSelectedSlot('');
      setPatientInfo({
        name: '',
        phone: '',
        email: ''
      });
      
      // إخفاء الرسالة بعد 3 ثوان
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="app">
      <header>
        <h1>نظام حجز مواعيد العيادة</h1>
      </header>
      
      <main>
        <div className="booking-form">
          <h2>حجز موعد جديد</h2>
          
          {message && <div className="message">{message}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>اختر الطبيب:</label>
              <select 
                value={selectedDoctor} 
                onChange={handleDoctorSelect}
                required
              >
                <option value="">-- اختر طبيب --</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedDoctor && (
              <div className="form-group">
                <label>اختر الوقت:</label>
                <div className="time-slots">
                  {availableSlots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`slot ${!slot.available ? 'unavailable' : ''} ${selectedSlot === slot.id ? 'selected' : ''}`}
                      onClick={() => slot.available && handleSlotSelect(slot.id)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                      {!slot.available && <span>محجوز</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedSlot && (
              <>
                <div className="form-group">
                  <label>اسم المريض:</label>
                  <input
                    type="text"
                    name="name"
                    value={patientInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>رقم الجوال:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={patientInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>البريد الإلكتروني:</label>
                  <input
                    type="email"
                    name="email"
                    value={patientInfo.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'جاري الحفظ...' : 'تأكيد الحجز'}
                </button>
              </>
            )}
          </form>
        </div>
        
        {bookings.length > 0 && (
          <div className="bookings-list">
            <h2>الحجوزات السابقة</h2>
            <table>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>الطبيب</th>
                  <th>الوقت</th>
                  <th>اسم المريض</th>
                  <th>رقم الجوال</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.date}</td>
                    <td>{booking.doctor}</td>
                    <td>{booking.slot}</td>
                    <td>{booking.patient.name}</td>
                    <td>{booking.patient.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
