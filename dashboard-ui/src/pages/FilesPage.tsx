import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FileService, UserService } from '../services';
import { FileInfo, UploadFileRequest, User } from '../models';

const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [filesData, usersData] = await Promise.all([
        FileService.getAll(),
        UserService.getAll()
      ]);
      setFiles(filesData);
      setUsers(usersData);
    } catch (error) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !selectedUserId) {
      setError('Selecione um arquivo e um usuário');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const uploadRequest: UploadFileRequest = {
        file: selectedFile,
        userId: selectedUserId
      };

      await FileService.upload(uploadRequest);
      setSuccess('Arquivo enviado com sucesso!');
      setShowModal(false);
      setSelectedFile(null);
      setSelectedUserId(0);
      loadData();
    } catch (error) {
      setError('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este arquivo?')) {
      try {
        await FileService.delete(id);
        setSuccess('Arquivo excluído com sucesso!');
        loadData();
      } catch (error) {
        setError('Erro ao excluir arquivo');
      }
    }
  };

  const handleDownload = async (id: number, filename: string) => {
    try {
      const blob = await FileService.download(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Erro ao baixar arquivo');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const openUploadModal = () => {
    setSelectedFile(null);
    setSelectedUserId(0);
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold">
          <i className="fas fa-file-alt me-2"></i>
          Gestão de Arquivos
        </h1>
        <Button variant="primary" onClick={openUploadModal}>
          <i className="fas fa-upload me-2"></i>
          Enviar Arquivo
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="dashboard-card">
        <Card.Header>
          <h5 className="mb-0">Lista de Arquivos</h5>
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
                  <th>Nome do Arquivo</th>
                  <th>Tamanho</th>
                  <th>Tipo</th>
                  <th>Usuário</th>
                  <th>Data de Upload</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>{file.id}</td>
                    <td>
                      <i className="fas fa-file me-2"></i>
                      {file.filename}
                    </td>
                    <td>{formatFileSize(file.size)}</td>
                    <td>
                      <span className="badge bg-secondary">
                        {file.contentType}
                      </span>
                    </td>
                    <td>{file.user?.username || 'N/A'}</td>
                    <td>{formatDate(file.uploadDate)}</td>
                    <td>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleDownload(file.id, file.filename)}
                      >
                        <i className="fas fa-download"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
                {files.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      Nenhum arquivo encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Upload */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enviar Arquivo</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Usuário</Form.Label>
              <Form.Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                required
              >
                <option value="">Selecione um usuário</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Arquivo</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileSelect}
                required
              />
              {selectedFile && (
                <Form.Text className="text-muted">
                  Arquivo selecionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </Form.Text>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fas fa-upload me-2"></i>
                  Enviar
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default FilesPage;