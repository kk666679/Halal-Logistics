import { Injectable, Logger } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import * as path from 'path';

export interface MLModelConfig {
  modelType: 'image_classification' | 'defect_detection' | 'quality_prediction' | 'anomaly_detection';
  modelPath?: string;
  confidenceThreshold: number;
  inputShape: number[];
  outputShape: number[];
}

export interface QualityPrediction {
  qualityScore: number;
  confidence: number;
  defects: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: { x: number; y: number; width: number; height: number };
    confidence: number;
  }>;
  recommendations: string[];
  processingTime: number;
}

export interface TrainingData {
  input: number[][][];
  output: number[];
  metadata: {
    productId: string;
    qualityScore: number;
    defects: string[];
    timestamp: string;
  };
}

@Injectable()
export class MLQualityService {
  private readonly logger = new Logger(MLQualityService.name);
  private models: Map<string, tf.LayersModel> = new Map();
  private modelConfigs: Map<string, MLModelConfig> = new Map();

  constructor() {
    this.initializeModels();
  }

  /**
   * Initialize ML models for quality control
   */
  private async initializeModels(): Promise<void> {
    try {
      this.logger.log('Initializing ML models for quality control...');

      // Define model configurations
      const modelConfigs: MLModelConfig[] = [
        {
          modelType: 'image_classification',
          confidenceThreshold: 0.8,
          inputShape: [224, 224, 3],
          outputShape: [1000], // ImageNet classes
        },
        {
          modelType: 'defect_detection',
          confidenceThreshold: 0.7,
          inputShape: [416, 416, 3],
          outputShape: [13, 13, 125], // YOLOv3 output
        },
        {
          modelType: 'quality_prediction',
          confidenceThreshold: 0.75,
          inputShape: [1, 50], // Time series input
          outputShape: [1], // Quality score prediction
        },
        {
          modelType: 'anomaly_detection',
          confidenceThreshold: 0.85,
          inputShape: [1, 100], // Feature vector
          outputShape: [1], // Anomaly score
        },
      ];

      // Initialize model configurations
      for (const config of modelConfigs) {
        this.modelConfigs.set(config.modelType, config);
        await this.loadOrCreateModel(config);
      }

      this.logger.log('ML models initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize ML models', error);
    }
  }

  /**
   * Load existing model or create new one
   */
  private async loadOrCreateModel(config: MLModelConfig): Promise<void> {
    const modelPath = config.modelPath || `./models/${config.modelType}`;

    try {
      if (fs.existsSync(modelPath)) {
        this.logger.log(`Loading existing model: ${config.modelType}`);
        const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
        this.models.set(config.modelType, model);
      } else {
        this.logger.log(`Creating new model: ${config.modelType}`);
        const model = await this.createModel(config);
        this.models.set(config.modelType, model);
      }
    } catch (error) {
      this.logger.error(`Failed to load/create model ${config.modelType}`, error);
    }
  }

  /**
   * Create ML model based on configuration
   */
  private async createModel(config: MLModelConfig): Promise<tf.LayersModel> {
    const { modelType, inputShape, outputShape } = config;

    switch (modelType) {
      case 'image_classification':
        return this.createImageClassificationModel(inputShape, outputShape);

      case 'defect_detection':
        return this.createDefectDetectionModel(inputShape, outputShape);

      case 'quality_prediction':
        return this.createQualityPredictionModel(inputShape, outputShape);

      case 'anomaly_detection':
        return this.createAnomalyDetectionModel(inputShape, outputShape);

      default:
        throw new Error(`Unknown model type: ${modelType}`);
    }
  }

  /**
   * Create image classification model (MobileNetV2-based)
   */
  private createImageClassificationModel(inputShape: number[], outputShape: number[]): tf.LayersModel {
    const model = tf.sequential();

    // MobileNetV2 architecture (simplified)
    model.add(tf.layers.conv2d({
      inputShape,
      filters: 32,
      kernelSize: 3,
      strides: 2,
      activation: 'relu',
      padding: 'same'
    }));

    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.depthwiseConv2d({
      kernelSize: 3,
      strides: 1,
      activation: 'relu',
      padding: 'same'
    }));

