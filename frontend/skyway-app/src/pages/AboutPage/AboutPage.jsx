import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutAuthorPage = () => {
    const navigate = useNavigate();

    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: '#ececec',
            fontFamily: 'Arial, sans-serif',
            padding: '40px 20px'
        },
        container: {
            maxWidth: '1000px',
            margin: '0 auto'
        },
        header: {
            marginBottom: '40px',
            textAlign: 'center'
        },
        title: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#004758',
            marginBottom: '10px'
        },
        subtitle: {
            fontSize: '18px',
            color: '#666'
        },
        backButton: {
            padding: '10px 20px',
            backgroundColor: '#004758',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '30px',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
        },
        card: {
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        row: {
            marginBottom: '15px',
            fontSize: '16px',
            color: '#333',
            lineHeight: '1.6'
        },
        label: {
            fontWeight: 'bold',
            color: '#004758'
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <button
                    style={styles.backButton}
                    onClick={() => navigate('/')}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003344'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004758'}
                >
                    ← Назад на главную
                </button>

                <div style={styles.header}>
                    <h1 style={styles.title}>Об авторе</h1>
                    <p style={styles.subtitle}>Информация о разработчике проекта</p>
                </div>

                <div style={styles.card}>
                    <div style={styles.row}>
                        <span style={styles.label}>ФИО:</span> Серов Дмитрий Евгеньевич
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Учебное заведение / группа:</span> ФГБОУ ВО "Финансовый университет при Правительстве Российской Федерации", группа ИД23-3
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Контактные данные:</span> 237415@edu.fa.ru
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Стек</span>
                        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                            <li>Java 17, SpringBoot 4.0.0, Spring Security, Spring Data JPA, PostgreSQL, JWT</li>
                            <li>React, JavaScript, ReactRouterDom, HTML, CSS, fetch</li>
                            <li>Git</li>
                        </ul>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Опыт работы с технологиями:</span>
                        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                            <li>Java/Spring - был опыт разработки рест сервисов</li>
                            <li>React - первый раз использовал реакт, изучал для написания курсовой</li>
                            <li>JavaScript, HTML, CSS - был небольшой опыт разработки</li>
                        </ul>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Сроки выполнения проекта:</span> 17.11.2025 - 15.12.2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutAuthorPage;
