import React from "react";
import { useSelector } from "react-redux";

const PlayerInfo = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div>
      <h1>My Profile</h1>

      <p>
        <strong>Name:</strong> {user.name}
      </p>

      <p>
        <strong>WhatsApp Number:</strong> {user.whatsappNumber}
      </p>

      <p>
        <strong>Date of Birth:</strong> {user.dob}
      </p>

      <p>
        <strong>City:</strong> {user.city}
      </p>

      <p>
        <strong>Shirt Size:</strong> {user.shirtSize}
      </p>

      <p>
        <strong>Short Size:</strong> {user.shortSize}
      </p>

      <p>
        <strong>Food Preference:</strong> {user.foodPref}
      </p>

      <p>
        <strong>Accommodation:</strong> {user.stay}
      </p>

      <p>
        <strong>Fee Paid:</strong> {user.feePaid ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default PlayerInfo;
