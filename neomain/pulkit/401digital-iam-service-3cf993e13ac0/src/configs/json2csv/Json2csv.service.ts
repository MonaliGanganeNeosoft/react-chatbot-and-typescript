import { json2csv } from 'json-2-csv-ts';
import * as fs from 'fs'; 

export const generateCSV = async (data,fileName): Promise<any> => {
  const writeStream = fs.createWriteStream(`public/contracts/${fileName}.csv`)  
    try {
      const result = json2csv(data)
      writeStream.write(result, () => {
        // a line was written to stream
      })
      writeStream.end()
      writeStream.on('finish', () => {
        console.log('finish write stream, moving along')
      }).on('error', (err) => {
          console.log(err)
      })
      console.log(result);
    } catch (err) {
      console.error(err);
    }
}