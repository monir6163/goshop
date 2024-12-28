import { useSelector } from "react-redux";
import ProfileComponent from "../components/Profile";

export default function Profile() {
  const user = useSelector((state) => state.user);
  return (
    <>
      <ProfileComponent user={user} />
    </>
  );
}
