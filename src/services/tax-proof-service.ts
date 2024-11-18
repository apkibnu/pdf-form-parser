import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as moment from 'moment';
import * as PdfParse from 'pdf-parse';
import { IDataA, IDataB, IDataC, IDataH, TaxProof } from 'src/domain/tax-proof';
import { generatePDF } from 'src/libs/generate-pdf';
import { renderPage } from 'src/libs/render-option';

@Injectable()
export class TaxProofService {
  async extractForm(filePath: string): Promise<Buffer> {
    const buffer = fs.readFileSync(filePath);
    const pdf = await PdfParse(buffer, { pagerender: renderPage });
    const dataA: IDataA = {
      a1: pdf.text.match(/A\.1  NPWP : (.*)/)[1].replace(/ +/g, ''),
      a2: pdf.text.match(/A\.2  NIK : (.*)/)[1],
      a3: pdf.text.match(/A\.3  Nama : (.*)/)[1],
    };
    const rawDataB6 = pdf.text.match(/B\.6\s(.*)/)[1].split(' ');
    const dataB: IDataB = {
      b1: rawDataB6[0],
      b2: rawDataB6[1],
      b3: parseFloat(rawDataB6[2].replace(/\./g, '').replace(',', '.')),
      b4: rawDataB6[3],
      b5: parseFloat(rawDataB6[4]),
      b6: parseFloat(rawDataB6[5].replace(/\./g, '').replace(',', '.')),
      b7: {
        docNo: pdf.text.match(/\sNomor Dokumen (.*)/)[1],
        docName: pdf.text.match(/Nama Dokumen (.*) Tanggal (.*)/)[1],
        date:
          pdf.text.match(/Nama Dokumen (.*) Tanggal (.*)/)[2] == 'dd mm yyyy'
            ? null
            : moment(
                pdf.text.match(/Nama Dokumen (.*) Tanggal (.*)/)[2],
                'DD MM YYYY',
              ).toDate(),
      },
      b8: {
        docNo: pdf.text.match(/Nomor Faktur Pajak (.*) Tanggal (.*)/)[1],
        date:
          pdf.text.match(/Nomor Faktur Pajak (.*) Tanggal (.*)/)[2] ==
          'dd mm yy'
            ? null
            : moment(
                pdf.text
                  .match(/Nomor Faktur Pajak (.*) Tanggal (.*)/)[2]
                  .replace(/dd|mm|yyyy/g, ''),
                'DD MM YYYY',
              ).toDate(),
      },
      b9: {
        status:
          pdf.text.match(/B\.9\s(\w+)[^]*Nomor\s:\s(.*)\sTanggal\s(.*)/)[1]
            .length > 3
            ? true
            : false,
        docNo: pdf.text.match(
          /B\.9\s(\w+)[^]*Nomor\s:\s(.*)\sTanggal\s(.*)/,
        )[2],
        date:
          pdf.text.match(/B\.9\s(\w+)[^]*Nomor\s:\s(.*)\sTanggal\s(.*)/)[3] ==
          'dd mm yyyy'
            ? null
            : moment(
                pdf.text
                  .match(/B\.9\s(\w+)[^]*Nomor\s:\s(.*)\sTanggal\s(.*)/)[3]
                  .replace(/dd|mm|yyyy/g, ''),
                'DD MM YYYY',
              ).toDate(),
      },
      b10: {
        status:
          pdf.text.match(/B\.10\s(\w+)[^]*berdasarkan\s:\s([^]*)B.11/)[1]
            .length > 3
            ? true
            : false,
        desc:
          pdf.text.match(/B\.10\s(\w+)[^]*berdasarkan\s:\s([^]*)B.11/)[2] ==
          '\n'
            ? ''
            : pdf.text.match(/B\.10\s(\w+)[^]*berdasarkan\s:\s([^]*)B.11/)[2],
      },
      b11: {
        status:
          pdf.text.match(/B\.11\s(\w+)[^]*Nomor\s:\s([^]*)B.12/)[1].length > 3
            ? true
            : false,
        desc:
          pdf.text.match(/B\.11\s(\w+)[^]*Nomor\s:\s([^]*)B.12/)[2] == '\n'
            ? ''
            : pdf.text.match(/B\.11\s(\w+)[^]*Nomor\s:\s([^]*)B.12/)[2],
      },
      b12: {
        status:
          pdf.text.match(/B\.12\s(\w+)[^]*berdasarkan:\s(.*)/)[1].length > 3
            ? true
            : false,
        desc: pdf.text.match(/B\.12\s(\w+)[^]*berdasarkan:\s(.*)/)[2],
      },
    };

    const dataC: IDataC = {
      c1: pdf.text.match(/C\.1\sNPWP\s:\s(.*)/)[1].replace(/ +/g, ''),
      c2: pdf.text.match(/C\.2\sNama Wajib Pajak\s:\s(.*)/)[1],
      c3:
        pdf.text.match(/C\.3\sTanggal\s:\s(.*)/)[1] == 'dd mm yyyy'
          ? null
          : moment(
              pdf.text
                .match(/C\.3\sTanggal\s:\s(.*)/)[1]
                .replace(/dd|mm|yyyy/g, ''),
              'DD MM YYYY',
            ).toDate(),
      c4: pdf.text.match(/C\.4\sNama Penandatangan\s:\s(.*)/)[1],
      c5: {
        opt1:
          pdf.text
            .match(/C\.5\s[^]*diajukan:[^](.*)[^](.*)/)[1]
            .substring(0, 1) == 'V'
            ? true
            : false,
        opt2:
          pdf.text
            .match(/C\.5\s[^]*diajukan:[^](.*)[^](.*)/)[2]
            .substring(0, 1) == 'V'
            ? true
            : false,
      },
    };

    const dataH: IDataH = {
      h1: pdf.text.match(/H\.1\sNOMOR.*:\s(.*)\sH.4/)[1].replace(/ +/g, ''),
      h2: {
        status:
          pdf.text.match(/H\.2\s(\w+)\sKe-\s(.)/)[1].substring(0, 1) == 'X'
            ? true
            : false,
        num: parseInt(pdf.text.match(/H\.2\s(\w+)\sKe-\s(.)/)[2]),
      },
    };

    const data = TaxProof.create({
      a: dataA,
      b: dataB,
      c: dataC,
      h: dataH,
    });

    const pdfOutput = generatePDF(data.unmarshal());

    try {
      const pdfBuffer = fs.readFileSync(pdfOutput);
      return pdfBuffer;
    } catch {
      throw new NotFoundException('File not found!');
    }
  }
}

// B\.12\s(\w+)[^]*berdasarkan:\s([^]*)
