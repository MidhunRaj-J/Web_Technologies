import React from 'react';

const StudentProfile = () => {
  // Student details stored as JavaScript variables
  const name = "Jai Balayya";
  const department = 'CSE';
  const year = "3rd year";
  const section = "A";

  // Render student profile details using JSX
  return (
    <div className="profile-container">
      <h1>Student Profile</h1>
      
      <div className="profile-details">
        <h2>{name}</h2>
        
        <p>
          <strong>Department:</strong> {department}
        </p>
        
        <p>
          <strong>Year:</strong> {year}
        </p>
        
        <p>
          <strong>Section:</strong> {section}
        </p>
      </div>
    </div>
  );
};

// Export the component
export default StudentProfile;