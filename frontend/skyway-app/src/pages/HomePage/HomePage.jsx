import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useState } from 'react';
import FlightSearchTab from '../../components/FlightSearchTab/FlightSearchTab';
import ManageBookingTab from '../../components/ManageBookingTab/ManageBookingTab';
import tagIcon from '../../assets/images/бирка.png';
import airplaneIcon from '../../assets/images/самолет.png';
import { getGreetingByTime } from '../../services/HelloService';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };


  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
            <div className={styles.logoText}>
              <div className={styles.logoMain}>SKYWAY</div>
              <div className={styles.logoSub}>AIRLINES</div>
            </div>
          </div>
          <nav className={styles.nav}>
            <a 
              href="#" 
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                navigate('/booking-search');
              }}
            >
              БРОНИРОВАНИЕ
            </a>
            <a 
              href="#" 
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                navigate('/manage-booking');
              }}
            >
              УПРАВЛЕНИЕ
            </a>
            <a 
              href="#" 
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                navigate('/destinations');
              }}
            >
              НАПРАВЛЕНИЯ
            </a>
            <a href="/about" className={styles.navLink}>ОБ АВТОРЕ</a>
          </nav>
        </div>
        <div className={styles.userInfo}>
          {isAuthenticated && user ? (
            <>
              <span className={styles.userName}>
                {getGreetingByTime()}, {user.firstName} {user.lastName}
              </span>
              <div className={styles.roleButtonsContainer}>
                {user.role === 'ADMIN' && (
                  <button
                    className={styles.roleButton}
                    onClick={() => navigate('/admin-panel')}
                  >
                    Панель администратора
                  </button>
                )}
                {user.role === 'STAFF' && (
                  <button
                    className={`${styles.roleButton} ${styles.staffButton}`}
                    onClick={() => navigate('/staff-panel')}
                  >
                    Панель персонала
                  </button>
                )}
              </div>
              <button 
                onClick={() => navigate('/profile')} 
                className={styles.loginButton}
                title="Профиль"
              >
                <img src="/images/profile-icon.png" alt="Profile" className={styles.profileIcon} />
                <span>Профиль</span>
              </button>
              <button onClick={handleLogout} className={styles.loginButton}>
                <span>Выход</span>
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className={styles.loginButton}>
              <img src="/images/profile-icon.png" alt="Login" className={styles.profileIcon} />
              <span>ВХОД</span>
            </button>
          )}
        </div>
      </div>

      <div className={styles.mapContainer}>
        <div className={styles.searchPanel}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'search' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <img src={airplaneIcon} alt="Search" className={styles.tabIcon} />
              <span>Поиск рейсов</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'manage' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              <img src={tagIcon} alt="Manage" className={styles.tabIcon} />
              <span>Управление бронированием</span>
            </button>
          </div>
          <div className={styles.tabContent}>
            {activeTab === 'search' && <FlightSearchTab />}
            {activeTab === 'manage' && <ManageBookingTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
