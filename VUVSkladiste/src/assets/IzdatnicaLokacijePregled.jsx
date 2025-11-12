import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Alert } from 'react-bootstrap';

function IzdatnicaLokacijePregled() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        lokacijePodaci = [],
        dokumentId,
        oznaka,
        mjestoTroska,
        napomena,
        datumIzdatnice,
        ukupniZbrojCijena
    } = location.state || {};

    const sortiraniPodaci = Array.isArray(lokacijePodaci)
        ? [...lokacijePodaci]
        : [];

    const nemaPodataka = sortiraniPodaci.length === 0;

    const handlePovratak = () => {
        navigate('/Dokumenti');
    };

    return (
        <Container className="mt-4">
            <Card className="form-card">
                <Card.Header as="h4" className="text-light">
                    Lokacije artikala za izdatnicu
                </Card.Header>
                <Card.Body>
                    <div className="mb-3">
                        <p className="mb-1"><strong>ID izdatnice:</strong> {dokumentId ?? 'N/A'}</p>
                        <p className="mb-1"><strong>Oznaka izdatnice:</strong> {oznaka ?? 'N/A'}</p>
                        <p className="mb-1"><strong>Datum izdatnice:</strong> {datumIzdatnice ?? 'N/A'}</p>
                        <p className="mb-1"><strong>Mjesto troška:</strong> {mjestoTroska ?? 'N/A'}</p>
                        {napomena ? (
                            <p className="mb-1"><strong>Napomena:</strong> {napomena}</p>
                        ) : null}
                        {ukupniZbrojCijena ? (
                            <p className="mb-1"><strong>Ukupna vrijednost:</strong> {ukupniZbrojCijena} €</p>
                        ) : null}
                    </div>

                    {nemaPodataka ? (
                        <Alert variant="warning">
                            Nije bilo moguće dohvatiti podatke o lokacijama za artikle ove izdatnice.
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Artikl</th>
                                    <th>Polica</th>
                                    <th>Red</th>
                                    <th>Stupac</th>
                                    <th>Dokument (primka)</th>
                                    <th>Datum dokumenta</th>
                                    <th>Količina za izdati</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortiraniPodaci.map((lokacija, index) => (
                                    <tr key={`${lokacija.DokumentId}-${lokacija.Artikl}-${index}`}>
                                        <td>{index + 1}</td>
                                        <td>{lokacija.artikl}</td>
                                        <td>{lokacija.polica}</td>
                                        <td>{lokacija.red}</td>
                                        <td>{lokacija.stupac}</td>
                                        <td>{lokacija.oznakaDokumenta}</td>
                                        <td>{lokacija.datumDokumenta}</td>
                                        <td>{lokacija.trazenaKolicina}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="primary" onClick={handlePovratak}>
                            Povratak na dokumente
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default IzdatnicaLokacijePregled;
