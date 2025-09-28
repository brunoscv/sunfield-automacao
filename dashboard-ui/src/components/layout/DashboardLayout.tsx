import React,  { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';
import { AuthService } from '../../services';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/users', label: 'Usuários', icon: 'fas fa-users' },
    { path: '/matrizes', label: 'Matrizes', icon: 'fas fa-building' },
    { path: '/filiais', label: 'Filiais', icon: 'fas fa-store' },
    { path: '/files', label: 'Arquivos', icon: 'fas fa-file-alt' },
    { path: '/reports', label: 'Relatórios', icon: 'fas fa-chart-bar' },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="dashboard-header">
        <Container fluid>
          <Button
            variant="outline-light"
            className="d-lg-none me-2"
            onClick={() => setShowSidebar(true)}
          >
            <i className="fas fa-bars"></i>
          </Button>
          
          <Navbar.Brand href="#" className="fw-bold">
            <i className="fas fa-bolt me-2"></i>
            Energia Dashboard
          </Navbar.Brand>
          
          <Nav className="ms-auto">
            <Nav.Link onClick={handleLogout} className="text-light">
              <i className="fas fa-sign-out-alt me-1"></i>
              Sair
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="dashboard-content">
        {/* Sidebar para desktop */}
        <div className="sidebar d-none d-lg-block">
          <div className="sidebar-content">
            <Nav className="flex-column">
              {menuItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`sidebar-item ${isActiveRoute(item.path) ? 'active' : ''}`}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
          </div>
        </div>

        {/* Sidebar para mobile */}
        <Offcanvas
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          placement="start"
          className="sidebar-mobile"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <i className="fas fa-bolt me-2"></i>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {menuItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setShowSidebar(false);
                  }}
                  className={`sidebar-item ${isActiveRoute(item.path) ? 'active' : ''}`}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Conteúdo principal */}
        <div className="main-content">
          <Container fluid className="p-4">
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;