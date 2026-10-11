import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().trim().email('Informe um endereço de e-mail válido.'),
  consent: z.literal(true, {
    message: 'Você precisa aceitar receber as comunicações do DIYSPUR.',
  }),
}).strict();

describe('newsletter subscription schema', () => {
  it('accepts valid email with consent', () => {
    const result = subscribeSchema.safeParse({
      email: 'leitor@diyspur.com',
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email or missing consent', () => {
    expect(subscribeSchema.safeParse({ email: 'invalido', consent: true }).success).toBe(false);
    expect(subscribeSchema.safeParse({ email: 'leitor@diyspur.com', consent: false }).success).toBe(false);
  });
});
