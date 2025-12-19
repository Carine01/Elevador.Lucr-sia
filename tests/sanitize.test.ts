/**
 * Sanitization Tests
 * 
 * Testes para funções de sanitização de input.
 * LGPD + segurança básica.
 */

import { describe, it, expect } from 'vitest';
import { 
  sanitizeHtml, 
  sanitizeText, 
  sanitizeEmail, 
  sanitizeUrl 
} from '../shared/sanitize';

describe('Sanitize HTML', () => {
  it('remove tags HTML', () => {
    const input = '<script>alert("xss")</script>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('<script>');
    expect(output).toContain('&lt;script&gt;');
  });

  it('escapa caracteres especiais', () => {
    const input = '"><img src=x onerror=alert(1)>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('<img');
    expect(output).toContain('&quot;&gt;&lt;');
  });

  it('retorna string vazia para input vazio', () => {
    expect(sanitizeHtml('')).toBe('');
  });
});

describe('Sanitize Text', () => {
  it('remove caracteres de controle', () => {
    const input = 'Hello\x00World\x1F';
    const output = sanitizeText(input);
    expect(output).toBe('HelloWorld');
  });

  it('preserva texto normal', () => {
    const input = 'Hello World 123';
    const output = sanitizeText(input);
    expect(output).toBe(input);
  });
});

describe('Sanitize Email', () => {
  it('normaliza email para lowercase', () => {
    const input = 'USER@EXAMPLE.COM';
    const output = sanitizeEmail(input);
    expect(output).toBe('user@example.com');
  });

  it('remove caracteres inválidos', () => {
    const input = 'user<script>@example.com';
    const output = sanitizeEmail(input);
    expect(output).not.toContain('<');
    expect(output).not.toContain('>');
  });

  it('remove espaços', () => {
    const input = '  user@example.com  ';
    const output = sanitizeEmail(input);
    expect(output).toBe('user@example.com');
  });
});

describe('Sanitize URL', () => {
  it('bloqueia javascript: scheme', () => {
    const input = 'javascript:alert(1)';
    const output = sanitizeUrl(input);
    expect(output).toBe('');
  });

  it('bloqueia data: scheme', () => {
    const input = 'data:text/html,<script>alert(1)</script>';
    const output = sanitizeUrl(input);
    expect(output).toBe('');
  });

  it('permite URLs normais', () => {
    const input = 'https://example.com/page';
    const output = sanitizeUrl(input);
    expect(output).toBe(input);
  });

  it('remove espaços', () => {
    const input = '  https://example.com  ';
    const output = sanitizeUrl(input);
    expect(output).toBe('https://example.com');
  });
});
