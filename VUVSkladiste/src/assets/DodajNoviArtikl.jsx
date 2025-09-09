import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DodajNoviArtikl() {
    const [newArtikl, setNewArtikl] = useState({
        artiklNaziv: '',
        artiklJmj: '',
        novaJmj: '',
        kategorijaId: ''
    });

    const [jmjOptions, setJmjOptions] = useState([]);
    const [kategorijeOptions, setKategorijeOptions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

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
                console.error(error);
                alert('Greška prilikom dohvaćanja podataka');
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewArtikl(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const artiklZaSlanje = {
            ArtiklNaziv: newArtikl.artiklNaziv,
            ArtiklJmj: newArtikl.artiklJmj === 'other' ? newArtikl.novaJmj : newArtikl.artiklJmj,
            KategorijaId: parseInt(newArtikl.kategorijaId)
        };

        try {
            await axios.post('https://localhost:5001/api/home/add_artikl', artiklZaSlanje, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            alert('Artikl uspješno dodan.');
            navigate('/stanja'); // Povratak na Stanja
        } catch (error) {
            console.error(error);
            alert('Greška prilikom dodavanja artikla.');
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4">
                <h3 className="text-center mb-4">Dodaj Novi Artikl</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="artiklNaziv">
                        <Form.Label>Naziv artikla</Form.Label>
                        <Form.Control
                            type="text"
                            name="artiklNaziv"
                            value={newArtikl.artiklNaziv}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="artiklJmj" className="mt-3">
                        <Form.Label>JMJ</Form.Label>
                        <Form.Control
                            as="select"
                            name="artiklJmj"
                            value={newArtikl.artiklJmj}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Odaberi JMJ</option>
                            {jmjOptions.map((jmj, index) => (
                                <option key={index} value={jmj}>{jmj}</option>
                            ))}
                            <option value="other">Unesi novu JMJ</option>
                        </Form.Control>
                        {newArtikl.artiklJmj === 'other' && (
                            <Form.Control
                                type="text"
                                name="novaJmj"
                                className="mt-2"
                                placeholder="Unesi novu JMJ"
                                value={newArtikl.novaJmj}
                                onChange={handleChange}
                                required
                            />
                        )}
                    </Form.Group>

                    <Form.Group controlId="kategorijaId" className="mt-3">
                        <Form.Label>Kategorija</Form.Label>
                        <Form.Control
                            as="select"
                            name="kategorijaId"
                            value={newArtikl.kategorijaId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Odaberi kategoriju</option>
                            {kategorijeOptions.map((kat) => (
                                <option key={kat.kategorijaId} value={kat.kategorijaId}>
                                    {kat.kategorijaNaziv}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" className="me-2" onClick={() => navigate('/stanja')}>
                            Odustani
                        </Button>
                        <Button variant="primary" type="submit">
                            Spremi artikl
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}

export default DodajNoviArtikl;
