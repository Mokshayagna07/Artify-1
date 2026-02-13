
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';

import TextToImage from './components/TextToImage';
import ImagePlusStyle from './components/ImagePlusStyle';
import Gallery from './components/Gallery';
import Favorites from './components/Favorites';
import Settings from './components/Settings';
import UserProfile from './components/UserProfile';
import Subscription from './components/Subscription';
import Security from './components/Security';
import Sidebar from './components/Sidebar';
import Login from './components/Login';

import { GalleryProvider } from './context/GalleryContext';
import { AuthProvider } from './context/AuthContext';
import './css/index.css';

function App() {
  return (
    <AuthProvider>
      <GalleryProvider>
        <Router>
          <div className="app">
            <div className="stars"></div>
            <Header />
            <div className="main-layout" style={{ display: 'flex', width: '100%', height: 'calc(100vh - 80px)', marginTop: '80px', overflow: 'hidden' }}>
              <Sidebar />
              <div className="page-content" style={{ flex: 1, paddingBottom: '2rem', overflowY: 'auto', height: '100%' }}>
                <Routes>
                  <Route path="/" element={<Hero />} />
                  <Route path="/text-to-image" element={<TextToImage />} />
                  <Route path="/image-plus-style" element={<ImagePlusStyle />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </GalleryProvider>
    </AuthProvider>
  );
}

export default App;
