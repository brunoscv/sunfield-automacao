import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FilialService, MatrizService } from '../services';
import { Filial, CreateFilialRequest, UpdateFilialRequest, Matriz } from '../models';

const FiliaisPage: React.FC = () => {
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [matrizes, setMatrizes] = useState<Matriz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFilial, setEditingFilial] = useState<Filial | null>(null);
  const [formData, setFormData] = useState<CreateFilialRequest>({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    consumoKw: 0,
    percentualRecebimento: 0,
    matrizId: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [filiaisData, matrizesData] = await Promise.all([
        FilialService.getAllWithMatriz(),
        MatrizService.getAll()
      ]);
      setFiliais(filiaisData);
      setMatrizes(matrizesData);
    } catch (error) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação do percentual
    if (formData.percentualRecebimento < 0 || formData.percentualRecebimento > 100) {
      setError('O percentual de recebimento deve estar entre 0 e 100');
      return;
    }

    try {
      if (editingFilial) {
        await FilialService.update(editingFilial.id, formData as UpdateFilialRequest);
        setSuccess('Filial atualizada com sucesso!');
      } else {
        await FilialService.create(formData);
        setSuccess('Filial criada com sucesso!');
      }
      
      setShowModal(false);
      setEditingFilial(null);
      resetForm();
      loadData();
    } catch (error) {
      setError('Erro ao salvar filial');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      consumoKw: 0,
      percentualRecebimento: 0,
      matrizId: 0
    });
  };

  const handleEdit = (filial: Filial) => {
    setEditingFilial(filial);
    setFormData({
      nome: filial.nome,
      endereco: filial.endereco,
      cidade: filial.cidade,
      estado: filial.estado,
      cep: filial.cep,
      consumoKw: filial.consumoKw,
      percentualRecebimento: filial.percentualRecebimento,
      matrizId: filial.matrizId
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta filial?')) {
      try {
        await FilialService.delete(id);
        setSuccess('Filial excluída com sucesso!');
        loadData();
      } catch (error) {
        setError('Erro ao excluir filial');
      }
    }
  };

  const openCreateModal = () => {
    setEditingFilial(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold">
          <i className="fas fa-store me-2"></i>
          Gestão de Filiais
        </h1>
        <Button variant="primary" onClick={openCreateModal}>
          <i className="fas fa-plus me-2"></i>
          Nova Filial
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="dashboard-card">
        <Card.Header>
          <h5 className="mb-0">Lista de Filiais</h5>
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
                  <th>Matriz</th>
                  <th>Consumo (kW)</th>
                  <th>% Recebimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filiais.map((filial) => (
                  <tr key={filial.id}>
                    <td>{filial.id}</td>
                    <td>{filial.nome}</td>
                    <td>{filial.cidade}/{filial.estado}</td>
                    <td>{filial.matriz?.nome || 'N/A'}</td>
                    <td>{filial.consumoKw.toLocaleString()} kW</td>
                    <td>
                      <span className="badge bg-success">
                        {filial.percentualRecebimento}%
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(filial)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(filial.id)}
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
            {editingFilial ? 'Editar Filial' : 'Nova Filial'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Filial</Form.Label>
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
                  <Form.Label>Matriz</Form.Label>
                  <Form.Select
                    value={formData.matrizId}
                    onChange={(e) => setFormData({ ...formData, matrizId: parseInt(e.target.value) })}
                    required
                  >
                    <option value="">Selecione uma matriz</option>
                    {matrizes.map((matriz) => (
                      <option key={matriz.id} value={matriz.id}>
                        {matriz.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consumo (kW)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.consumoKw}
                    onChange={(e) => setFormData({ ...formData, consumoKw: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Percentual de Recebimento (%)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.percentualRecebimento}
                    onChange={(e) => setFormData({ ...formData, percentualRecebimento: parseFloat(e.target.value) || 0 })}
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
              {editingFilial ? 'Atualizar' : 'Criar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default FiliaisPage;