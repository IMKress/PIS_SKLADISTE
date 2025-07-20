import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { Button, Modal } from 'react-bootstrap';

function DobavljaciDokumenti() {
    const { dobavljacId } = useParams();
    const [dokumenti, setDokumenti] = useState([]);
    const [dobavljac, setDobavljac] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        // Dohvati dokumente
        const fetchDokumenti = axios.get(`https://localhost:5001/api/home/dokumenti_by_dobavljac/${dobavljacId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Dohvati dobavljača
        const fetchDobavljac = axios.get(`https://localhost:5001/api/home/dobavljaciDTO/${dobavljacId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        Promise.all([fetchDokumenti, fetchDobavljac])
            .then(([dokRes, dobRes]) => {
                setDokumenti(dokRes.data);
                setDobavljac(dobRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Greška prilikom dohvaćanja podataka:", err);
                alert("Greška prilikom dohvaćanja podataka.");
                setLoading(false);
            });
    }, [dobavljacId]);

    const handleDelete = () => {
        axios.delete(`https://localhost:5001/api/home/delete_dobavljac/${dobavljacId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then(() => {
                alert("Dobavljač je uspješno obrisan.");
                navigate("/dobavljaci");
            })
            .catch(err => {
                console.error("Greška prilikom brisanja dobavljača:", err);
                alert("Greška prilikom brisanja dobavljača.");
            });
    };

    if (loading) return <p>Učitavanje...</p>;

    return (
        <div>
            <h3 className="mt-4">Dobavljač: {dobavljac?.dobavljacNaziv || `#${dobavljacId}`}</h3>

            <Button variant="danger" className="mb-3" onClick={() => setShowModal(true)}>
                Obriši dobavljača
            </Button>
            <Button
                variant="warning"
                className="mb-3 ms-2"
                onClick={() => navigate(`/dobavljaci/azuriraj/${dobavljacId}`)}
            >
                Ažuriraj
            </Button>

            {dokumenti.length === 0 ? (
                <p className="mt-3">Nema dokumenata za ovog dobavljača.</p>
            ) : (
                <Table className="centered-table mt-3" striped bordered hover variant="light">
                    <thead>
                        <tr>
                            <th>Oznaka</th>
                            <th>Datum</th>
                            <th>Tip</th>
                            <th>Napomena</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dokumenti.map((d, idx) => (
                            <tr key={idx}>
                                <td>{d.oznakaDokumenta}</td>
                                <td>{new Date(d.datumDokumenta).toLocaleDateString('hr-HR')}</td>
                                <td>{d.tipDokumenta || 'Nepoznato'}</td>
                                <td>{d.napomena || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Jeste li sigurni da želite obrisati dobavljača "{dobavljac?.dobavljacNaziv}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Odustani
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Obriši
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DobavljaciDokumenti;
