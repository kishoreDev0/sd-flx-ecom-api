import { Injectable } from '@nestjs/common';
import { baseDir } from 'src/main/config/logger.config';
import { mkdir, appendFile } from 'fs/promises';
import { join } from 'path';
import { timeZone } from '../commons/constants/email/mail.constants';
import * as moment from 'moment-timezone';

interface LogTask {
  type: 'info';
  payload: { level: number; message: string };
}

type LogLevel = 1 | 2 | 3 | 4 | 5;

type PrimitiveData = string | number | boolean | object | null | undefined;
type LoggableObject = { [key: string]: LoggableData };
type LoggableArray = LoggableData[];
type LoggableData = PrimitiveData | LoggableObject | LoggableArray;

@Injectable()
export class CustomLoggerService {
  private _level: number;
  private _filePath: string;
  private _isInitialized = false;
  private _isCreating = false;
  private _isProcessing = false;
  private _queue: LogTask[] = [];
  private readonly baseDir: string = baseDir;

  constructor() {
    this.initializeBaseDirectory().then(() => {
      this._isInitialized = true;
    });
  }

  formatMessage(message: string, data: LoggableData): string {
    if (data === null || data === undefined) {
      return message;
    }

    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      try {
        const formattedJson = JSON.stringify(data, null, 4);
        return `${message}:\n${formattedJson}`;
      } catch (error) {
        return `${message}: [Error formatting object: ${error.message}]`;
      }
    }

    return `${message}: ${data}`;
  }

  create(fileName: string, folderName: string): void {
    if (this._isCreating) {
      console.warn('Create operation already in progress');
      return;
    }

    this._isCreating = true;
    this.createFile(fileName, folderName)
      .then((filePath) => {
        this._level = Number(process.env.LOG_LEVEL);
        this._filePath = filePath;
        const date: Date = new Date(Date.now());
        return appendFile(
          this._filePath,
          String.raw`${
            '*'.repeat(100) +
            '\n' +
            `System Local Time: ${date.toLocaleString()}\nDate and Time: ${
              moment(date).tz(timeZone).format('YYYY-MM-DD HH:mm:ss z') || 'N/A'
            }\t\tTime Zone: ${timeZone || 'N/A'}\nFile: ${fileName.toUpperCase()}\n`
          }`,
          'utf8',
        );
      })
      .then(() => {
        this._isCreating = false;
        this.processQueue();
      })
      .catch((error) => {
        console.error(`Failed to create file: ${error.message}`);
        this._isCreating = false;
      });
  }

  info(level: LogLevel, message: string, data: LoggableData = null): void {
    if (arguments.length === 2 && typeof message === 'string') {
      const matches = message.match(/(.*?):?\s*\${(.+)}$/);
      if (matches) {
        const [, msgPart, dataVariable] = matches;
        try {
          const evaluatedData = eval(dataVariable);
          message = this.formatMessage(msgPart.trim(), evaluatedData);
        } catch (error) {
          message = this.formatMessage(error.message, null);
        }
      }
    } else {
      message = this.formatMessage(message, data);
    }
    if (this._isCreating) {
      this._queue.push({
        type: 'info',
        payload: { level, message },
      });
      return;
    }

    if (this._queue.length > 0) {
      this._queue.push({
        type: 'info',
        payload: { level, message },
      });
      if (!this._isProcessing) {
        this.processQueue();
      }
      return;
    }

    this.processInfo(level, message);
  }

  private processInfo(level: number, message: string): void {
    if (level <= this._level) {
      const timestamp = new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
      this.log(
        `${timestamp} [info] Log Level[${this._level}] ${message}\n`,
        this._filePath,
      ).catch((error) => {
        console.error(`Failed to log info: ${error.message}`);
      });
    }
  }

  private processQueue(): void {
    if (this._isProcessing || this._queue.length === 0) return;

    this._isProcessing = true;
    this.processNextTask();
  }

  private processNextTask(): void {
    if (this._queue.length === 0) {
      this._isProcessing = false;
      return;
    }

    const task = this._queue.shift();
    if (task.type === 'info') {
      this.processInfo(task.payload.level, task.payload.message);
      setTimeout(() => this.processNextTask(), 0);
    }
  }

  private getDateFolderName(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private async ensureDateDirectory(date: Date): Promise<string> {
    const datePath = join(this.baseDir, this.getDateFolderName(date));
    try {
      await mkdir(datePath, { recursive: true });
      return datePath;
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(`Failed to create date directory: ${error.message}`);
      }
      return datePath;
    }
  }

  private async ensureUserDirectory(
    datePath: string,
    folderName: string,
  ): Promise<string> {
    const userPath = join(datePath, folderName);
    try {
      await mkdir(userPath, { recursive: true });
      return userPath;
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(`Failed to create user directory: ${error.message}`);
      }
      return userPath;
    }
  }

  private async createFile(
    fileName: string,
    folderName: string,
  ): Promise<string> {
    if (!this._isInitialized) {
      await this.initializeBaseDirectory();
    }
    try {
      const datePath = await this.ensureDateDirectory(new Date());
      const userPath = await this.ensureUserDirectory(datePath, folderName);
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .split('T')[0];
      const filePath = join(userPath, `${fileName}-${timestamp}.log`);
      return filePath;
    } catch (error) {
      console.error('Error creating logging:', error);
    }
  }

  private async log(messages: string, filePath: string): Promise<void> {
    try {
      await appendFile(filePath, String.raw`${messages}`, 'utf8');
      console.log(`Log entry created: ${filePath}`);
    } catch (error) {
      console.error('Error logging message:', error);
    }
  }

  private async initializeBaseDirectory(): Promise<void> {
    try {
      await mkdir(this.baseDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(`Failed to create base directory: ${error.message}`);
      }
    }
  }

  async onModuleInit(): Promise<void> {
    await this.initializeBaseDirectory();
    this._isInitialized = true;
  }
}
