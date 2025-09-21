import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { config } from './config'
import { ApiError } from './types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          status: error.response?.status || 500,
          errors: error.response?.data?.errors,
        }
        return Promise.reject(apiError)
      }
    )
  }

  // Token management
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(config.auth.tokenKey, token)
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(config.auth.tokenKey)
    }
    return null
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(config.auth.tokenKey)
      localStorage.removeItem(config.auth.refreshTokenKey)
    }
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config)
    return response.data
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
