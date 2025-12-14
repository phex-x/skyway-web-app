import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import FlightSearchTab from '../components/FlightSearchTab';
import ManageBookingTab from '../components/ManageBookingTab';
import FlightStatusTab from '../components/FlightStatusTab';
import tagIcon from '../assets/images/бирка.png';
import clockIcon from '../assets/images/часы.png';
import airplaneIcon from '../assets/images/самолет.png'

const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: '#004758',
      padding: '15px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 10,
      position: 'relative'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '40px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      backgroundColor: '#fff',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/images/logo.png)',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    },
    logoText: {
      display: 'flex',
      flexDirection: 'column',
      color: '#fff'
    },
    logoMain: {
      fontSize: '18px',
      fontWeight: 'bold',
      lineHeight: '1.2'
    },
    logoSub: {
      fontSize: '12px',
      lineHeight: '1.2'
    },
    nav: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center'
    },
    navLink: {
      color: '#fff',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'opacity 0.3s'
    },
    loginButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '4px',
      transition: 'background-color 0.3s'
    },
    mapContainer: {
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 60px)',
      backgroundColor: '#0f3460',
      backgroundImage: 'url(/images/world-map.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      paddingBottom: 0
    },
    searchPanel: {
      position: 'relative',
      width: '95%',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px 8px 0 0',
      padding: '0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column'
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #e0e0e0',
      padding: '0 20px',
      height: '25%',
      minHeight: '50px',
      boxSizing: 'border-box',
      alignItems: 'center'
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '15px 20px',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '3px solid transparent',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#666',
      transition: 'all 0.3s'
    },
    tabActive: {
      color: '#000',
      borderBottomColor: '#B79C72'
    },
    tabIcon: {
      width: '18px',
      height: '18px',
      objectFit: 'contain'
    },
    tabContent: {
      padding: '0',
      height: '75%',
      minHeight: '150px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    userName: {
      color: '#fff',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}></div>
            <div style={styles.logoText}>
              <div style={styles.logoMain}>SKYWAY</div>
              <div style={styles.logoSub}>AIRLINES</div>
            </div>
          </div>
          <nav style={styles.nav}>
            <a 
              href="#" 
              style={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                navigate('/booking-search');
              }}
            >
              БРОНИРОВАНИЕ
            </a>
            <a 
              href="#" 
              style={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                navigate('/manage-booking');
              }}
            >
              УПРАВЛЕНИЕ
            </a>
            <a 
              href="#" 
              style={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                navigate('/destinations');
              }}
            >
              НАПРАВЛЕНИЯ
            </a>
            <a href="/about" style={styles.navLink}>ОБ АВТОРЕ</a>
          </nav>
        </div>
        <div style={styles.userInfo}>
          {isAuthenticated && user ? (
            <>
              <span style={styles.userName}>{user.firstName} {user.lastName}</span>
              <button 
                onClick={() => navigate('/profile')} 
                style={styles.loginButton}
                title="Профиль"
              >
                <img src="/images/profile-icon.png" alt="Profile" style={{ width: '20px', height: '20px' }} />
                <span>Профиль</span>
              </button>
              <button onClick={handleLogout} style={styles.loginButton}>
                <span>Выход</span>
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} style={styles.loginButton}>
              <img src="/images/profile-icon.png" alt="Login" style={{ width: '20px', height: '20px' }} />
              <span>ВХОД</span>
            </button>
          )}
        </div>
      </div>

      <div style={styles.mapContainer}>
        <div style={styles.searchPanel}>
          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'search' ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab('search')}
            >
              <img src={airplaneIcon} alt="Search" style={styles.tabIcon} />
              <span>Поиск рейсов</span>
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'manage' ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab('manage')}
            >
              <img src={tagIcon} alt="Manage" style={styles.tabIcon} />
              <span>Управление бронированием</span>
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'status' ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab('status')}
            >
              <img src={clockIcon} alt="Status" style={styles.tabIcon} />
              <span>Статус рейса</span>
            </button>
          </div>
          <div style={styles.tabContent}>
            {activeTab === 'search' && <FlightSearchTab />}
            {activeTab === 'manage' && <ManageBookingTab />}
            {activeTab === 'status' && <FlightStatusTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
