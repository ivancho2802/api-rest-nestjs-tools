import { Controller, Get, Post, HttpCode, Header, StreamableFile, Res } from '@nestjs/common';
import { createReadStream, createWriteStream, readFile } from 'fs';
import { join } from 'path';
import type { Response } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  async findAll(@Res({ passthrough: true }) res: Response) {/* : Promise<StreamableFile> */
    let json = { "rows": [{ "quantity": "0.036654010000", "rate": "34921.088000000000" }, { "quantity": "0.361094850000", "rate": "34891.917000000000" }, { "quantity": "0.143418210000", "rate": "34863.074000000000" }, { "quantity": "0.000200840000", "rate": "34800.000000000000" }, { "quantity": "0.002000000000", "rate": "34788.527000000000" }, { "quantity": "0.001720170000", "rate": "34728.000000000000" }, { "quantity": "0.429759840000", "rate": "34707.251000000000" }, { "quantity": "0.000201420000", "rate": "34700.000000000000" }, { "quantity": "0.000461460000", "rate": "34663.760000000000" }, { "quantity": "0.006000000000", "rate": "34649.800000000000" }, { "quantity": "0.000199560000", "rate": "34648.204000000000" }, { "quantity": "0.001720170000", "rate": "34628.000000000000" }, { "quantity": "0.002000000000", "rate": "34621.418000000000" }, { "quantity": "0.000286750000", "rate": "34609.832000000000" }, { "quantity": "0.006000000000", "rate": "34608.200000000000" }, { "quantity": "0.000951380000", "rate": "34602.912000000000" }, { "quantity": "0.000502000000", "rate": "34600.000000000000" }, { "quantity": "0.000153820000", "rate": "34516.347000000000" }, { "quantity": "0.073376440000", "rate": "34500.000000000000" }, { "quantity": "0.000461460000", "rate": "34463.760000000000" }, { "quantity": "0.000300000000", "rate": "34454.000000000000" }, { "quantity": "0.001300000000", "rate": "34432.278000000000" }, { "quantity": "0.014766240000", "rate": "34415.011000000000" }, { "quantity": "0.000203180000", "rate": "34400.000000000000" }, { "quantity": "0.000610940000", "rate": "34355.432000000000" }], "ask": [{ "quantity": "0.036590180000", "rate": "35004.716000000000" }, { "quantity": "0.142770590000", "rate": "35021.218000000000" }, { "quantity": "0.286639210000", "rate": "35027.210000000000" }, { "quantity": "0.000200000000", "rate": "35234.062000000000" }, { "quantity": "0.006867760000", "rate": "35248.176000000000" }, { "quantity": "0.001419440000", "rate": "35278.000000000000" }, { "quantity": "0.000200000000", "rate": "35294.760000000000" }, { "quantity": "0.000500000000", "rate": "35298.000000000000" }, { "quantity": "0.000153820000", "rate": "35298.852000000000" }, { "quantity": "0.003693870000", "rate": "35299.720000000000" }, { "quantity": "0.005000000000", "rate": "35317.130000000000" }, { "quantity": "0.001322520000", "rate": "35320.891000000000" }, { "quantity": "0.001384130000", "rate": "35378.000000000000" }, { "quantity": "0.000461460000", "rate": "35463.760000000000" }, { "quantity": "0.000307640000", "rate": "35465.723000000000" }, { "quantity": "0.001365530000", "rate": "35474.081000000000" }, { "quantity": "0.001784130000", "rate": "35478.000000000000" }, { "quantity": "0.004965340000", "rate": "35490.000000000000" }, { "quantity": "0.041450000000", "rate": "35558.748000000000" }, { "quantity": "0.148635360000", "rate": "35558.749000000000" }, { "quantity": "0.001384130000", "rate": "35578.000000000000" }, { "quantity": "0.082710000000", "rate": "35635.945000000000" }, { "quantity": "0.103900070000", "rate": "35635.950000000000" }, { "quantity": "0.000461460000", "rate": "35663.760000000000" }, { "quantity": "0.001384130000", "rate": "35678.000000000000" }] };


    var xl = require('excel4node');

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Matriz');

    const headingColumnNames = Object.keys(json.rows[0])

    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
      ws.cell(1, headingColumnIndex++)
        .string(heading)
    });

    wb.write('ExcelFile.xlsx', function (err, stats) {
      if (err) {
        console.error(err);
      } else {
        console.log(stats); // Prints out an instance of a node.js fs.Stats object
        
        return stats;
      }
    });

    let buddet = await wb.writeToBuffer('ExcelFile.xlsx');

    return new StreamableFile(buddet);
  }

  @Post()
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  create(): string {
    return 'This action adds a new cat';
  }

  /* @Get('ab*cd')
findAll() {
    return 'This route uses a wildcard';
  } */

  convertJsonToCsv(myObj) {

    // 1. One way - if you want the results to be in double quotes and you have comas inside

    // choose another string to temporally replace commas if necessary
    let stringToReplaceComas = '!!!!';

    myObj.rows.map((singleRow: any) => {
      singleRow.map((value, index) => {
        singleRow[index] = value.replace(/,/g, stringToReplaceComas);
      })
    })

    let csv = `"${myObj.rows.join('"\n"').replace(/,/g, '","')}"`;
    // // or like this
    // let csv = `"${myObj.rows.join('"\n"').split(',').join('","')}"`;

    csv = csv.replace(new RegExp(`${stringToReplaceComas}`, 'g'), ',');
  }
}