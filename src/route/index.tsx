import { Navigate } from "react-router-dom";
import Terminal from "../pages/terminal";


export const route = [
    {
        path: '/index',
        element: <Terminal />
    }, {
        path: '*',
        element: <Navigate to="/index"  />
    }
]
