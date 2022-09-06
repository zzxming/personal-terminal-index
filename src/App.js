import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Terminal from './pages/terminal';
import Test from './pages/test';
import { route } from './route';
import 'antd/dist/antd.css';

function App() {


  return (
    <div className="App">
      

      {/* <Test /> */}


      
      {/* <Routes>
        <Route path='/index' element={<Terminal />} />
        <Route path='/test' element={<Test />} />
        <Route path='*' element={<Navigate to="/index" />} />
      </Routes> */}

      <Routes>
        {
          route.map(r => <Route key={r.path} path={r.path} element={r.element} />)
        }
      </Routes>

    </div>
  );
}

export default App;
