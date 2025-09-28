import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { MatrizService } from '../services';
import { Matriz, CreateMatrizRequest, UpdateMatrizRequest } from '../models';

const MatrizesPage: React.FC = () => {
  const [matrizes, setMatrizes] = useState<Matriz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMatriz, setEditingMatriz] = useState<Matriz | null>(null);
  const [formData, setFormData] = useState<CreateMatrizRequest>({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    energiaGeradaKw: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadMatrizes();
  }, []);

  const loadMatrizes = async () => {
    try {
      const data = await MatrizService.getAllWithFiliais();
      setMatrizes(data);
    } catch (error) {
      setError('Erro ao carregar matrizes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingMatriz) {
        await MatrizService.update(editingMatriz.id, formData as UpdateMatrizRequest);
        setSuccess('Matriz atualizada com sucesso!');
      } else {
        await MatrizService.create(formData);
        setSuccess('Matriz criada com sucesso!');
      }
      
      setShowModal(false);
      setEditingMatriz(null);
      resetForm();
      loadMatrizes();
    } catch (error) {
      setError('Erro ao salvar matriz');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      energiaGeradaKw: 0
    });
  };

  const handleEdit = (matriz: Matriz) => {
    setEditingMatriz(matriz);
    setFormData({
      nome: matriz.nome,
      endereco: matriz.endereco,
      cidade: matriz.cidade,
      estado: matriz.estado,
      cep: matriz.cep,
      energiaGeradaKw: matriz.energiaGeradaKw
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta matriz?')) {
      try {
        await MatrizService.delete(id);
        setSuccess('Matriz excluída com sucesso!');
        loadMatrizes();
      } catch (error) {
        setError('Erro ao excluir matriz');
      }
    }
  };

  const openCreateModal = () => {
    setEditingMatriz(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold">
          <i className="fas fa-building me-2"></i>
          Gestão de Matrizes
        </h1>
        <Button variant="primary" onClick={openCreateModal}>
          <i className="fas fa-plus me-2"></i>
          Nova Matriz
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="dashboard-card">
        <Card.Header>
          <h5 className="mb-0">Lista de Matrizes</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Cidade/Estado</th>
                  <th>Energia Gerada (kW)</th>
                  <th>Filiais</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {matrizes.map((matriz) => (
                  <tr key={matriz.id}>
                    <td>{matriz.id}</td>
                    <td>{matriz.nome}</td>
                    <td>{matriz.cidade}/{matriz.estado}</td>
                    <td>{matriz.energiaGeradaKw.toLocaleString()} kW</td>
                    <td>
                      <span className="badge bg-info">
                        {matriz.filiais?.length || 0} filiais
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(matriz)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(matriz.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Criação/Edição */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMatriz ? 'Editar Matriz' : 'Nova Matriz'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Matriz</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Energia Gerada (kW)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.energiaGeradaKw}
                    onChange={(e) => setFormData({ ...formData, energiaGeradaKw: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    required
                    maxLength={2}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingMatriz ? 'Atualizar' : 'Criar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MatrizesPage;