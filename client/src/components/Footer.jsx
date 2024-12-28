import { CiFacebook, CiInstagram, CiLinkedin } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto p-4 flex flex-col-reverse lg:flex-row justify-between items-center gap-3">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        <div className="flex items-center justify-center gap-3 text-2xl">
          <Link to="" className="hover:text-secondary-100">
            <CiFacebook />
          </Link>
          <Link to="" className="hover:text-secondary-100">
            <CiInstagram />
          </Link>
          <Link to="" className="hover:text-secondary-100">
            <CiLinkedin />
          </Link>
        </div>
      </div>
    </footer>
  );
}
