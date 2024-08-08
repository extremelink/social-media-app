import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import { UserProvider } from "../context";

export default function MyApp({ Component, pageProps }) {
    return(
        <UserProvider>
            {/* the whole application has access to user context */}
            <Nav />
            <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            <Component {...pageProps} />

        </UserProvider>
    )
    
  }