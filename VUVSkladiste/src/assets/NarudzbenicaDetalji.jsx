import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Table, Button, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function NarudzbenicaDetalji() {
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [closingStatus, setClosingStatus] = useState(false);
    const [aktivniStatusId, setAktivniStatusId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [allArtikli, setAllArtikli] = useState([]);
    const [selectedArtikl, setSelectedArtikl] = useState('');
    const [kolicinaArtikla, setKolicinaArtikla] = useState('');
    const [cijenaArtikla, setCijenaArtikla] = useState('');
    const [ukupnoArtikla, setUkupnoArtikla] = useState(0);
    const [addingArtikl, setAddingArtikl] = useState(false);
    const [editingArtiklId, setEditingArtiklId] = useState(null);
    const [editKolicina, setEditKolicina] = useState('');
    const [editCijena, setEditCijena] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const [narudzbenica, setNarudzbenica] = useState(null);
    const [artikli, setArtikli] = useState([]);
    const [zaposlenikIme, setZaposlenikIme] = useState(null);
    const [statusDokumenta, setStatusDokumenta] = useState(null);
    const [detalji, setDetalji] = useState(null);
    const [nazivPlacanja, setNazivPlacanja] = useState(null);
    const [dobavljacNaziv, setDobavljacNaziv] = useState('');
    const [loading, setLoading] = useState(true);
    const [primke, setPrimke] = useState([]);

    const handleDownloadPDF = () => {

        const doc = new jsPDF();
        const title = `Narud\u017Ebenica #${narudzbenica?.oznakaDokumenta || id}`;

        doc.setFontSize(11);
        doc.rect(15, 30, 85, 30); // x, y, width, height
        doc.rect(110, 30, 85, 30); // x, y, width, height
        // doc.text('Left side text', 20, 40);
        // doc.text('Right side text', 140, 40);
        //primatelj
        doc.text(skladiste.skladisteNaziv, 25, 37);
        doc.text(skladiste.adresaSkladista, 25, 43);
        doc.text(skladiste.brojTelefona, 25, 49);
        doc.text(skladiste.email, 25, 55);
        //posiljatelj
        doc.text(skladiste.skladisteNaziv, 120, 37);
        doc.text(skladiste.adresaSkladista, 120, 43);
        doc.text(skladiste.brojTelefona, 120, 49);
        doc.text(skladiste.email, 120, 55);
        doc.setFontSize(9);
        doc.text("KUPAC (PRIMATELJ) naziv - ime i prezime", 28, 25);
        doc.text("adresa - mjesto, ulica i broj telefona", 32, 29);
        doc.text("ISPORUCITELJ (PRODAVATELJ) naziv - ime i prezime", 112, 25);
        doc.text("adresa - mjesto, ulica i broj telefona", 128, 29);
        doc.setFontSize(11);
        doc.text(`Datum: ${new Date(narudzbenica.datumDokumenta).toLocaleDateString('hr-HR')}`, 15, 65);
        doc.setFontSize(15);
        doc.text(title, 111, 66);
        //narucena roba kutija
        doc.rect(15, 70, 85, 20);
        doc.rect(15, 70, 85, 5);
        //rok isporuke kutija
        doc.rect(128, 70, 50, 20);
        doc.rect(128, 70, 50, 5);
        doc.setFontSize(8);
        doc.text("NARUCENA DOBRA - USLUGE ISPORUCITI NA NASLOV:", 20, 74);
        doc.text("ROK ISPORUKE:", 143, 74);

        /*
                if (detalji) {
                    doc.text(`Mjesto isporuke: ${detalji.mjestoIsporuke}`, 10, 49);
                    doc.text(`Rok isporuke: ${new Date(detalji.rokIsporuke).toLocaleDateString('hr-HR')}`, 10, 56);
                    doc.text(`Na\u010Din pla\u0107anja: ${nazivPlacanja || detalji.nP_Id}`, 10, 63);
                }*/

        const startY = detalji ? 100 : 45;

        const tableBody = artikli.map((a, idx) => [
            idx + 1,
            a.artiklNaziv,
            a.kolicina,
            a.cijena.toFixed(2),
            a.ukupnaCijena.toFixed(2)
        ]);

        const tableOptions = {
            startY,
            head: [['#', 'Artikl', 'Koli\u010Dina', 'Cijena', 'Ukupna cijena']],
            body: tableBody,
            didDrawPage: (data) => {
                const tableBottomY = data.cursor.y; // bottom Y of the table
                const lineY = tableBottomY + 56.7; // 2 cm below

                doc.text(`Izdao:`, 140, lineY - 6);
                doc.setFontSize(9);

                doc.text(`${zaposlenikIme}`, 140, lineY - 1);
                // Make sure the line fits on the page
                if (lineY < doc.internal.pageSize.height - 10) {
                    doc.setDrawColor(0); // black
                    //   doc.line(35, lineY, 80, lineY); // draw line from x=15 to x=195
                    doc.line(130, lineY, 175, lineY); // draw line from x=15 to x=195

                }
            }
        };
        autoTable(doc, tableOptions);

        doc.save(`narudzbenica_${narudzbenica?.oznakaDokumenta || id}.pdf`);
    };
    const [skladiste, setSkladiste] = useState({
        skladisteId: 0,
        skladisteNaziv: "",
        adresaSkladista: "",
        brojTelefona: "",
        email: ""
    });
    useEffect(() => {
        axios.get("https://localhost:5001/api/home/skladiste", {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
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
    useEffect(() => {
        const fetchAllArtikli = async () => {
            try {
                const res = await axios.get('https://localhost:5001/api/home/artikli_db', {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                });
                setAllArtikli(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAllArtikli();
    }, []);

    useEffect(() => {
        const fetchPrimke = async () => {
            try {
                const auth = { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } };
                const docsRes = await axios.get('https://localhost:5001/api/home/joined_dokument_tip', auth);
                const primkeDocs = docsRes.data.filter(d => d.tipDokumenta === 'Primka');
                const infos = await Promise.all(
                    primkeDocs.map(doc =>
                        axios.get(`https://localhost:5001/api/home/primka_info/${doc.dokumentId}`, auth)
                            .then(r => r.data)
                            .catch(() => null)
                    )
                );
                const filt = infos.filter(p => p && p.narudzbenicaId === parseInt(id));
                setPrimke(filt);
            } catch (err) {
                console.error('Greška pri dohvaćanju primki:', err);
            }
        };
        fetchPrimke();
    }, [id]);

    useEffect(() => {
        if (kolicinaArtikla && cijenaArtikla) {
            setUkupnoArtikla(parseFloat(kolicinaArtikla) * parseFloat(cijenaArtikla));
        } else {
            setUkupnoArtikla(0);
        }
    }, [kolicinaArtikla, cijenaArtikla]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`https://localhost:5001/api/home/obrisiDokument/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Dokument uspješno obrisan.");
            navigate("/narudzbenice");
        } catch (error) {
            console.error("Greška pri brisanju:", error);
            alert("Greška pri brisanju dokumenta.");
        } finally {
            setDeleting(false);
            setShowModal(false);
        }
    };

    const handlePromijeniStatus = async () => {
        handleDownloadPDF();
        const token = sessionStorage.getItem('token');
        const zaposlenikId = sessionStorage.getItem('UserId');

        if (!zaposlenikId) {
            alert("Korisnik nije prijavljen.");
            return;
        }

        setChangingStatus(true);
        try {
            const body = {
                dokumentId: parseInt(id),
                statusId: 3, //3=isporuka
                datum: new Date().toISOString(),
                zaposlenikId
            };

            const res = await axios.put(
                `https://localhost:5001/api/home/uredi_status_dokumenta`,
                body,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                alert("Status uspješno promijenjen.");
                setStatusDokumenta("Isporuka");
                setAktivniStatusId(3);
            } else {
                alert("Greška pri promjeni statusa.");
            }
        } catch (err) {
            console.error(err);
            alert("Došlo je do greške.");
        } finally {
            setChangingStatus(false);
        }
    };

    const handleZatvoriNarudzbenicu = async () => {
        const token = sessionStorage.getItem('token');
        const zaposlenikId = sessionStorage.getItem('UserId');

        if (!zaposlenikId) {
            alert("Korisnik nije prijavljen.");
            return;
        }

        setClosingStatus(true);
        try {
            const body = {
                dokumentId: parseInt(id),
                statusId: 2, //2=zatvoren
                datum: new Date().toISOString(),
                zaposlenikId
            };

            const res = await axios.put(
                `https://localhost:5001/api/home/uredi_status_dokumenta`,
                body,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                alert("Status uspješno promijenjen.");
                setStatusDokumenta("Zatvorena");
                setAktivniStatusId(2);
            } else {
                alert("Greška pri promjeni statusa.");
            }
        } catch (err) {
            console.error(err);
            alert("Došlo je do greške.");
        } finally {
            setClosingStatus(false);
        }
    };

    const handleDodajArtikl = async () => {
        if (!selectedArtikl || !kolicinaArtikla || !cijenaArtikla) {
            alert('Popunite sva polja.');
            return;
        }
        if (artikli.some(a => a.artiklId === parseInt(selectedArtikl))) {
            alert('Artikl je već dodan.');
            return;
        }
        setAddingArtikl(true);
        const token = sessionStorage.getItem('token');
        const zaposlenikId = sessionStorage.getItem('UserId');
        try {
            const body = {
                id: 0,
                DokumentId: parseInt(id),
                RbArtikla: artikli.length + 1,
                Kolicina: parseFloat(kolicinaArtikla),
                Cijena: parseFloat(cijenaArtikla),
                UkupnaCijena: parseFloat(kolicinaArtikla) * parseFloat(cijenaArtikla),
                ArtiklId: parseInt(selectedArtikl),
                TrenutnaKolicina: 0,
                ZaposlenikId: zaposlenikId
            };

            const res = await axios.post('https://localhost:5001/api/home/add_artDok', body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 200) {
                const artResponse = await axios.get(`https://localhost:5001/api/home/artikli_by_dokument/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setArtikli(artResponse.data);
                setSelectedArtikl('');
                setKolicinaArtikla('');
                setCijenaArtikla('');
                setShowAddForm(false);
            } else {
                alert('Greška pri dodavanju artikla.');
            }
        } catch (err) {

            if (err.response && err.response.status === 409) {
                alert('Artikl je već dodan.');
            } else {
                console.error(err);
                alert('Došlo je do greške.');
            }
        } finally {
            setAddingArtikl(false);
        }
    };

    const handleEditClick = (a) => {
        setEditingArtiklId(a.artiklId);
        setEditKolicina(a.kolicina);
        setEditCijena(a.cijena);
    };

    const handleSaveEdit = async () => {
        if (!editKolicina || !editCijena) {
            alert('Popunite sva polja.');
            return;
        }
        setSavingEdit(true);
        const token = sessionStorage.getItem('token');
        try {
            const body = {
                DokumentId: parseInt(id),
                ArtiklId: editingArtiklId,
                Kolicina: parseFloat(editKolicina),
                Cijena: parseFloat(editCijena)
            };
            await axios.put('https://localhost:5001/api/home/update_artDok', body, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const artResponse = await axios.get(`https://localhost:5001/api/home/artikli_by_dokument/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArtikli(artResponse.data);
            setEditingArtiklId(null);
        } catch (err) {
            console.error(err);
            alert('Greška pri ažuriranju.');
        } finally {
            setSavingEdit(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingArtiklId(null);
        setEditKolicina('');
        setEditCijena('');
    };

    const handleRokSave = async () => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.put('https://localhost:5001/api/home/narudzbenica_rok', {
                dokumentId: parseInt(id),
                rokIsporuke: detalji.rokIsporuke
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Rok isporuke ažuriran.');
        } catch (err) {
            alert('Greška pri spremanju roka.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');

                const response = await axios.get(`https://localhost:5001/api/home/joined_narudzbenice`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const allNarudzbenice = response.data;

                const target = allNarudzbenice.find(d => d.dokumentId == id);
                if (!target) {
                    setNarudzbenica(null);
                    return;
                }
                setNarudzbenica(target);

                if (target.dobavljacId) {
                    const dobRes = await axios.get(`https://localhost:5001/api/home/dobavljaciDTO/${target.dobavljacId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setDobavljacNaziv(dobRes.data.dobavljacNaziv || dobRes.data.DobavljacNaziv);
                }

                if (target.zaposlenikId) {
                    const userResponse = await axios.get(`https://localhost:5001/api/home/username/${target.zaposlenikId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const { firstName, lastName } = userResponse.data;
                    setZaposlenikIme(`${firstName} ${lastName}`);
                }

                const artResponse = await axios.get(`https://localhost:5001/api/home/artikli_by_dokument/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setArtikli(artResponse.data);

                const statusResponse = await axios.get(`https://localhost:5001/api/home/statusi_dokumenata_by_dokument/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statusResponse.data && statusResponse.data.length > 0) {
                    const aktivni = statusResponse.data.find(
                        s => s.aktivan === true || s.aktivan === 1 || s.Aktivan === true || s.Aktivan === 1
                    );
                    const latest = statusResponse.data[statusResponse.data.length - 1];
                    const naziv = aktivni?.statusNaziv || aktivni?.StatusNaziv || latest.statusNaziv || latest.StatusNaziv;
                    const idStatusa = aktivni?.statusId || aktivni?.StatusId || latest.statusId || latest.StatusId;
                    setStatusDokumenta(naziv);
                    setAktivniStatusId(parseInt(idStatusa, 10));
                }

                const detaljiResponse = await axios.get(`https://localhost:5001/api/home/narudzbenica_detalji/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setDetalji(detaljiResponse.data);

                if (detaljiResponse.data?.nP_Id) {
                    const npResponse = await axios.get(`https://localhost:5001/api/home/nacini_placanja`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const nacin = npResponse.data.find(n => n.nP_Id === detaljiResponse.data.nP_Id);
                    if (nacin) setNazivPlacanja(nacin.nP_Naziv);
                }

            } catch (err) {
                alert('Greška prilikom dohvaćanja podataka.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    if (!narudzbenica) {
        return <div className="text-center mt-5">Narudžbenica nije pronađena. (ID: {id})</div>;
    }

    return (
        <Container className="mt-4">
            <Card id="narudzbenica-pdf">
                <Card.Body>
                    <h3>Pregled Narudžbenice #{narudzbenica.oznakaDokumenta}</h3>
                    <p><strong>Datum:</strong> {new Date(narudzbenica.datumDokumenta).toLocaleDateString('hr-HR')}</p>
                    <p><strong>Zaposlenik:</strong> {zaposlenikIme}</p>
                    {dobavljacNaziv && (
                        <p><strong>Dobavljač:</strong> {dobavljacNaziv}</p>
                    )}
                    <p><strong>Tip dokumenta:</strong> {narudzbenica.tipDokumenta}</p>
                    <p><strong>Status:</strong> {statusDokumenta || "Nepoznat"}</p>

                    {detalji && (
                        <>
                            <p><strong>Mjesto isporuke:</strong> {detalji.mjestoIsporuke}</p>
                            {aktivniStatusId === 1 ? (
                                <div className="mb-2">
                                    <strong>Rok isporuke:</strong>{' '}
                                    <input type="date" min={new Date().toISOString().split('T')[0]} value={new Date(detalji.rokIsporuke).toLocaleDateString('en-CA')} onChange={e => setDetalji(prev => ({ ...prev, rokIsporuke: e.target.value }))} />
                                    <Button size="sm" className="ms-2" onClick={handleRokSave}>Spremi</Button>
                                </div>
                            ) : (
                                <p><strong>Rok isporuke:</strong> {new Date(detalji.rokIsporuke).toLocaleDateString('hr-HR')}</p>
                            )}
                            <p><strong>Način plaćanja:</strong> {nazivPlacanja || `ID: ${detalji.nP_Id}`}</p>
                        </>
                    )}

                    <h5 className="mt-4">Stavke</h5>
                    {artikli.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Oznaka</th>
                                    <th>Naziv</th>
                                    <th>Jmj</th>
                                    <th>Količina</th>
                                    <th>Cijena</th>
                                    <th>Ukupna cijena</th>
                                    {aktivniStatusId === 1 && <th></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {artikli.map((a, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{a.artiklOznaka}</td>
                                        <td>{a.artiklNaziv}</td>
                                        <td>{a.artiklJmj}</td>
                                        <td>
                                            {editingArtiklId === a.artiklId ? (
                                                <Form.Control type="number" value={editKolicina} onChange={e => setEditKolicina(e.target.value)} />
                                            ) : (
                                                a.kolicina
                                            )}
                                        </td>
                                        <td>
                                            {editingArtiklId === a.artiklId ? (
                                                <Form.Control type="number" value={editCijena} onChange={e => setEditCijena(e.target.value)} />
                                            ) : (
                                                a.cijena
                                            )}
                                        </td>
                                        <td>{editingArtiklId === a.artiklId ? (parseFloat(editKolicina || 0) * parseFloat(editCijena || 0)).toFixed(2) : a.ukupnaCijena}</td>
                                        {aktivniStatusId === 1 && (
                                            <td>
                                                {editingArtiklId === a.artiklId ? (
                                                    <>
                                                        <Button variant="success" size="sm" className="me-1" onClick={handleSaveEdit} disabled={savingEdit}>
                                                            {savingEdit ? 'Spremam...' : 'Spremi'}
                                                        </Button>
                                                        <Button variant="secondary" size="sm" onClick={handleCancelEdit}>Odustani</Button>
                                                    </>
                                                ) : (
                                                    <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(a)}>Uredi</Button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Ova narudžbenica nema artikala.</p>
                    )}

                    {aktivniStatusId === 1 && !showAddForm && (
                        <Button variant="primary" className="mt-2" onClick={() => setShowAddForm(true)}>
                            Dodaj Artikl
                        </Button>
                    )}

                    {aktivniStatusId === 1 && showAddForm && (
                        <div className="mt-3">
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Artikl</Form.Label>
                                        <Form.Control as="select" value={selectedArtikl} onChange={(e) => setSelectedArtikl(e.target.value)}>
                                            <option value="">-- Odaberi --</option>
                                            {allArtikli
                                                .filter(a => !artikli.some(exists => exists.artiklId === a.artiklId))
                                                .map(a => (
                                                    <option key={a.artiklId} value={a.artiklId}>
                                                        {a.artiklNaziv} ({a.artiklJmj})
                                                    </option>
                                                ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Količina</Form.Label>
                                        <Form.Control type="number" value={kolicinaArtikla} onChange={(e) => setKolicinaArtikla(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Cijena</Form.Label>
                                        <Form.Control type="number" value={cijenaArtikla} onChange={(e) => setCijenaArtikla(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Ukupno</Form.Label>
                                        <Form.Control type="text" value={ukupnoArtikla.toFixed(2)} readOnly />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="mt-2">
                                <Button variant="success" onClick={handleDodajArtikl} disabled={addingArtikl} className="me-2">
                                    {addingArtikl ? 'Spremam...' : 'Spremi'}
                                </Button>
                                <Button variant="secondary" onClick={() => { setShowAddForm(false); setSelectedArtikl(''); setKolicinaArtikla(''); setCijenaArtikla(''); }}>
                                    Odustani
                                </Button>
                            </div>
                        </div>
                    )}

                    <h5 className="mt-4">Primke povezane s ovom narudžbenicom</h5>
                    {primke.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Oznaka</th>
                                    <th>Datum</th>
                                    <th>Detalji</th>
                                </tr>
                            </thead>
                            <tbody>
                                {primke.map(p => (
                                    <tr key={p.dokumentId}>
                                        <td>{p.dokumentId}</td>
                                        <td>{p.oznakaDokumenta}</td>
                                        <td>{new Date(p.datumDokumenta).toLocaleDateString('hr-HR')}</td>
                                        <td>
                                            <Button variant="info" size="sm" onClick={() => navigate(`/dokument-info/${p.dokumentId}`)}>
                                                Detalji
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Nema povezanih primki.</p>
                    )}

                    {aktivniStatusId === 1 && (
                        <Button variant="danger" className="ms-2" onClick={() => setShowModal(true)}>
                            Obriši narudžbenicu
                        </Button>
                    )}

                    {aktivniStatusId !== 3 && aktivniStatusId !== 2 && (
                        <Button
                            variant="warning"
                            onClick={handlePromijeniStatus}
                            disabled={changingStatus}
                            className="me-2"
                        >
                            {changingStatus ? 'Šaljem...' : 'Isporuka'}
                        </Button>
                    )}

                    {aktivniStatusId !== 2 && (
                        <Button
                            variant="success"
                            onClick={handleZatvoriNarudzbenicu}
                            disabled={closingStatus}
                            className="me-2"
                        >
                            {closingStatus ? 'Zatvaram...' : 'Zatvori narudžbenicu'}
                        </Button>
                    )}

                    <Button variant="info" className="me-2" onClick={handleDownloadPDF}>
                        Spremi kao PDF
                    </Button>

                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Potvrda brisanja</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Jeste li sigurni da želite obrisati ovu narudžbenicu? Ova radnja je nepovratna i obrisat će i povezane primke.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Odustani
                            </Button>
                            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                                {deleting ? "Brišem..." : "Obriši"}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Button variant="secondary" onClick={() => navigate(-1)}>Natrag</Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default NarudzbenicaDetalji;
