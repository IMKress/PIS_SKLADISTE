import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import logo from './img/logo.png';
import { API_URLS } from '../API_URL/getApiUrl';


function Navigacija() {
  const [userDetails, setUserDetails] = useState({ username: '', roles: [], UserId: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [artikliOpen, setArtikliOpen] = useState(false);
  const [dokumentiOpen, setDokumentiOpen] = useState(false);
  const [narudzbenicaOpen, setNarudzbenicaOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('Username');
    const roles = JSON.parse(localStorage.getItem('Role') || '[]');
    const UserId = localStorage.getItem('UserId');

    if (token) {
      setUserDetails({ username, roles, UserId });
    }

    const validateToken = async () => {
      if (token) {
        try {
          await axios.get(API_URLS.gArtikli, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Token validation failed:', error);
          setIsLoggedIn(false);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    validateToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      {/* Sidebar – stalno vidljiv */}
      <div className="sidebar">
       
        <ul className="sidebar-links ">
          <li><Link to="/PocetnaStranica">Početna</Link></li>
          <li>
            <div className="d-flex justify-content-between" onClick={() => setArtikliOpen(!artikliOpen)}>
              <Link to="/Stanja">Artikli</Link>
              <span style={{ cursor: 'pointer' }}>{artikliOpen ? '▲' : '▼'}</span>
            </div>
            {artikliOpen && (
              <ul className="submenu">
                <li><Link to="/DodajNoviArtikl">Dodaj Artikl</Link></li>
                <li><Link to="/dodajkategoriju">Dodaj Kategoriju</Link></li>
              </ul>
            )}
          </li>
          <li>
            <div className="d-flex justify-content-between" onClick={() => setDokumentiOpen(!dokumentiOpen)}>
              <Link to="/Dokumenti">Dokumenti</Link>
              <span style={{ cursor: 'pointer' }}>{dokumentiOpen ? '▲' : '▼'}</span>
            </div>
            {dokumentiOpen && (
              <ul className="submenu">
                <li><Link to="/Primka">Nova Primka</Link></li>
                <li><Link to="/Izdatnica">Nova Izdatnica</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/SkladistePodaci">Podaci o Skladištu</Link></li>
          <li>
            <div className="d-flex justify-content-between" onClick={() => setNarudzbenicaOpen(!narudzbenicaOpen)}>
              <Link to="/Narudzbenice">Narudžbenice</Link>
              <span style={{ cursor: 'pointer' }}>{narudzbenicaOpen ? '▲' : '▼'}</span>
            </div>
            {narudzbenicaOpen && (
              <ul className="submenu">
                <li><Link to="/NarudzbenicaNova">Nova Narudžbenica</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/Dobavljaci">Dobavljači</Link></li>
          <li><Link to="/Zaposlenici">Zaposlenici</Link></li>
          <li><Link to="/statistika">Statistika</Link></li>

        </ul>
      </div>

      {/* Topbar */}
      
      <div className="topbar">
        <img src={logo} alt="logo" className="navbar-logo ms-3 mt-2" />
        <span className="ms-auto">
          
          {isLoggedIn && `Trenutni račun: ${userDetails.username}`}
        </span>
        {isLoggedIn && (
          <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
        )}
      </div>

      {/* Glavni sadržaj */}
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
}

export default Navigacija;
