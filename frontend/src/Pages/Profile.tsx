import { useParams } from "react-router-dom";

const Profile = () => {
  const { phonenumber } = useParams();
  //Not signed in needs to be handled
  return (
    <>
      <h1>Profile page</h1>
      <div>{phonenumber}</div>
    </>
  );
};

export default Profile;
