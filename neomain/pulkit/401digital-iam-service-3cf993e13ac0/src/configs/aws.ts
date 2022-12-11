import { Injectable, NotFoundException } from '@nestjs/common';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { S3 } from 'aws-sdk';

import {
    AWS_ACCESS_KEY_ID,
    AWS_S3_BUCKET_NAME,
    AWS_SECRET_ACCESS_KEY,
} from '../environment';

@Injectable()
export class AwsService {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        });
    }

    public getS3() {
        return this.s3;
    }

    public uploadSingle(file: any, prefix: string, fileName?: string) {
        let formatedName: string;
        if (fileName) {
            formatedName = `${prefix}/${fileName}`;
        } else {
            formatedName = `${prefix}/${uuid()}-${Date.now()}`;
        }
        formatedName = formatedName.concat(path.extname(file.originalname));
        return this.uploadS3(file.buffer, AWS_S3_BUCKET_NAME, formatedName);
    }

    async uploadMultiple(files: any[], prefix: string, fileName?: string) {
        const promises: Array<Promise<S3.ManagedUpload.SendData>> = [];
        if (!prefix) throw new NotFoundException('Folder name not given');
        if (!files.length) throw new NotFoundException('No files added');
        for (const file of files) {
            const { originalname } = file;
            let formatedName: string = null;
            if (fileName) {
                formatedName = `${prefix}/${fileName}${path.extname(originalname)}`;
            } else {
                formatedName = `${prefix}/${uuid()}-${Date.now()}${path.extname(
                    originalname,
                )}`;
            }
            promises.push(
                this.uploadS3(file.buffer, AWS_S3_BUCKET_NAME, formatedName),
            );
        }
        return promises;
    }

    async uploadS3(file: any, bucket: string, name: string) {
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: 'public-read',
        };
        return this.s3.upload(params).promise();
    }

    async getFile(key) {
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        };
        return await this.s3.getSignedUrl('getObject', params);
    }
    async getFolderitems(param) {
        const s3Params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Prefix: `${param.folder}/`,
        };
        console.log(s3Params);

        const folderItems = await this.s3.listObjects(s3Params).promise();
        if (!folderItems.Contents.length)
            throw new NotFoundException('No folder found');
        return folderItems;
    }

    async deleteFile(Key) {
        try {
            const s3Deleteparam = {
                Bucket: AWS_S3_BUCKET_NAME,
                Delete: {
                    Objects: [
                        {
                            Key,
                        },
                    ],
                },
            };
            const deleteData = await this.s3.deleteObjects(s3Deleteparam).promise();
            console.log('----AWS Delete FILE --- ');

            return {
                success: true,
                data: deleteData,
            };
        } catch (error) {
            return {
                success: false,
                data: error,
            };
        }
    }
    async deleteFolder(folderName) {
        const deleteKeys = [];
        const s3Params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Prefix: `${folderName}/`,
        };
        console.log(s3Params);

        const folderItems = await this.s3.listObjects(s3Params).promise();
        if (!folderItems.Contents.length)
            throw new NotFoundException('No folder found');
        const s3Deleteparam = {
            Bucket: AWS_S3_BUCKET_NAME,
            Delete: {
                Objects: [],
            },
        };
        folderItems.Contents.forEach((c) => {
            console.log(c.Key);
            s3Deleteparam.Delete.Objects.push({
                Key: c.Key,
            });
        });
        console.log(s3Deleteparam);

        const deleteData = await this.s3.deleteObjects(s3Deleteparam).promise();
        console.log(deleteKeys);

        return {
            folderItems: folderItems.Contents,
            deleteData,
        };
    }

    getKeyFromUrl(url: string) {
        const path = (new URL(url)).pathname;
        return path.slice(1)
    }
}
