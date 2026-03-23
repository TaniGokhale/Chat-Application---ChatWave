import "../styles/profile.css"

function Profile({ user, onBack }) {

  if (!user) {
    return <div className="profile-empty">Select a user</div>
  }

  return (
    <div className="profile-container">

      <button className="profile-back" onClick={onBack}>
        ← Back
      </button>

      {/* PROFILE CARD */}
      <div className="profile-card">

        <img
          src={user.profilePic || "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"}
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