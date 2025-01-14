import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import { MeProvider } from './context/useMe';
import { ExamsProvider } from './context/useExams';
import { Toaster } from './components/ui/toaster';
import Statistics from './pages/Statistics';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";



function App() {
  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);
  return (
    <MeProvider>
     <ExamsProvider>
      <Router>
        <Routes>
          <Route path='/statistics' element={<Statistics/>} />
          <Route path='/' element={<Home/>} />
          <Route path='*' element={<Login/>} />
        </Routes>
      </Router>
      <Toaster />
     </ExamsProvider>
    </MeProvider>
  );
}




export default App;