    model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 1,
      activation: 'relu'
    }));

    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.depthwiseConv2d({
      kernelSize: 3,
      strides: 2,
      activation: 'relu',
      padding: 'same'
    }));

    model.add(tf.layers.conv2d({
      filters: 128,
      kernelSize: 1,
      activation: 'relu'
    }));

    model.add(tf.layers.globalAveragePooling2d());
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: outputShape[0], activation: 'softmax' }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * Create defect detection model (YOLOv3-based)
   */
  private createDefectDetectionModel(inputShape: number[], outputShape: number[]): tf.LayersModel {
    const model = tf.sequential();

    // YOLOv3-inspired architecture
    model.add(tf.layers.conv2d({
      inputShape,
      filters: 32,
      kernelSize: 3,
      activation: 'relu',
      padding: 'same'
    }));

    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      activation: 'relu',
      padding: 'same'
    }));

    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    model.add(tf.layers.conv2d({
      filters: 128,
      kernelSize: 3,
      activation: 'relu',
      padding: 'same'
    }));

    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 1,
      activation: 'relu'
    }));

    model.add(tf.layers.conv2d({
      filters: 128,
      kernelSize: 3,
      activation: 'relu',
      padding: 'same'
    }));

    model.add(tf.layers.globalAveragePooling2d());
    model.add(tf.layers.dense({ units: outputShape.reduce((a, b) => a * b), activation: 'sigmoid' }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * Create quality prediction model (LSTM-based)
   */
  private createQualityPredictionModel(inputShape: number[], outputShape: number[]): tf.LayersModel {
    const model = tf.sequential();

    model.add(tf.layers.lstm({
      inputShape,
      units: 64,
      returnSequences: true
    }));

    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.lstm({
      units: 32,
      returnSequences: false
    }));

    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.1 }));
    model.add(tf.layers.dense({ units: outputShape[0], activation: 'linear' }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  /**
   * Create anomaly detection model (Autoencoder-based)
   */
  private createAnomalyDetectionModel(inputShape: number[], outputShape: number[]): tf.LayersModel {
    const model = tf.sequential();

    // Encoder
    model.add(tf.layers.dense({
      inputShape,
      units: 64,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.1 }));
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.1 }));
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));

    // Decoder
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.1 }));
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.1 }));
    model.add(tf.layers.dense({
      units: inputShape[1],
      activation: 'sigmoid'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * Analyze product image using ML models
   */
  async analyzeProductImage(
    imageBuffer: Buffer,
    productType: string,
    qualityStandards: string[]
  ): Promise<QualityPrediction> {
    const startTime = Date.now();

    try {
      this.logger.log(`Analyzing product image for type: ${productType}`);

      // Preprocess image
      const tensor = await this.preprocessImage(imageBuffer);

      // Run defect detection
      const defectResults = await this.detectDefects(tensor);

      // Run quality classification
      const qualityResults = await this.classifyQuality(tensor, productType);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        defectResults,
        qualityResults,
        qualityStandards
      );

      const processingTime = Date.now() - startTime;

      return {
        qualityScore: qualityResults.score,
        confidence: Math.min(defectResults.confidence, qualityResults.confidence),
        defects: defectResults.defects,
        recommendations,
        processingTime,
      };
    } catch (error) {
      this.logger.error('Failed to analyze product image', error);
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  /**
   * Predict quality based on historical data
   */
  async predictQuality(
    historicalData: number[][],
    productId: string,
    predictionHorizon: number = 1
  ): Promise<QualityPrediction> {
    try {
      this.logger.log(`Predicting quality for product: ${productId}`);

      const model = this.models.get('quality_prediction');
      if (!model) {
        throw new Error('Quality prediction model not available');
      }

      // Prepare input data
      const inputTensor = tf.tensor3d([historicalData]);

      // Make prediction
      const prediction = model.predict(inputTensor) as tf.Tensor;
      const qualityScore = (await prediction.data())[0];

      // Generate confidence based on prediction variance
      const confidence = this.calculatePredictionConfidence(historicalData, qualityScore);

      // Detect anomalies in recent data
      const anomalies = await this.detectAnomalies(historicalData);

      const recommendations = this.generatePredictionRecommendations(
        qualityScore,
        confidence,
        anomalies
      );

      return {
        qualityScore: Math.max(0, Math.min(1, qualityScore)),
        confidence,
        defects: anomalies.map(anomaly => ({
          type: 'anomaly',
          severity: anomaly.severity,
          location: anomaly.location,
          confidence: anomaly.confidence,
        })),
        recommendations,
        processingTime: Date.now() - Date.now(), // Would need actual timing
      };
    } catch (error) {
      this.logger.error('Failed to predict quality', error);
      throw new Error(`Quality prediction failed: ${error.message}`);
    }
  }

  /**
   * Train ML model with new data
   */
  async trainModel(
    modelType: string,
    trainingData: TrainingData[],
    epochs: number = 10,
    batchSize: number = 32
  ): Promise<{ accuracy: number; loss: number; trainingTime: number }> {
    const startTime = Date.now();

    try {
      this.logger.log(`Training ${modelType} model with ${trainingData.length} samples`);

      const model = this.models.get(modelType);
      if (!model) {
        throw new Error(`Model ${modelType} not found`);
      }

      // Prepare training data
      const inputs = tf.tensor3d(trainingData.map(d => d.input));
      const outputs = tf.tensor2d(trainingData.map(d => d.output));

      // Train the model
      const history = await model.fit(inputs, outputs, {
        epochs,
        batchSize,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            this.logger.log(`Epoch ${epoch + 1}/${epochs} - loss: ${logs?.loss?.toFixed(4)} - val_loss: ${logs?.val_loss?.toFixed(4)}`);
          }
        }
      });

      const trainingTime = Date.now() - startTime;

      // Save trained model
      await this.saveModel(modelType);

      return {
        accuracy: history.history.acc ? history.history.acc[epochs - 1] as number : 0,
        loss: history.history.loss ? history.history.loss[epochs - 1] as number : 0,
        trainingTime,
      };
    } catch (error) {
      this.logger.error(`Failed to train ${modelType} model`, error);
      throw new Error(`Model training failed: ${error.message}`);
    }
  }

  /**
   * Preprocess image for ML analysis
   */
  private async preprocessImage(imageBuffer: Buffer): Promise<tf.Tensor> {
    // Decode image buffer to tensor
    const imageTensor = tf.node.decodeImage(imageBuffer);

    // Resize to model input size
    const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);

    // Normalize pixel values
    const normalized = resized.div(255.0);

    // Add batch dimension
    const batched = normalized.expandDims(0);

    return batched;
  }

  /**
   * Detect defects in product image
   */
  private async detectDefects(imageTensor: tf.Tensor): Promise<{
    defects: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      location: { x: number; y: number; width: number; height: number };
      confidence: number;
    }>;
    confidence: number;
  }> {
    const model = this.models.get('defect_detection');
    if (!model) {
      throw new Error('Defect detection model not available');
    }

    const predictions = model.predict(imageTensor) as tf.Tensor;
    const data = await predictions.data();

    // Process YOLO-style output
    const defects = this.processDefectDetectionOutput(data);

    return {
      defects,
      confidence: 0.8, // Mock confidence
    };
  }

  /**
   * Classify overall product quality
   */
  private async classifyQuality(
    imageTensor: tf.Tensor,
    productType: string
  ): Promise<{ score: number; confidence: number }> {
    const model = this.models.get('image_classification');
    if (!model) {
      throw new Error('Image classification model not available');
    }

    const predictions = model.predict(imageTensor) as tf.Tensor;
    const data = await predictions.data();

    // Convert classification to quality score
    const qualityScore = this.convertClassificationToQuality(data, productType);

    return {
      score: qualityScore,
      confidence: 0.85, // Mock confidence
    };
  }

  /**
   * Generate recommendations based on analysis
   */
  private async generateRecommendations(
    defectResults: any,
    qualityResults: any,
    qualityStandards: string[]
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Quality-based recommendations
    if (qualityResults.score < 0.7) {
      recommendations.push('Improve overall product quality');
      recommendations.push('Review manufacturing process');
    }

    // Defect-based recommendations
    if (defectResults.defects.length > 0) {
      recommendations.push(`Address ${defectResults.defects.length} detected defects`);
      recommendations.push('Increase quality control frequency');
    }

    // Standard-based recommendations
    for (const standard of qualityStandards) {
      if (!this.meetsStandard(qualityResults.score, standard)) {
        recommendations.push(`Ensure compliance with ${standard}`);
      }
    }

    return recommendations;
  }

  /**
   * Detect anomalies in quality data
   */
  private async detectAnomalies(historicalData: number[][]): Promise<Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: { x: number; y: number; width: number; height: number };
    confidence: number;
  }>> {
    const model = this.models.get('anomaly_detection');
    if (!model) {
      return [];
    }

    const anomalies: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical';
      location: { x: number; y: number; width: number; height: number };
      confidence: number;
    }> = [];

    // Process historical data for anomalies
    for (let i = 0; i < historicalData.length; i++) {
      const dataPoint = historicalData[i];
      const anomalyScore = this.calculateAnomalyScore(dataPoint);

      if (anomalyScore > 0.7) {
        anomalies.push({
          severity: anomalyScore > 0.9 ? 'critical' : anomalyScore > 0.8 ? 'high' : anomalyScore > 0.7 ? 'medium' : 'low',
          location: { x: i, y: dataPoint[0], width: 1, height: 1 },
          confidence: anomalyScore,
        });
      }
    }

    return anomalies;
  }

  /**
   * Calculate prediction confidence
   */
  private calculatePredictionConfidence(historicalData: number[][], prediction: number): number {
    // Simple confidence calculation based on data variance
    const variance = this.calculateVariance(historicalData);
    const baseConfidence = 0.9;
    const variancePenalty = Math.min(variance * 0.1, 0.3);

    return Math.max(0.1, baseConfidence - variancePenalty);
  }

  /**
   * Generate prediction-based recommendations
   */
  private generatePredictionRecommendations(
    qualityScore: number,
    confidence: number,
    anomalies: any[]
  ): string[] {
    const recommendations: string[] = [];

    if (qualityScore < 0.7) {
      recommendations.push('Quality score below threshold - investigate production process');
    }

    if (confidence < 0.5) {
      recommendations.push('Low prediction confidence - collect more training data');
    }

    if (anomalies.length > 0) {
      recommendations.push(`${anomalies.length} anomalies detected - review quality control procedures`);
    }

    return recommendations;
  }

  /**
   * Process defect detection model output
   */
  private processDefectDetectionOutput(data: Float32Array): Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: { x: number; y: number; width: number; height: number };
    confidence: number;
  }> {
    // Mock defect detection processing
    return [
      {
        type: 'scratch',
        severity: 'medium',
        location: { x: 100, y: 150, width: 20, height: 10 },
        confidence: 0.85,
      },
    ];
  }

  /**
   * Convert image classification to quality score
   */
  private convertClassificationToQuality(classificationData: Float32Array, productType: string): number {
    // Mock quality score calculation
    const maxIndex = classificationData.indexOf(Math.max(...classificationData));
    const qualityScore = maxIndex / 1000; // Normalize to 0-1 range

    return Math.max(0, Math.min(1, qualityScore));
  }

  /**
   * Check if quality meets standard
   */
  private meetsStandard(qualityScore: number, standard: string): boolean {
    const thresholds: { [key: string]: number } = {
      'ISO9001': 0.8,
      'Halal': 0.85,
      'Premium': 0.9,
      'Standard': 0.7,
    };

    const threshold = thresholds[standard] || 0.7;
    return qualityScore >= threshold;
  }

  /**
   * Calculate anomaly score for data point
   */
  private calculateAnomalyScore(dataPoint: number[]): number {
    // Simple anomaly detection based on deviation from mean
    const mean = dataPoint.reduce((sum, val) => sum + val, 0) / dataPoint.length;
    const variance = dataPoint.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dataPoint.length;
    const stdDev = Math.sqrt(variance);

    // Normalize to 0-1 range
    return Math.min(1, stdDev / 2);
  }

  /**
   * Calculate variance of dataset
   */
  private calculateVariance(data: number[][]): number {
    const allValues = data.flat();
    const mean = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
    const variance = allValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allValues.length;

    return variance;
  }

  /**
   * Save trained model to disk
   */
  private async saveModel(modelType: string): Promise<void> {
    const model = this.models.get(modelType);
    if (!model) {
      throw new Error(`Model ${modelType} not found`);
    }

    const modelPath = `./models/${modelType}`;
    await model.save(`file://${modelPath}`);
    this.logger.log(`Model ${modelType} saved to ${modelPath}`);
  }

  /**
   * Get model performance metrics
   */
  async getModelMetrics(modelType: string): Promise<{
    modelType: string;
    accuracy: number;
    loss: number;
    lastTrained: string;
    trainingSamples: number;
  }> {
    // Mock metrics - in real implementation, would load from model metadata
    return {
      modelType,
      accuracy: 0.85,
      loss: 0.15,
      lastTrained: new Date().toISOString(),
      trainingSamples: 1000,
    };
  }

  /**
   * Health check for ML service
   */
  getHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    models: string[];
    memoryUsage: number;
    timestamp: string;
  } {
    const models = Array.from(this.models.keys());
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (models.length < 4) status = 'degraded';
    if (memoryUsage > 500) status = 'unhealthy';

    return {
      status,
      models,
      memoryUsage: Math.round(memoryUsage * 100) / 100,
      timestamp: new Date().toISOString(),
    };
  }
}
