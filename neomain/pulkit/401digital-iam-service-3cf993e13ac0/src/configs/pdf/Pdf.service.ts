import * as pdf from 'html-pdf';
import * as ejs from 'ejs';

export const generateContractPdf = async (data): Promise<any> => {

    const filename = `contract.pdf`;
    const location = `public/contracts/${filename}`;
    const content = await getContractTemp(data);
    return new Promise((resolve, reject) => {
         pdf.create(content, {
            format: 'A4',
            orientation: 'portrait',
            directory: 'public/uploads/contracts/',
            type: 'pdf'
        }).toFile(location, function (err, res) {
            if (err) return reject(err);
            return resolve(res);
        });
    });
     
}

export const generatePdfInvoice = async (data,domain): Promise<any> => {
    const filename = `invoice.pdf`;
    const location = `public/contracts/${filename}`;
    const content = await getContractInvoiceTemp(data,domain);
    return new Promise((resolve, reject) => {
         pdf.create(content, {
            format: 'A4',
            orientation: 'portrait',
            directory: 'public/uploads/contracts/',
            type: 'pdf'
        }).toFile(location, function (err, res) {
            if (err) return reject(err);
            return resolve(res);
        });
    });
}
export const getContractTemp = async (data): Promise<any> =>{
    console.log('===================>',data.contractType);

    let renderData =  await ejs.renderFile('src/config/pdf/templates/allaround.ejs',data);
    
    if(data.contractType=='maintenance'){
         renderData =  await ejs.renderFile('src/config/pdf/templates/maintenance.ejs',data);
    }
    if(data.contractType=='nationall'){
        renderData =  await ejs.renderFile('src/config/pdf/templates/nationall.ejs',data);
   }
    return renderData;
   
}
export const getContractInvoiceTemp = async (data,domain): Promise<any> =>{
    let renderData = ''
    if(data.length<10){
        renderData+=  await ejs.renderFile('src/config/pdf/templates/invoice.ejs',{data,domain});
        return renderData;
    }
    let i,j,temparray;
    const chunk = 20;
    for (i=0,j=data.length; i<j; i+=chunk) {
        temparray = data.slice(i,i+chunk);
        renderData+=  await ejs.renderFile('src/config/pdf/templates/invoice.ejs',{data:temparray,domain});
    }
    return renderData;
   
}
