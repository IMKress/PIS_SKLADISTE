import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Card, Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import logo from './img/logo.png';
import autoTable from 'jspdf-autotable';

function OtpisDokumentInfo() {
    const { id } = useParams();
    const [dokument, setDokument] = useState(null);
    const [artikli, setArtikli] = useState([]);
    const [zaposlenikIme, setZaposlenikIme] = useState('');
    const [oznakaNarudzbenice, setOznakaNarudzbenice] = useState('');
    const [narucenaKolicinaMap, setNarucenaKolicinaMap] = useState({});
    const [isPrimka, setIsPrimka] = useState(null);
    const [dostavioIme, setDostavioIme] = useState('');
    const [dobavljacNaziv, setDobavljacNaziv] = useState('');
    const [skladiste, setSkladiste] = useState({
        skladisteId: 0,
        skladisteNaziv: '',
        adresaSkladista: '',
        brojTelefona: '',
        email: ''
    });

    const handleDownloadPDF = () => {
        if (!dokument) return;

        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.addImage(logo, 'PNG', 25, 25, 30, 15);
        doc.setFontSize(11);
        doc.text(`Datum: ${new Date(dokument.datumDokumenta).toLocaleDateString('hr-HR')}`, 150, 30);

        doc.setFontSize(17)
        doc.text(`${dokument.tipDokumenta}: ${dokument.oznakaDokumenta}`, 70, 45);
        doc.setFontSize(11);

        if (isPrimka) {
            doc.text(`Dobavljac: ${dobavljacNaziv}`, 21, 60);
            doc.line(40, 60.5, 100, 60.5);
            doc.text(`Primatelj: ${skladiste.skladisteNaziv}`, 105, 60);
            doc.line(123, 60.5, 180, 60.5);
        } else {
            doc.text(`Dobavljac: ${skladiste.skladisteNaziv}`, 21, 60);
            doc.line(42, 60.5, 100, 60.5);
        }


        if (isPrimka && oznakaNarudzbenice) {
            doc.text(`Narudžbenica: ${oznakaNarudzbenice}`, 21, 70);
        } else if (!isPrimka && dokument.mjestoTroska) {
            doc.text(`Mjesto troška: ${dokument.mjestoTroska}`, 21, 70);
        }
        doc.line(46, 70.5, 76, 70.5);
        doc.text(`Napomena:`, 21, 85);
        doc.rect(20, 80, 170, 30); // x, y, width, height
        if (dokument.napomena) doc.text(` ${dokument.napomena}`, 40, 85);

        const head = ['Artikl ID', 'Naziv', 'JMJ', 'Količina', 'Cijena', 'Ukupno'];
        if (isPrimka) {
            head.push('Naručena', 'Trenutna', 'Trenutna Cijena');
        }

        const body = artikli.map(a => {
            const row = [
                a.artiklId,
                a.artiklNaziv,
                a.artiklJmj,
                a.kolicina,
                a.cijena.toFixed(2),
                a.ukupnaCijena.toFixed(2)
            ];
            if (isPrimka) {
                row.push(
                    narucenaKolicinaMap[a.artiklId] || '-',
                    a.trenutnaKolicina,
                    (a.trenutnaKolicina * a.cijena).toFixed(2)
                );
            }
            return row;
        });

        const tableOptions = {
            startY: 115,
            head: [head],
            body,
            didDrawPage: (data) => {
                const tableBottomY = data.cursor.y;
                const lineY = tableBottomY + 56.7;


                doc.setFontSize(9);
                if (lineY < doc.internal.pageSize.height - 10) {
                    if (isPrimka) {
                        doc.setDrawColor(0);
                        doc.text(`Dostavio:`, 140, lineY - 6);
                        doc.line(130, lineY, 175, lineY);
                        doc.text(`${dokument.dostavio}`, 140, lineY - 1);
                        doc.text(`Preuzeo:`, 40, lineY - 6);
                        doc.line(30, lineY, 75, lineY);
                        doc.text(`${zaposlenikIme}`, 35, lineY - 1);
                    }
                    else {
                        doc.setDrawColor(0);
                        doc.text(`Izdao:`, 140, lineY - 6);
                        doc.line(130, lineY, 175, lineY);
                        doc.text(`${zaposlenikIme}`, 140, lineY - 1);
                    }
                }

            }
        };
        autoTable(doc, tableOptions);

        doc.save(`dokument_${dokument.oznakaDokumenta || id}.pdf`);
    };

    useEffect(() => {
        const auth = { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } };

        axios.get("https://localhost:5001/api/home/skladiste", auth)
            .then(res => { if (res.data) setSkladiste(res.data); });

    

        const fetchIzdatnicaData = async () => {
            const res = await axios.get(`https://localhost:5001/api/home/otpis_info/${id}`, auth);
            setDokument(res.data);
        
            if (res.data.zaposlenikId) {
                axios.get(`https://localhost:5001/api/home/username/${res.data.zaposlenikId}`, auth)
                    .then(resp => setZaposlenikIme(`${resp.data.firstName} ${resp.data.lastName}`))
                    .catch(() => setZaposlenikIme('Nepoznato'));
            }
        };

        const determineTypeAndFetch = async () => {
            try {
                const tipRes = await axios.get(`https://localhost:5001/api/home/joined_artikls_db_by_id/${id}`, auth);
                const tipDoc = tipRes.data;
                await fetchIzdatnicaData();

                const artRes = await axios.get(`https://localhost:5001/api/home/joined_artikls_db`, auth);
                const filtered = artRes.data.filter(a => a.dokumentId.toString() === id);
                setArtikli(filtered);
            } catch (err) {
                alert('Greška pri učitavanju dokumenta.');
            }
        };

        determineTypeAndFetch();
    }, [id]);

    const ukupnaKolicina = artikli.reduce((acc, a) => acc + a.kolicina, 0);

    if (!dokument) return <p>Učitavanje...</p>;

    return (
        <div className="container mt-4">
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Detalji dokumenta</Card.Title>
                    <p><strong>Oznaka:</strong> {dokument.oznakaDokumenta}</p>
                    <p><strong>Tip:</strong> {dokument.tipDokumenta}</p>
                    <p><strong>Datum:</strong> {new Date(dokument.datumDokumenta).toLocaleDateString('hr-HR')}</p>
                    <p><strong>Zaposlenik:</strong> {zaposlenikIme}</p>
                    <p><strong>Napomena:</strong> {dokument.napomena}</p>

                   
                </Card.Body>
            </Card>

            <h5 className="mt-4">Artikli:</h5>
            {artikli.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Oznaka</th>
                            <th>Naziv</th>
                            <th>JMJ</th>
                            <th>Količina</th>
                        
                          
                           
                        </tr>
                    </thead>
                    <tbody>
                        {artikli.map((a, i) => (
                            <tr key={i}>
                                <td>{a.artiklOznaka}</td>
                                <td>{a.artiklNaziv}</td>
                                <td>{a.artiklJmj}</td>
                                <td>{a.kolicina}</td>
                       
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={isPrimka ? 3 : 3}><strong>Ukupno:</strong></td>
                            {isPrimka && <td></td>}
                            <td><strong>{ukupnaKolicina}</strong></td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <p>Nema artikala za ovaj dokument.</p>
            )}
            <Button variant="info" className="mt-3" onClick={handleDownloadPDF}>
                Spremi kao PDF
            </Button>
        </div>
    );
}

export default OtpisDokumentInfo;
