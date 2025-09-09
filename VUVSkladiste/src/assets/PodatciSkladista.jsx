import React, { useState, useEffect } from "react";
import { Form, Card, Button } from "react-bootstrap";
import axios from "axios";

function PodatciSkladista() {
    const [skladiste, setSkladiste] = useState({
        skladisteId: 0,
        skladisteNaziv: "",
        adresaSkladista: "",
        brojTelefona: "",
        email: ""
    });

    useEffect(() => {
        axios.get("https://localhost:5001/api/home/skladiste", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                if (res.data) {
                    setSkladiste(res.data);
                }
            })
            .catch(err => {
                console.error("Greška prilikom dohvaćanja podataka:", err);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

        if (skladiste.skladisteId) {
            axios.put(`https://localhost:5001/api/home/skladiste/${skladiste.skladisteId}`, skladiste, { headers })
                .then(() => alert("Podaci skladišta ažurirani."))
                .catch(err => {
                    console.error("Greška prilikom ažuriranja:", err);
                    alert("Greška prilikom ažuriranja podataka.");
                });
        } else {
            axios.post("https://localhost:5001/api/home/skladiste", skladiste, { headers })
                .then(res => {
                    alert("Podaci skladišta dodani.");
                    setSkladiste(res.data);
                })
                .catch(err => {
                    console.error("Greška prilikom dodavanja:", err);
                    alert("Greška prilikom spremanja podataka.");
                });
        }
    };

    return (
        <div className="mt-4">
            <Card className="form-card"style={{ maxWidth: '600px', margin: '20px auto' }}>
                <Card.Header className="text-light" as="h4">Podatci o skladištu</Card.Header>
                <Card.Body >


                    <Form onSubmit={handleSubmit} className="centered-form">
                        <Form.Group className="mb-3">
                            <Form.Label>Naziv</Form.Label>
                            <Form.Control
                                type="text"
                                value={skladiste.skladisteNaziv}
                                onChange={(e) => setSkladiste({ ...skladiste, skladisteNaziv: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Adresa</Form.Label>
                            <Form.Control
                                type="text"
                                value={skladiste.adresaSkladista}
                                onChange={(e) => setSkladiste({ ...skladiste, adresaSkladista: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj telefona</Form.Label>
                            <Form.Control
                                type="text"
                                value={skladiste.brojTelefona}
                                onChange={(e) => setSkladiste({ ...skladiste, brojTelefona: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={skladiste.email}
                                onChange={(e) => setSkladiste({ ...skladiste, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary">Spremi</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default PodatciSkladista;
