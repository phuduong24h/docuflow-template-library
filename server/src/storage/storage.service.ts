import fs from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import { AppError } from '../shared/errors/app-error.js';

export class StorageService {
  private readonly storageRoot: string;

  constructor(storageRoot = env.STORAGE_ROOT) {
    this.storageRoot = path.resolve(storageRoot);
  }

  /**
   * Resolves a relative storage path safely, preventing directory traversal.
   * Throws AppError if path attempts to escape the storage root or contains invalid sequences.
   */
  public resolveSafePath(relativeFilePath: string): string {
    if (!relativeFilePath || typeof relativeFilePath !== 'string') {
      throw AppError.accessDenied('Invalid path supplied');
    }

    // Prevent null byte injection and normalization attacks
    if (relativeFilePath.includes('\0')) {
      throw AppError.accessDenied('Invalid path characters detected');
    }

    // Explicitly reject explicit path traversal patterns
    if (relativeFilePath.includes('..')) {
      throw AppError.accessDenied('Path traversal sequence detected');
    }

    // Resolve against storageRoot
    const absolutePath = path.resolve(this.storageRoot, relativeFilePath);

    // Verify containment within storageRoot
    const relativeToRoot = path.relative(this.storageRoot, absolutePath);
    if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
      throw AppError.accessDenied('Path traversal attempt prevented');
    }

    return absolutePath;
  }

  /**
   * Checks if a file exists in the storage directory.
   */
  public async fileExists(relativeFilePath: string): Promise<boolean> {
    try {
      const absPath = this.resolveSafePath(relativeFilePath);
      await fs.access(absPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets file stats (size, modified time).
   */
  public async getFileStats(relativeFilePath: string) {
    const absPath = this.resolveSafePath(relativeFilePath);
    try {
      return await fs.stat(absPath);
    } catch {
      throw AppError.fileNotFound(`File not found: ${relativeFilePath}`);
    }
  }

  /**
   * Clones a file from a source path to a destination path.
   * Guarantees template immutability by creating an independent physical copy.
   */
  public async cloneFile(sourceRelPath: string, destRelPath: string): Promise<{ size: number }> {
    const sourceAbs = this.resolveSafePath(sourceRelPath);
    const destAbs = this.resolveSafePath(destRelPath);

    if (!existsSync(sourceAbs)) {
      throw AppError.fileNotFound(`Source template file not found: ${sourceRelPath}`);
    }

    // Ensure destination directory exists
    const destDir = path.dirname(destAbs);
    await fs.mkdir(destDir, { recursive: true });

    try {
      await fs.copyFile(sourceAbs, destAbs);
      const stat = await fs.stat(destAbs);
      return { size: stat.size };
    } catch (err) {
      try {
        await fs.unlink(destAbs);
      } catch {
        // ignore
      }
      throw AppError.storageError('Failed to clone file to destination storage', err);
    }
  }

  /**
   * Writes buffer or string directly to a relative storage path safely.
   */
  public async writeFile(relativeFilePath: string, content: Buffer | string): Promise<number> {
    const absPath = this.resolveSafePath(relativeFilePath);
    const dir = path.dirname(absPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(absPath, content);
    const stat = await fs.stat(absPath);
    return stat.size;
  }

  /**
   * Reads file as buffer.
   */
  public async readFile(relativeFilePath: string): Promise<Buffer> {
    const absPath = this.resolveSafePath(relativeFilePath);
    if (!existsSync(absPath)) {
      throw AppError.fileNotFound(`File not found: ${relativeFilePath}`);
    }
    return fs.readFile(absPath);
  }

  /**
   * Creates a read stream for file downloads.
   */
  public getReadStream(relativeFilePath: string) {
    const absPath = this.resolveSafePath(relativeFilePath);
    if (!existsSync(absPath)) {
      throw AppError.fileNotFound(`File not found: ${relativeFilePath}`);
    }
    return createReadStream(absPath);
  }

  /**
   * Deletes a file safely (e.g. for rollback or document deletion).
   */
  public async deleteFile(relativeFilePath: string): Promise<void> {
    const absPath = this.resolveSafePath(relativeFilePath);
    try {
      await fs.unlink(absPath);
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw AppError.storageError(`Failed to delete file: ${relativeFilePath}`, err);
      }
    }
  }
}

export const storageService = new StorageService();
