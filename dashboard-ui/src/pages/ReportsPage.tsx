import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { MatrizService, FilialService } from '../services';
import { Matriz, Filial } from '../models';

interface ReportData {
  matrizes: Matriz[];
  filiais: Filial[];
  totalEnergiaGerada: number;
  totalEnergiaConsumida: number;
  totalEnergiaDistribuida: number;
}

const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    matrizes: [],
    filiais: [],
    totalEnergiaGerada: 0,
    totalEnergiaConsumida: 0,
    totalEnergiaDistribuida: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      const [matrizes, filiais] = await Promise.all([
        MatrizService.getAllWithFiliais(),
        FilialService.getAllWithMatriz()
      ]);

      const totalEnergiaGerada = matrizes.reduce((sum, matriz) => sum + matriz.energiaGeradaKw, 0);
      const totalEnergiaConsumida = filiais.reduce((sum, filial) => sum + filial.consumoKw, 0);
      
      // Calcular energia distribuída baseada nos percentuais das filiais
      const totalEnergiaDistribuida = filiais.reduce((sum, filial) => {
        const matriz = matrizes.find(m => m.id === filial.matrizId);
        if (matriz) {
          return sum + (matriz.energiaGeradaKw * filial.percentualRecebimento / 100);
        }
        return sum;
      }, 0);

      setReportData({
        matrizes,
        filiais,
        totalEnergiaGerada,
        totalEnergiaConsumida,
        totalEnergiaDistribuida
      });
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Tipo', 'Nome', 'Cidade', 'Estado', 'Energia (kW)', 'Percentual'],
      ...reportData.matrizes.map(matriz => [
        'Matriz',
        matriz.nome,
        matriz.cidade,
        matriz.estado,
        matriz.energiaGeradaKw.toString(),
        '-'
      ]),
      ...reportData.filiais.map(filial => [
        'Filial',
        filial.nome,
        filial.cidade,
        filial.estado,
        filial.consumoKw.toString(),
        `${filial.percentualRecebimento}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorio_energia.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold">
          <i className="fas fa-chart-bar me-2"></i>
          Relatórios
        </h1>
        <Button variant="success" onClick={exportToCSV}>
          <i className="fas fa-download me-2"></i>
          Exportar CSV
        </Button>
      </div>

      {/* Resumo Geral */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <div className="stat-icon mb-3 text-primary">
                <i className="fas fa-bolt fa-2x"></i>
              </div>
              <h3 className="fw-bold text-primary">
                {reportData.totalEnergiaGerada.toLocaleString()} kW
              </h3>
              <p className="text-muted mb-0">Total Energia Gerada</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <div className="stat-icon mb-3 text-warning">
                <i className="fas fa-plug fa-2x"></i>
              </div>
              <h3 className="fw-bold text-warning">
                {reportData.totalEnergiaConsumida.toLocaleString()} kW
              </h3>
              <p className="text-muted mb-0">Total Energia Consumida</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <div className="stat-icon mb-3 text-success">
                <i className="fas fa-share-alt fa-2x"></i>
              </div>
              <h3 className="fw-bold text-success">
                {reportData.totalEnergiaDistribuida.toLocaleString()} kW
              </h3>
              <p className="text-muted mb-0">Total Energia Distribuída</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Relatório de Matrizes */}
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-building me-2"></i>
                Relatório de Matrizes
              </h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Cidade/Estado</th>
                    <th>Energia Gerada (kW)</th>
                    <th>Filiais Vinculadas</th>
                    <th>% da Energia Total</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.matrizes.map((matriz) => (
                    <tr key={matriz.id}>
                      <td>{matriz.nome}</td>
                      <td>{matriz.cidade}/{matriz.estado}</td>
                      <td>{matriz.energiaGeradaKw.toLocaleString()} kW</td>
                      <td>
                        <span className="badge bg-info">
                          {matriz.filiais?.length || 0} filiais
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          {((matriz.energiaGeradaKw / reportData.totalEnergiaGerada) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Relatório de Filiais */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-store me-2"></i>
                Relatório de Filiais
              </h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Matriz</th>
                    <th>Cidade/Estado</th>
                    <th>Consumo (kW)</th>
                    <th>% Recebimento</th>
                    <th>Energia Recebida (kW)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.filiais.map((filial) => {
                    const matriz = reportData.matrizes.find(m => m.id === filial.matrizId);
                    const energiaRecebida = matriz ? (matriz.energiaGeradaKw * filial.percentualRecebimento / 100) : 0;
                    
                    return (
                      <tr key={filial.id}>
                        <td>{filial.nome}</td>
                        <td>{matriz?.nome || 'N/A'}</td>
                        <td>{filial.cidade}/{filial.estado}</td>
                        <td>{filial.consumoKw.toLocaleString()} kW</td>
                        <td>
                          <span className="badge bg-primary">
                            {filial.percentualRecebimento}%
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold text-success">
                            {energiaRecebida.toLocaleString()} kW
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsPage;