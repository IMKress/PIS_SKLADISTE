import React, { useState, useEffect } from "react";
import { Form, Card, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { isAdminUser } from "../utils/auth";

function PodatciSkladista() {
    const [lokacije, setLokacije] = useState([]);
    const [skladiste, setSkladiste] = useState({
        skladisteId: 0,
        skladisteNaziv: "",
        adresaSkladista: "",
        brojTelefona: "",
        email: ""
    });

    // 👇 Modal stanja
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [trenutnaLokacija, setTrenutnaLokacija] = useState({
        LOK_ID: 0,
        POLICA: "",
        BR_RED: 0,
        BR_STUP: 0,
        NEMA_MJESTA: false
    });
    const [isAdmin, setIsAdmin] = useState(isAdminUser());

    useEffect(() => {
        setIsAdmin(isAdminUser());
    }, []);

    useEffect(() => {
        ucitajPodatke();
    }, []);

    const ucitajPodatke = async () => {
        try {
            const skladisteRes = await axios.get("https://localhost:5001/api/home/skladiste", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (skladisteRes.data) setSkladiste(skladisteRes.data);

            const lokRes = await axios.get("https://localhost:5001/api/home/get_all_skladiste_lokacija");
            if (lokRes.data) setLokacije(lokRes.data);
        } catch (err) {
            console.error("Greška prilikom dohvaćanja podataka:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            return;
        }
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

        try {
            if (skladiste.skladisteId) {
                await axios.put(`https://localhost:5001/api/home/skladiste/${skladiste.skladisteId}`, skladiste, { headers });
                alert("Podaci skladišta ažurirani.");
            } else {
                const res = await axios.post("https://localhost:5001/api/home/skladiste", skladiste, { headers });
                setSkladiste(res.data);
                alert("Podaci skladišta dodani.");
            }
        } catch {
            alert("Greška prilikom spremanja podataka.");
        }
    };

    // 👇 Dodavanje nove lokacije
    const handleDodajLokaciju = async () => {
        if (!isAdmin) {
            return;
        }
        try {
            await axios.post("https://localhost:5001/api/home/add_skladiste_lokacija", trenutnaLokacija);
            alert("Nova lokacija dodana!");
            setShowModal(false);
            setTrenutnaLokacija({ LOK_ID: 0, POLICA: "", BR_RED: 0, BR_STUP: 0, NEMA_MJESTA: false });
            ucitajPodatke();
        } catch (err) {
            console.error("Greška prilikom dodavanja lokacije:", err);
            alert("Greška prilikom dodavanja lokacije.");
        }
    };

    // 👇 Uređivanje postojeće lokacije
    const handleUrediLokaciju = async () => {
        if (!isAdmin) {
            return;
        }
        try {
            await axios.put(`https://localhost:5001/api/home/update_skladiste_lokacija/${trenutnaLokacija.LOK_ID}`, trenutnaLokacija);
            alert("Lokacija ažurirana!");
            setShowModal(false);
            setTrenutnaLokacija({ LOK_ID: 0, POLICA: "", BR_RED: 0, BR_STUP: 0, NEMA_MJESTA: false });
            ucitajPodatke();
        } catch (err) {
            console.error("Greška prilikom ažuriranja lokacije:", err);
            alert("Greška prilikom ažuriranja lokacije.");
        }
    };

    // 👇 Otvori modal za dodavanje
    const otvoriModalDodaj = () => {
        if (!isAdmin) {
            return;
        }
        setEditMode(false);
        setTrenutnaLokacija({ LOK_ID: 0, POLICA: "", BR_RED: 0, BR_STUP: 0, NEMA_MJESTA: false });
        setShowModal(true);
    };

    // 👇 Otvori modal za uređivanje
    const otvoriModalUredi = (lok) => {
        if (!isAdmin) {
            return;
        }
        setEditMode(true);
        setTrenutnaLokacija({
            LOK_ID: lok.loK_ID,
            POLICA: lok.polica,
            BR_RED: lok.bR_RED,
            BR_STUP: lok.bR_STUP,
            NEMA_MJESTA: lok.nemA_MJESTA
        });
        setShowModal(true);
    };

    return (
        <div className="mt-4">
            <Card className="form-card" style={{ maxWidth: '750px', margin: '20px auto' }}>
                <Card.Header className="text-light d-flex justify-content-between align-items-center" as="h4">
                    Podatci o skladištu
                    {isAdmin && (
                        <Button variant="success" onClick={otvoriModalDodaj}>
                            ➕ Dodaj lokaciju
                        </Button>
                    )}
                </Card.Header>

                <Card.Body>
                    {!isAdmin && (
                        <p className="text-muted">Podatke je moguće samo pregledavati.</p>
                    )}
                    {/* Forma za skladište */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Naziv</Form.Label>
                            <Form.Control
                                type="text"
                                value={skladiste.skladisteNaziv}
                                onChange={(e) => setSkladiste({ ...skladiste, skladisteNaziv: e.target.value })}
                                readOnly={!isAdmin}
                                disabled={!isAdmin}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Adresa</Form.Label>
                            <Form.Control
                                type="text"
                                value={skladiste.adresaSkladista}
                                onChange={(e) => setSkladiste({ ...skladiste, adresaSkladista: e.target.value })}
                                readOnly={!isAdmin}
                                disabled={!isAdmin}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj telefona</Form.Label>
                            <Form.Control
                                type="text"
                                value={skladiste.brojTelefona}
                                onChange={(e) => setSkladiste({ ...skladiste, brojTelefona: e.target.value })}
                                readOnly={!isAdmin}
                                disabled={!isAdmin}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={skladiste.email}
                                onChange={(e) => setSkladiste({ ...skladiste, email: e.target.value })}
                                readOnly={!isAdmin}
                                disabled={!isAdmin}
                                required
                            />
                        </Form.Group>
                        {isAdmin && <Button type="submit" variant="primary">Spremi</Button>}
                    </Form>

                    <hr />

                    {/* Tablica lokacija */}
                    <h5 className="mt-4">Lokacije skladišta</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Polica</th>
                                <th>Broj redova</th>
                                <th>Broj stupaca</th>
                                <th>Polica puna</th>
                                {isAdmin && <th>Akcije</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {lokacije.map((lok) => (
                                <tr key={lok.loK_ID}>
                                    <td>{lok.polica}</td>
                                    <td>{lok.bR_RED}</td>
                                    <td>{lok.bR_STUP}</td>
                                    <td>{lok.nemA_MJESTA ? "DA" : "NE"}</td>
                                    {isAdmin && (
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => otvoriModalUredi(lok)}
                                            >
                                                ✏️ Uredi
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* 🔹 Modal za dodavanje / uređivanje lokacije */}
            {isAdmin && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editMode ? "Uredi lokaciju" : "Dodaj novu lokaciju"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Polica</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={trenutnaLokacija.POLICA}
                                    onChange={(e) => setTrenutnaLokacija({ ...trenutnaLokacija, POLICA: e.target.value })}
                                    required
                                    disabled={editMode}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Broj redova</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={trenutnaLokacija.BR_RED}
                                    onChange={(e) => setTrenutnaLokacija({ ...trenutnaLokacija, BR_RED: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Broj stupaca</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={trenutnaLokacija.BR_STUP}
                                    onChange={(e) => setTrenutnaLokacija({ ...trenutnaLokacija, BR_STUP: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Polica puna"
                                    checked={trenutnaLokacija.NEMA_MJESTA}
                                    onChange={(e) => setTrenutnaLokacija({ ...trenutnaLokacija, NEMA_MJESTA: e.target.checked })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Zatvori</Button>
                        <Button variant="success" onClick={editMode ? handleUrediLokaciju : handleDodajLokaciju}>
                            {editMode ? "Spremi promjene" : "Dodaj lokaciju"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default PodatciSkladista;
