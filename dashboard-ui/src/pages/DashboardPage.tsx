import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { MatrizService, FilialService, UserService, FileService } from '../services';

interface DashboardStats {
  totalMatrizes: number;
  totalFiliais: number;
  totalUsers: number;
  totalFiles: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMatrizes: 0,
    totalFiliais: 0,
    totalUsers: 0,
    totalFiles: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [matrizes, filiais, users, files] = await Promise.all([
        MatrizService.getAll(),
        FilialService.getAll(),
        UserService.getAll(),
        FileService.getAll()
      ]);

      setStats({
        totalMatrizes: matrizes.length,
        totalFiliais: filiais.length,
        totalUsers: users.length,
        totalFiles: files.length
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: string;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Col md={6} lg={3} className="mb-4">
      <Card className="dashboard-card h-100">
        <Card.Body className="text-center">
          <div className={`stat-icon mb-3 ${color}`}>
            <i className={icon}></i>
          </div>
          <h3 className="fw-bold">{loading ? '...' : value}</h3>
          <p className="text-muted mb-0">{title}</p>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold">
          <i className="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </h1>
        <small className="text-muted">
          Bem-vindo ao sistema de gestão de energia
        </small>
      </div>

      {/* Estatísticas */}
      <Row>
        <StatCard
          title="Total de Matrizes"
          value={stats.totalMatrizes}
          icon="fas fa-building"
          color="text-primary"
        />
        <StatCard
          title="Total de Filiais"
          value={stats.totalFiliais}
          icon="fas fa-store"
          color="text-success"
        />
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon="fas fa-users"
          color="text-info"
        />
        <StatCard
          title="Total de Arquivos"
          value={stats.totalFiles}
          icon="fas fa-file-alt"
          color="text-warning"
        />
      </Row>

      {/* Resumo do Sistema */}
      <Row>
        <Col lg={8}>
          <Card className="dashboard-card">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Resumo do Sistema
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">Funcionalidades Disponíveis:</h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i>Gestão de Usuários</li>
                    <li><i className="fas fa-check text-success me-2"></i>Gestão de Matrizes</li>
                    <li><i className="fas fa-check text-success me-2"></i>Gestão de Filiais</li>
                    <li><i className="fas fa-check text-success me-2"></i>Upload de Arquivos</li>
                    <li><i className="fas fa-check text-success me-2"></i>Relatórios</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="text-primary">Recursos do Sistema:</h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i>Autenticação de Usuários</li>
                    <li><i className="fas fa-check text-success me-2"></i>Interface Responsiva</li>
                    <li><i className="fas fa-check text-success me-2"></i>Validação de Dados</li>
                    <li><i className="fas fa-check text-success me-2"></i>Cálculos de Energia</li>
                    <li><i className="fas fa-check text-success me-2"></i>Dashboard Interativo</li>
                  </ul>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="dashboard-card">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Informações
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Versão:</strong> 2.0.0
              </div>
              <div className="mb-3">
                <strong>Backend:</strong> Spring Boot
              </div>
              <div className="mb-3">
                <strong>Frontend:</strong> React + TypeScript
              </div>
              <div className="mb-3">
                <strong>Banco de Dados:</strong> H2 (Desenvolvimento)
              </div>
              <div className="mb-0">
                <strong>Status:</strong> 
                <span className="badge bg-success ms-2">Online</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ações Rápidas */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Ações Rápidas
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-3 text-center mb-3">
                  <div className="quick-action">
                    <i className="fas fa-plus-circle fa-2x text-primary mb-2"></i>
                    <p className="mb-0">Adicionar Matriz</p>
                  </div>
                </div>
                <div className="col-md-3 text-center mb-3">
                  <div className="quick-action">
                    <i className="fas fa-store fa-2x text-success mb-2"></i>
                    <p className="mb-0">Adicionar Filial</p>
                  </div>
                </div>
                <div className="col-md-3 text-center mb-3">
                  <div className="quick-action">
                    <i className="fas fa-upload fa-2x text-info mb-2"></i>
                    <p className="mb-0">Upload Arquivo</p>
                  </div>
                </div>
                <div className="col-md-3 text-center mb-3">
                  <div className="quick-action">
                    <i className="fas fa-chart-bar fa-2x text-warning mb-2"></i>
                    <p className="mb-0">Ver Relatórios</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;