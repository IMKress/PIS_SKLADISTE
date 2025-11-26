import React, { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    const pdfPreuzetRef = useRef(false);

    const preuzmiPdf = useCallback(() => {
        const doc = new jsPDF();
        const nazivDatoteke = oznaka ? `Izdatnica_${oznaka}.pdf` : 'Izdatnica.pdf';

        doc.setFontSize(14);
        doc.text(`Oznaka izdatnice: ${oznaka ?? 'N/A'}`, 14, 20);

        if (!nemaPodataka) {
            const stupci = [
                '#',
                'Artikl',
                'Polica',
                'Red',
                'Stupac',
                'Dokument (primka)',
                'Datum dokumenta',
                'Količina za izdati'
            ];

            const redovi = sortiraniPodaci.map((lokacija, index) => [
                index + 1,
                lokacija.artikl ?? lokacija.artiklNaziv ?? 'N/A',
                lokacija.polica,
                lokacija.red,
                lokacija.stupac,
                lokacija.oznakaDokumenta,
                lokacija.datumDokumenta,
                lokacija.kolicinaOduzeta
            ]);

            autoTable(doc, {
                head: [stupci],
                body: redovi,
                startY: 28
            });
        } else {
            doc.setFontSize(12);
            doc.text('Nema dostupnih podataka za prikaz.', 14, 30);
        }

        doc.save(nazivDatoteke);
    }, [nemaPodataka, oznaka, sortiraniPodaci]);

    useEffect(() => {
        if (!pdfPreuzetRef.current && (oznaka || !nemaPodataka)) {
            preuzmiPdf();
            pdfPreuzetRef.current = true;
        }
    }, [nemaPodataka, oznaka, preuzmiPdf]);

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
                    <Card className="mb-4">
                                    <Card.Body>
                    <div className="mb-3">
                        <p ><strong>ID izdatnice:</strong> {dokumentId ?? 'N/A'}</p>
                        <p ><strong>Oznaka izdatnice:</strong> {oznaka ?? 'N/A'}</p>
                        <p ><strong>Datum izdatnice:</strong> {datumIzdatnice ?? 'N/A'}</p>
                        <p><strong>Mjesto troška:</strong> {mjestoTroska ?? 'N/A'}</p>
                        {napomena ? (
                            <p className="mb-1"><strong>Napomena:</strong> {napomena}</p>
                        ) : null}
                        {ukupniZbrojCijena ? (
                            <p className="mb-1"><strong>Ukupna vrijednost:</strong> {ukupniZbrojCijena} €</p>
                        ) : null}
                    </div>
 </Card.Body>
            </Card>
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
                                    <tr key={`${lokacija.dokumentId ?? lokacija.DokumentId ?? 'dok'}-${lokacija.artiklId ?? lokacija.Artikl ?? 'art'}-${index}`}>
                                        <td>{index + 1}</td>
                                        <td>{lokacija.artikl ?? lokacija.artiklNaziv ?? 'N/A'}</td>
                                        <td>{lokacija.polica}</td>
                                        <td>{lokacija.red}</td>
                                        <td>{lokacija.stupac}</td>
                                        <td>{lokacija.oznakaDokumenta}</td>
                                        <td>{lokacija.datumDokumenta}</td>
                                        <td>{lokacija.kolicinaOduzeta}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={preuzmiPdf}>
                            Preuzmi PDF
                        </Button>
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
