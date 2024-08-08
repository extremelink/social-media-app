import Link from "next/link";
import { UserContext } from "../context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Avatar } from "antd";

const Nav = () => {
  const [current, setCurrent] = useState("");
  const [state, setState] = useContext(UserContext);
  console.log(process.browser);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  console.log("current =>", current);

  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/");
  };

  return (
    <nav
      className="nav  d-flex justify-content-center py-3"
      style={{ backgroundColor: "blue" }}
    >
      <Avatar 
        src="/images/logo.png"
        style={{ width: '80px', height: '60px' }}  
      
      />
      <Link href="/" legacyBehavior>
        <a
          className={`${
            current === "/" ? "active" : "nav-link text-light"
          } fs-5 mx-2`}
        >
         MernCamp
        </a>
      </Link>
      {state !== null ? (
        <>
          <div className="dropdown">
            <button
              className="btn dropdown-toggle text-light fs-5"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {state && state.user && state.user.name}
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link href="/user/dashboard" legacyBehavior>
                  <a
                    className={`${
                      current === "/user/dashboard" ? "active" : "nav-link"
                    } fs-5 dropdown-item`}
                  >
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/user/profile/update" legacyBehavior>
                  <a
                    className={`${
                      current === "/user/profile/update" ? "active" : "nav-link"
                    } fs-5 dropdown-item`}
                  >
                    Profile
                  </a>
                </Link>
              </li>

              {state.user &&state.user.role === 'Admin' && (
                <li>
                <Link href="/admin" legacyBehavior>
                  <a
                    className={`${
                      current === "/admin" ? "active" : "nav-link"
                    } fs-5 dropdown-item`}
                  >
                    Admin
                  </a>
                </Link>
              </li>
              )}


              <li>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={logout}
                  className="nav-link dropdown-item text-dark fs-5"
                >
                  LogOut
                </a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <Link href="/login" legacyBehavior>
            <a
              className={`${
                current === "/login"
                  ? "active"
                  : "nav-link text-light"
              } fs-5 mx-2`}
            >
              Login
            </a>
          </Link>

          <Link href="/register" legacyBehavior>
            <a
              className={`${
                current === "/register"
                  ? "fs-3 active"
                  : "nav-link text-light fs-5"
              } mx-2`}
            >
              Register
            </a>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
