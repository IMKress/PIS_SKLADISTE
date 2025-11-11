import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../API_URL/getApiUrl";
import { isAdminUser } from "../utils/auth";

function DodajDobavljaca() {
    const [dobavljac, setDobavljac] = useState({
        dobavljacNaziv: "",
        adresaDobavljaca: "",
        brojTelefona: "",
        email: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdminUser()) {
            navigate('/Dobavljaci');
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isAdminUser()) {
            return;
        }

        axios.post(API_URLS.pAddDobavljac(), dobavljac, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(() => {
                alert("Dobavljač uspješno dodan.");
                navigate("/dobavljaci");
            })
            .catch(err => {
                console.error("Greška prilikom dodavanja:", err);
                alert("Greška prilikom dodavanja dobavljača.");
            });
    };

    return (
        <div className="mt-4">
            <h4>Dodaj dobavljača</h4>
            <Form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
                <Form.Group className="mb-3">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control
                        type="text"
                        value={dobavljac.dobavljacNaziv}
                        onChange={(e) => setDobavljac({ ...dobavljac, dobavljacNaziv: e.target.value })}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Adresa</Form.Label>
                    <Form.Control
                        type="text"
                        value={dobavljac.adresaDobavljaca}
                        onChange={(e) => setDobavljac({ ...dobavljac, adresaDobavljaca: e.target.value })}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control
                        type="text"
                        value={dobavljac.brojTelefona}
                        onChange={(e) => setDobavljac({ ...dobavljac, brojTelefona: e.target.value })}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={dobavljac.email}
                        onChange={(e) => setDobavljac({ ...dobavljac, email: e.target.value })}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary">Spremi</Button>
            </Form>
        </div>
    );
}

export default DodajDobavljaca;
