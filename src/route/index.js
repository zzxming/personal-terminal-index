import { Navigate } from "react-router-dom";
import Terminal from "../pages/terminal";
import Test from "../pages/test";


export const route = [
    {
        path: '/index',
        element: <Terminal />
    }, {
        path: '/test',
        element: <Test />
    }, {
        path: '*',
        element: <Navigate to="/index"  />
    }
]
