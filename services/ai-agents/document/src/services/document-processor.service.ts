import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as natural from 'natural';
import * as compromise from 'compromise';

@Injectable()
export class DocumentProcessorService {
  async processDocument(filePath: string, options: any = {}) {
    const fileExtension = path.extname(filePath).toLowerCase();

    try {
      let result;

      switch (fileExtension) {
        case '.pdf':
          result = await this.processPDF(filePath, options);
          break;
        case '.docx':
          result = await this.processDOCX(filePath, options);
          break;
        case '.doc':
          result = await this.processDOC(filePath, options);
          break;
        case '.txt':
          result = await this.processTXT(filePath, options);
          break;
        case '.jpg':
        case '.jpeg':
        case '.png':
          result = await this.processImage(filePath, options);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      return {
        success: true,
        ...result,
        processedAt: new Date(),
      };
    } catch (error) {
      throw new Error(`Document processing failed: ${error.message}`);
    }
  }

  private async processPDF(filePath: string, options: any) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    const text = data.text;
    const metadata = {
      pages: data.numpages,
      version: data.version,
      info: data.info,
    };

    const extractedData = this.extractStructuredData(text, 'pdf');
    const analysis = this.analyzeContent(text);

    return {
      type: 'pdf',
      text,
      metadata,
      extractedData,
      analysis,
      pageCount: data.numpages,
    };
  }

  private async processDOCX(filePath: string, options: any) {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;
    const messages = result.messages;

    const extractedData = this.extractStructuredData(text, 'docx');
    const analysis = this.analyzeContent(text);

    return {
      type: 'docx',
      text,
      messages,
      extractedData,
      analysis,
    };
  }

  private async processDOC(filePath: string, options: any) {
    // For .doc files, we might need additional libraries
    // For now, return basic processing
    const text = 'DOC file processing - basic text extraction';

    const extractedData = this.extractStructuredData(text, 'doc');
    const analysis = this.analyzeContent(text);

    return {
      type: 'doc',
      text,
      extractedData,
      analysis,
      note: 'Basic processing for legacy DOC format',
    };
  }

  private async processTXT(filePath: string, options: any) {
    const text = fs.readFileSync(filePath, 'utf8');

    const extractedData = this.extractStructuredData(text, 'txt');
    const analysis = this.analyzeContent(text);

    return {
      type: 'txt',
      text,
      extractedData,
      analysis,
    };
  }

  private async processImage(filePath: string, options: any) {
    // For image processing, we would use OCR
    // For now, return placeholder
    const text = 'OCR processing would extract text from image';

    const extractedData = this.extractStructuredData(text, 'image');
    const analysis = this.analyzeContent(text);

    return {
      type: 'image',
      text,
      extractedData,
      analysis,
      note: 'OCR processing for image documents',
    };
  }

  private extractStructuredData(text: string, documentType: string) {
    const extractedData: any = {
      entities: [],
      dates: [],
      numbers: [],
      keyValuePairs: [],
    };

    // Extract dates
    const dateRegex = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g;
    const dates = text.match(dateRegex) || [];
    extractedData.dates = dates;

    // Extract numbers (potential amounts, quantities)
    const numberRegex = /\b\d+(\.\d+)?\b/g;
    const numbers = text.match(numberRegex) || [];
    extractedData.numbers = numbers;

    // Extract potential key-value pairs
    const kvRegex = /(\w+):\s*([^\n\r]+)/g;
    let match;
    while ((match = kvRegex.exec(text)) !== null) {
      extractedData.keyValuePairs.push({
        key: match[1],
        value: match[2],
      });
    }

    // Document type specific extraction
    if (documentType === 'pdf') {
      extractedData.certificateInfo = this.extractCertificateInfo(text);
      extractedData.supplierInfo = this.extractSupplierInfo(text);
    }

    return extractedData;
  }

  private extractCertificateInfo(text: string) {
    const certificateInfo: any = {};

    // Look for certificate numbers
    const certRegex = /(?:certificate|cert)\s*#?\s*:?\s*([A-Z0-9\-]+)/i;
    const certMatch = text.match(certRegex);
    if (certMatch) {
      certificateInfo.number = certMatch[1];
    }

    // Look for issue dates
    const issueRegex = /(?:issued?|issue date)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    const issueMatch = text.match(issueRegex);
    if (issueMatch) {
      certificateInfo.issueDate = issueMatch[1];
    }

    // Look for expiry dates
    const expiryRegex = /(?:expir|valid until|expiry)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    const expiryMatch = text.match(expiryRegex);
    if (expiryMatch) {
      certificateInfo.expiryDate = expiryMatch[1];
    }

    return certificateInfo;
  }

  private extractSupplierInfo(text: string) {
    const supplierInfo: any = {};

    // Look for supplier names
    const supplierRegex = /(?:supplier|vendor|company)\s*:?\s*([^\n\r]+)/i;
    const supplierMatch = text.match(supplierRegex);
    if (supplierMatch) {
      supplierInfo.name = supplierMatch[1].trim();
    }

    // Look for addresses
    const addressRegex = /(?:address)\s*:?\s*([^\n\r]+)/i;
    const addressMatch = text.match(addressRegex);
    if (addressMatch) {
      supplierInfo.address = addressMatch[1].trim();
    }

    return supplierInfo;
  }

