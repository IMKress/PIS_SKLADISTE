import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from './img/logo.png';
import font from "./font/Roboto-Regular.js"

export function artikliInventuraPDF(artikli) {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    // Registriraj font
    doc.addFileToVFS("Roboto-Regular.ttf", font);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    const head = ['Artikl ID', 'Naziv', 'JMJ', "Kategorija", 'Količina', 'Cijena', "Trenutna Kolčina", "Razlika"];

    const body = artikli.map(a => [
        a.artiklOznaka,
        a.artiklNaziv,
        a.artiklJmj,
        a.kategorijaNaziv,
        a.stanje,
        a.cijena,
        "__________________",
        "__________________"
    ]);

    autoTable(doc, {
        head: [head],
        body,
        styles: { font: "Roboto" },       // <-- ovo forsira korištenje custom fonta
        headStyles: { font: "Roboto" },
        columnStyles: {
            6: { font: "Roboto" },        // zadnja kolona
            7: { font: "Roboto" }         // zadnja kolona
        }
    });

    doc.save(`inventura.pdf`);
}


/*
skladiste info:
-skladisteNaziv, adresaSkladista, skladisteBrojTelefona, skladisteEmail

dobavljac info:
-dobavljacNaziv, adresaDobavljaca, dobavljacBrojTelefona, dobavljacEmail

narudzbenica info:
-oznakaDokumenta, datumDokumenta, rokIsporuke, napomena
*/
export function genNarudzbenicaPdf(narudzbenica, artikli, dobavljac, skladiste, zaposlenikIme, detalji) {
    var pdfBase64Only = "";
    const doc = new jsPDF();
    const title = `Narud\u017Ebenica #${narudzbenica?.oznakaDokumenta || id}`;

    doc.setFontSize(11);
    doc.rect(15, 30, 85, 30); // x, y, width, height
    doc.rect(110, 30, 85, 30); // x, y, width, height
    // doc.text('Left side text', 20, 40);
    // doc.text('Right side text', 140, 40);
    //primatelj
    doc.text(dobavljac.dobavljacNaziv, 25, 37);
    doc.text(dobavljac.adresaDobavljaca, 25, 43);
    doc.text(dobavljac.brojTelefona, 25, 49);
    doc.text(dobavljac.email, 25, 55);
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
    //NAPOMENA KUTIJA:
    doc.rect(15, 95, 180, 30);
    doc.rect(15, 95, 180, 5);

    doc.setFontSize(8);
    doc.text("NAPOMENA: ", 17, 99);
    var napomenaSplit = doc.splitTextToSize(narudzbenica.napomena, 178);
    doc.text(napomenaSplit, 16, 103);
    doc.text("NARUCENA DOBRA - USLUGE ISPORUCITI NA NASLOV:", 20, 74);
    doc.text("ROK ISPORUKE:", 143, 74);
    doc.setFontSize(10)
    doc.text(new Date(detalji.rokIsporuke).toLocaleDateString('hr-HR'), 144, 80);

    const startY = detalji ? 130 : 45;

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
    pdfBase64Only = doc.output("datauristring").split(",")[1];

    console.log("PDF kao Base64:", pdfBase64Only);
    doc.save(`narudzbenica_${narudzbenica?.oznakaDokumenta || id}.pdf`);
    return pdfBase64Only;
};


export function genPrimkaPDF(dokument, artikli, dobavljac, skladiste, zaposlenikIme, oznakaNarudzbenice, narucenaKolicina, dostavio) {
    if (!dokument) return;
    console.log("Dokument primke: " + dokument)
    var pdfBase64Only = "";

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.addImage(logo, 'PNG', 25, 25, 30, 15);
    doc.setFontSize(11);
    doc.text(`Datum: ${new Date(dokument.DatumDokumenta).toLocaleDateString('hr-HR')}`, 150, 30);

    doc.setFontSize(17)
    doc.text(`Primka: ${dokument.OznakaDokumenta}`, 70, 45);
    doc.setFontSize(11);


    doc.text(`Dobavljac: ${dobavljac.dobavljacNaziv}`, 21, 60);
    doc.line(40, 60.5, 100, 60.5);
    doc.text(`Primatelj: ${skladiste.skladisteNaziv}`, 105, 60);
    doc.line(123, 60.5, 180, 60.5);




    doc.text(`Narudžbenica: ${oznakaNarudzbenice}`, 21, 70);

    doc.line(46, 70.5, 76, 70.5);
    doc.text(`Napomena:`, 21, 85);
    doc.rect(20, 80, 170, 30); // x, y, width, height
    if (dokument.napomena) doc.text(` ${dokument.napomena}`, 40, 85);

    const head = ['Artikl ID', 'Naziv', 'JMJ', 'Količina', 'Cijena', 'Ukupno'];

    head.push('Naručena', 'Trenutna', 'Trenutna Cijena');


    const body = artikli.map(a => {
        const row = [
            a.artiklId,
            a.artiklNaziv,
            a.artiklJmj,
            a.kolicina,
            a.cijena.toFixed(2),
            a.ukupnaCijena.toFixed(2)
        ];

        row.push(
            narucenaKolicina[a.artiklId] || '-',
            a.kolicina,
            (a.kolicina * a.cijena.toFixed(2)).toFixed(2)
        );

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

                doc.setDrawColor(0);
                doc.text(`Dostavio:`, 140, lineY - 6);
                doc.line(130, lineY, 175, lineY);
                doc.text(`${dostavio}`, 140, lineY - 1);
                doc.text(`Preuzeo:`, 40, lineY - 6);
                doc.line(30, lineY, 75, lineY);
                doc.text(`${zaposlenikIme}`, 35, lineY - 1);

            }

        }
    };
    autoTable(doc, tableOptions);
    pdfBase64Only = doc.output("datauristring").split(",")[1];

    doc.save(`dokument_${dokument.OznakaDokumenta || 'nepoznato'}.pdf`);
    return pdfBase64Only;
};