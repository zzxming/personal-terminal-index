import './App.css';
import { Route, Routes } from 'react-router-dom';
import { route } from './route';
import 'antd/dist/antd.min.css';

function App() {


  return (
    <div className="App">
      <Routes>
        {
          route.map(r => <Route key={r.path} path={r.path} element={r.element} />)
        }
      </Routes>

    </div>
  );
}

export default App;
