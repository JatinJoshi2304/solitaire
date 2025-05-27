const ProfileAvatar = ({ image, alt }: { image: string; alt: string }) => (
  <div className="rounded-full bg-white w-24 h-24 border-2 border-green-800 overflow-hidden">
    <img
      className="w-full h-full object-cover"
      src={`../../public/profile/${image}`}
      alt={alt}
    />
  </div>
);

export default ProfileAvatar;
