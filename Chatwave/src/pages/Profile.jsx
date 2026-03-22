import "../styles/profile.css"

function Profile({ user, onBack }) {

  if (!user) {
    return <div className="profile-empty">Select a user</div>
  }

  return (
    <div className="profile-container">

      {/* BACK */}
      <button className="profile-back" onClick={onBack}>
        ← Back
      </button>

      {/* PROFILE CARD */}
      <div className="profile-card">

        <img
          src={user.profilePic || "https://i.pravatar.cc/150"}
          alt=""
          className="profile-img"
        />

        <h2>{user.name}</h2>

        <p className="status">🟢 Online</p>

        <p className="email">{user.email || "No email available"}</p>

        {/* ACTION BUTTONS */}
        <div className="profile-actions">
          <button>💬 Chat</button>
          <button>📹 Video</button>
          <button className="danger">🚫 Block</button>
        </div>

      </div>

    </div>
  )
}

export default Profile