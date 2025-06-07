import { useState } from "react";
import ProfileAvatar from "../../components/ProfileAvatar";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Ponyo",
    email: "ponyo@gmail.com",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Blue wave background */}
        <div className="relative h-32 bg-blue-600">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600"></div>
        </div>

        {/* Profile image container */}
        <div className="relative -mt-16 flex justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
            <ProfileAvatar
              name={user.username}
              email={user.email}
              size="lg"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Profile content */}
        <div className="pt-4 pb-6 px-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {user.username ?? user.email?.split("@")[0]}
          </h2>

          {/* Email */}
          <div className="text-blue-600 text-sm font-medium">{user.email}</div>
        </div>
      </div>
    </div>
  );
}
