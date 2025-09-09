import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DodajKategoriju() {
    const [kategorijaNaziv, setKategorijaNaziv] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!kategorijaNaziv.trim()) {
            alert('Unesite naziv kategorije');
            return;
        }

        try {
            await axios.post(
                'https://localhost:5001/api/home/add_kategorija',
                { kategorijaNaziv },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            alert(`Kategorija "${kategorijaNaziv}" uspješno dodana.`);
            navigate('/stanja');
        } catch (error) {
            console.error('Greška prilikom dodavanja kategorije:', error);
            alert('Greška prilikom dodavanja kategorije');
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4">
                <h3 className="text-center mb-4">Dodaj Kategoriju</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="kategorijaNaziv">
                        <Form.Label>Naziv kategorije</Form.Label>
                        <Form.Control
                            type="text"
                            value={kategorijaNaziv}
                            onChange={(e) => setKategorijaNaziv(e.target.value)}
                            placeholder="Unesite naziv nove kategorije"
                            required
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" className="me-2" onClick={() => navigate('/stanja')}>
                            Odustani
                        </Button>
                        <Button variant="primary" type="submit">
                            Dodaj Kategoriju
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}

export default DodajKategoriju;
