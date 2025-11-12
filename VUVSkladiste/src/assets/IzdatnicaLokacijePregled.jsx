import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Container, Table, Button, Alert } from 'react-bootstrap';

function IzdatnicaLokacijePregled() {
    const location = useLocation();
    const navigate = useNavigate();
    const { lokacije = [], dokumentId, oznaka, mjestoTroska } = location.state || {};

    const handleBack = () => {
        navigate('/Dokumenti');
    };

    if (!location.state) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Nema podataka za prikaz. Vratite se na dokumente.
                </Alert>
                <Button variant="primary" onClick={handleBack}>
                    Povratak na dokumente
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header as="h4" className="text-light">
                    Lokacije izdanih artikala
                </Card.Header>
                <Card.Body>
                    <p className="mb-1">
                        <strong>Dokument ID:</strong> {dokumentId}
                    </p>
                    {oznaka && (
                        <p className="mb-1">
                            <strong>Oznaka dokumenta:</strong> {oznaka}
                        </p>
                    )}
                    {mjestoTroska && (
                        <p className="mb-3">
                            <strong>Mjesto troška:</strong> {mjestoTroska}
                        </p>
                    )}

                    {lokacije.length === 0 ? (
                        <Alert variant="info" className="mt-3">
                            Spremljena procedura nije vratila nijednu lokaciju. Provjerite zalihe i podatke u bazi.
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive className="mt-3">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Artikl</th>
                                    <th>Količina</th>
                                    <th>Lokacija</th>
                                    <th>Polica</th>
                                    <th>Red</th>
                                    <th>Stupac</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lokacije.map((stavka, index) => (
                                    <tr key={`${stavka.dokumentId || dokumentId}-${stavka.artiklId || index}-${index}`}>
                                        <td>{stavka.rbArtikla || index + 1}</td>
                                        <td>{stavka.artiklNaziv || stavka.artiklId}</td>
                                        <td>{stavka.izdanaKolicina ?? stavka.kolicina ?? '-'}</td>
                                        <td>{stavka.lokacijaOznaka || stavka.lokacija || '-'}</td>
                                        <td>{stavka.polica || '-'}</td>
                                        <td>{stavka.red ?? '-'}</td>
                                        <td>{stavka.stupac ?? '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="primary" onClick={handleBack}>
                            Povratak na dokumente
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default IzdatnicaLokacijePregled;
