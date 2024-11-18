import jsPDF from 'jspdf';
import * as moment from 'moment';
import { ITaxProof, TaxProof } from 'src/domain/tax-proof';

export function generatePDF(data: ITaxProof): string {
  const doc = new jsPDF({ format: 'a4' });
  doc.text(`H1 : ${data.h.h1}`, 20, 25);
  doc.text(
    `H2 : Checked : ${data.h.h2.status}, Pembetulan ke-${data.h.h2.num}`,
    20,
    32,
  );

  doc.text(`A1 : ${data.a.a1}`, 20, 46);
  doc.text(`A2 : ${data.a.a2}`, 20, 53);
  doc.text(`A3 : ${data.a.a3}`, 20, 60);

  doc.text(`B1 : ${data.b.b1}`, 20, 81);
  doc.text(`B2 : ${data.b.b2}`, 20, 88);
  doc.text(`B3 : ${data.b.b3}`, 20, 95);
  doc.text(`B4 : ${data.b.b4}`, 20, 102);
  doc.text(`B5 : ${data.b.b5}`, 20, 109);
  doc.text(`B6 : ${data.b.b6}`, 20, 116);
  doc.text(
    `B7 : No Doc : ${data.b.b7.docNo}, Nama Doc : ${data.b.b7.docName}, Tanggal: ${data.b.b7.date ? moment(data.b.b7.date).format('DD-MM-YYYY') : ''}`,
    20,
    123,
  );
  doc.text(
    `B8 : No Faktur : ${data.b.b8.docNo}, Tanggal: ${data.b.b8.date ? moment(data.b.b8.date).format('DD-MM-YYYY') : ''}`,
    20,
    130,
  );
  doc.text(
    `B9 : Checked : ${data.b.b9.status}, No : ${data.b.b9.docNo}, Tanggal: ${data.b.b9.date ? moment(data.b.b9.date).format('DD-MM-YYYY') : ''}`,
    20,
    137,
  );
  doc.text(
    `B10 : Checked : ${data.b.b10.status}, Desc : ${data.b.b10.desc}`,
    20,
    144,
  );
  doc.text(
    `B11 : Checked : ${data.b.b11.status}, Desc : ${data.b.b11.desc}`,
    20,
    151,
  );
  doc.text(
    `B12 : Checked : ${data.b.b12.status}, Desc : ${data.b.b12.desc}`,
    20,
    158,
  );

  doc.text(`C1 : ${data.c.c1}`, 20, 172);
  doc.text(`C2 : ${data.c.c2}`, 20, 179);
  doc.text(
    `C3 : ${data.c.c3 ? moment(data.c.c3).format('DD-MM-YYYY') : ''}`,
    20,
    186,
  );
  doc.text(`C4 : ${data.c.c4}`, 20, 193);
  doc.text(
    `C5 : Option 1 : ${data.c.c5.opt1}, Option 2 : ${data.c.c5.opt2}`,
    20,
    200,
  );

  const fileName = `storage/pdf-output/pdf-${moment().format('DDMMYYYYHHmmss')}.pdf`;

  doc.save(fileName);
  return fileName;
}
