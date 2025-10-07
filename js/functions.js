const meetingVerification = (startWork, endWork, startMeeting, durationMeeting)=>{
  const timeToMinutes = (timeStr) =>{
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours*60 + minutes;
  };
  return timeToMinutes(startMeeting) >= timeToMinutes(startWork) &&
  timeToMinutes(startMeeting) + durationMeeting <=timeToMinutes(endWork);
};

meetingVerification('08:00', '17:30', '14:00', 90); // true
meetingVerification('8:0', '10:0', '8:0', 120);     // true
meetingVerification('08:00', '14:30', '14:00', 90); // false
meetingVerification('14:00', '17:30', '08:0', 90);  // false
meetingVerification('8:00', '17:30', '08:00', 900); // false