  private analyzeContent(text: string) {
    // Basic content analysis
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);

    // Language detection (simplified)
    const language = this.detectLanguage(text);

    // Readability analysis
    const readability = this.calculateReadability(text);

    // Topic extraction
    const topics = this.extractTopics(text);

    // Sentiment analysis (simplified)
    const sentiment = this.analyzeSentiment(text);

    return {
      statistics: {
        characters: text.length,
        words: words.length,
        sentences: sentences.length,
        paragraphs: text.split(/\n\s*\n/).length,
        averageWordsPerSentence: words.length / sentences.length,
      },
      language,
      readability,
      topics,
      sentiment,
      complexity: this.assessComplexity(text),
    };
  }

  private detectLanguage(text: string): string {
    // Simplified language detection
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of'];
    const malayWords = ['dan', 'atau', 'tetapi', 'di', 'ke', 'dari', 'untuk', 'dengan'];

    const lowerText = text.toLowerCase();
    let englishScore = 0;
    let malayScore = 0;

    englishWords.forEach(word => {
      if (lowerText.includes(word)) englishScore++;
    });

    malayWords.forEach(word => {
      if (lowerText.includes(word)) malayScore++;
    });

    if (englishScore > malayScore) return 'en';
    if (malayScore > englishScore) return 'ms';
    return 'unknown';
  }

  private calculateReadability(text: string): any {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const syllables = this.countSyllables(text);

    // Simplified Flesch Reading Ease
    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);

    return {
      fleschScore: Math.round(fleschScore),
      level: this.getReadabilityLevel(fleschScore),
      averageSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      averageSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10,
    };
  }

  private countSyllables(text: string): number {
    // Simplified syllable counting
    return text.split(/\s+/)
      .filter(word => word.length > 0)
      .reduce((count, word) => {
        return count + (word.match(/[aeiouy]{1,2}/gi) || []).length;
      }, 0);
  }

  private getReadabilityLevel(score: number): string {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  }

  private extractTopics(text: string): string[] {
    // Use compromise for NLP
    const doc = compromise(text);
    const nouns = doc.nouns().out('array');
    const topics = [...new Set(nouns)].slice(0, 10); // Top 10 unique topics

    return topics;
  }

  private analyzeSentiment(text: string): any {
    // Simplified sentiment analysis
    const positiveWords = ['good', 'excellent', 'great', 'positive', 'success', 'approved', 'valid'];
    const negativeWords = ['bad', 'poor', 'terrible', 'negative', 'failure', 'rejected', 'invalid'];

    const lowerText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    positiveWords.forEach(word => {
      const count = (lowerText.match(new RegExp(word, 'g')) || []).length;
      positiveScore += count;
    });

    negativeWords.forEach(word => {
      const count = (lowerText.match(new RegExp(word, 'g')) || []).length;
      negativeScore += count;
    });

    const total = positiveScore + negativeScore;
    const sentiment = total > 0 ? (positiveScore - negativeScore) / total : 0;

    return {
      score: sentiment,
      label: sentiment > 0.1 ? 'positive' : sentiment < -0.1 ? 'negative' : 'neutral',
      positiveWords: positiveScore,
      negativeWords: negativeScore,
    };
  }

  private assessComplexity(text: string): string {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgSentenceLength = words / sentences;

    if (avgSentenceLength > 25) return 'high';
    if (avgSentenceLength > 15) return 'medium';
    return 'low';
  }

  async validateDocumentStructure(document: any, rules: any = {}): Promise<any> {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      score: 1.0,
    };

    // Check required fields
    if (rules.requiredFields) {
      for (const field of rules.requiredFields) {
        if (!document[field]) {
          validation.errors.push(`Missing required field: ${field}`);
          validation.isValid = false;
          validation.score -= 0.2;
        }
      }
    }

    // Check document type specific requirements
    if (document.type === 'certificate') {
      if (!document.extractedData?.certificateNumber) {
        validation.warnings.push('Certificate number not found');
        validation.score -= 0.1;
      }
      if (!document.extractedData?.expiryDate) {
        validation.warnings.push('Expiry date not found');
        validation.score -= 0.1;
      }
    }

    validation.score = Math.max(0, validation.score);
    return validation;
  }

  async convertDocument(inputPath: string, outputPath: string, targetFormat: string): Promise<any> {
    // Simulate document conversion
    const conversion = {
      inputPath,
      outputPath,
      targetFormat,
      status: 'processing',
      progress: 0,
    };

    // Simulate conversion process
    const steps = ['reading', 'parsing', 'converting', 'writing'];
    let progress = 0;

    for (const step of steps) {
      progress += 25;
      conversion.progress = progress;
      // Simulate async step
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    conversion.status = 'completed';
    conversion.progress = 100;
    conversion.completedAt = new Date();

    return conversion;
  }
}
