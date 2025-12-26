/**
 * Sistema de Cache em Memória
 * 
 * Cache simples e eficiente para reduzir carga no banco de dados
 * e melhorar performance de queries frequentes.
 * 
 * Features:
 * - TTL (Time To Live) configurável
 * - Invalidação manual e automática
 * - Estatísticas de hit/miss
 * - Namespace support
 * - Type-safe com generics
 */

import { logger } from "./logger";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
}

export class Cache {
  private store = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
  };
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    private defaultTTL: number = 5 * 60 * 1000, // 5 minutos
    private maxSize: number = 1000 // Máximo de itens no cache
  ) {
    // Cleanup automático a cada minuto
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);

    logger.info("Cache initialized", {
      defaultTTL: `${defaultTTL}ms`,
      maxSize,
    });
  }

  /**
   * Obter valor do cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Verificar se expirou
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.stats.misses++;
      this.stats.size--;
      return null;
    }

    this.stats.hits++;
    return entry.value as T;
  }

  /**
   * Definir valor no cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    // Verificar limite de tamanho
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      // Remover item mais antigo (FIFO)
      const firstKey = this.store.keys().next().value;
      if (firstKey) {
        this.store.delete(firstKey);
        this.stats.size--;
      }
    }

    const expiresAt = Date.now() + (ttl || this.defaultTTL);

    this.store.set(key, { value, expiresAt });
    this.stats.sets++;
    this.stats.size = this.store.size;
  }

  /**
   * Verificar se chave existe no cache
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    // Verificar se expirou
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.stats.size--;
      return false;
    }

    return true;
  }

  /**
   * Deletar chave do cache
   */
  delete(key: string): boolean {
    const deleted = this.store.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.stats.size--;
    }
    return deleted;
  }

  /**
   * Deletar múltiplas chaves por pattern
   */
  deletePattern(pattern: string | RegExp): number {
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    let deleted = 0;

    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
        deleted++;
      }
    }

    this.stats.deletes += deleted;
    this.stats.size = this.store.size;

    return deleted;
  }

  /**
   * Limpar cache completo
   */
  clear(): void {
    this.store.clear();
    this.stats.size = 0;
    logger.info("Cache cleared");
  }

  /**
   * Cleanup de itens expirados
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.stats.size = this.store.size;
      logger.debug("Cache cleanup completed", { cleaned });
    }
  }

  /**
   * Obter estatísticas do cache
   */
  getStats(): CacheStats & { hitRate: string } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : "0.00";

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
    };
  }

  /**
   * Resetar estatísticas
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      size: this.store.size,
    };
  }

  /**
   * Destruir cache (cleanup)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
    logger.info("Cache destroyed");
  }

  /**
   * Helper: Get or Set (fetch if not in cache)
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Tentar obter do cache
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Buscar valor
    const value = await fetcher();

    // Armazenar no cache
    this.set(key, value, ttl);

    return value;
  }
}

/**
 * Namespace Cache - Para organizar caches por domínio
 */
export class NamespacedCache {
  private cache: Cache;
  private namespace: string;

  constructor(cache: Cache, namespace: string) {
    this.cache = cache;
    this.namespace = namespace;
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  get<T>(key: string): T | null {
    return this.cache.get<T>(this.getKey(key));
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(this.getKey(key), value, ttl);
  }

  has(key: string): boolean {
    return this.cache.has(this.getKey(key));
  }

  delete(key: string): boolean {
    return this.cache.delete(this.getKey(key));
  }

  clear(): void {
    this.cache.deletePattern(`^${this.namespace}:`);
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    return this.cache.getOrSet(this.getKey(key), fetcher, ttl);
  }
}

// Singleton instance
export const cache = new Cache();

/**
 * Helper para criar cache com namespace
 */
export function createNamespacedCache(namespace: string): NamespacedCache {
  return new NamespacedCache(cache, namespace);
}

/**
 * Decorador para cachear resultados de métodos
 */
export function Cacheable(ttl?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
      
      return cache.getOrSet(
        cacheKey,
        () => originalMethod.apply(this, args),
        ttl
      );
    };

    return descriptor;
  };
}
