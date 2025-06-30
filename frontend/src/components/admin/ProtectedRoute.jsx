import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "recruiter") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "recruiter") {
    return null; // prevent rendering protected content before redirect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
