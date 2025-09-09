import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Form, Button, Container, Card } from 'react-bootstrap';
import { EditModal } from './modals';
import axios from 'axios';

function ArtiklInfo() {
    const { id } = useParams(); // artiklId iz URL-a
    const [artiklData, setArtiklData] = useState([]);
    const [artiklDetails, setArtiklDetails] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [jmjOptions, setJmjOptions] = useState([]);
    const [kategorijeOptions, setKategorijeOptions] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();

    const handleShowEditModal = () => setShowEditModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            try {
                const [allData, artikli] = await Promise.all([
                    axios.get('https://localhost:5001/api/home/joined_artikls_db', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('https://localhost:5001/api/home/artikli_db', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const filteredData = allData.data.filter(item => item.artiklId.toString() === id);
                const selectedArtikl = artikli.data.find(a => a.artiklId.toString() === id);

                setArtiklData(filteredData);
                setArtiklDetails(selectedArtikl || {});
            } catch (error) {
                console.error("Greška pri dohvaćanju podataka:", error);
                alert("Greška prilikom učitavanja artikla");
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchOptions = async () => {
            const token = localStorage.getItem('token');
            try {
                const [artikliRes, kategorijeRes] = await Promise.all([
                    axios.get('https://localhost:5001/api/home/artikli_db', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('https://localhost:5001/api/home/kategorije', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                const uniqueJmj = [...new Set(artikliRes.data.map(a => a.artiklJmj))];
                setJmjOptions(uniqueJmj);
                setKategorijeOptions(kategorijeRes.data);
            } catch (error) {
                console.error('Greška pri dohvaćanju opcija:', error);
            }
        };

        fetchOptions();
    }, []);

    const filteredResults = artiklData.filter(item =>
        item.dokumentId.toString().includes(searchTerm) ||
        new Date(item.datumDokumenta).toLocaleDateString().includes(searchTerm) ||
        item.tipDokumenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kolicina.toString().includes(searchTerm) ||
        (item.trenutnaKolicina?.toString().includes(searchTerm)) ||
        item.cijena.toFixed(2).includes(searchTerm)
    );

    return (
        <Container className="mt-4">
            <Card className="p-4">
                <h3 className="mb-3">Detalji Artikla: {artiklDetails.artiklNaziv}</h3>

                <p><strong>JMJ:</strong> {artiklDetails.artiklJmj}</p>
                <p><strong>Kategorija:</strong> {artiklDetails.kategorijaNaziv}</p>

                <Form.Group className="mt-3">
                    <Form.Label>Pretraži po dokumentima</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="ID, datum, tip dokumenta, količina..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Form.Group>

                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>Oznaka dokumenta</th>
                            <th>Datum</th>
                            <th>Tip</th>
                            <th>Količina</th>
                            <th>Trenutna Količina</th>
                            <th>Cijena</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.map((item, index) => (
                            <tr key={index}>
                                <td>{item.oznakaDokumenta}</td>
                                <td>{new Date(item.datumDokumenta).toLocaleDateString()}</td>
                                <td>{item.tipDokumenta}</td>
                                <td>{item.kolicina}</td>
                                <td>{item.tipDokumenta === "Primka" ? item.trenutnaKolicina : ''}</td>
                                <td>{item.cijena.toFixed(2)} €</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div className="d-flex justify-content-end mt-3">
                    <Button variant="primary" className="me-2" onClick={handleShowEditModal}>Uredi</Button>
                    <Button variant="secondary" onClick={() => navigate('/stanja')}>Natrag</Button>
                </div>
            </Card>
      

        {showEditModal && (
            <EditModal
                show={showEditModal}
                handleClose={handleCloseEditModal}
                jmjOptions={jmjOptions}
                kategorijeOptions={kategorijeOptions}
                artiklName={artiklDetails.artiklNaziv}
                artJmj={artiklDetails.artiklJmj}
                artKat={artiklDetails.kategorijaNaziv}
                artiklId={artiklDetails.artiklId}
            />
        )}
          </Container>
    );
}

export default ArtiklInfo;
