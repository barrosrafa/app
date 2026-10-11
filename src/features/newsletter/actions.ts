'use server';

import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabase/clients';
import { mapDatabaseError } from '@/lib/actions/database-errors';

const subscribeSchema = z.object({
  email: z.string().trim().email('Informe um endereço de e-mail válido.'),
  consent: z.literal(true, {
    message: 'Você precisa aceitar receber as comunicações do DIYSPUR.',
  }),
}).strict();

export async function subscribeNewsletter(input: unknown) {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'E-mail inválido.' };
  }

  const client = await createServerSupabase();
  const { data: claims } = await client.auth.getClaims();
  const userId = typeof claims?.claims?.sub === 'string' ? claims.claims.sub : null;

  const { error } = await client
    .from('newsletter_subscribers')
    .upsert(
      {
        email: parsed.data.email.toLowerCase(),
        user_id: userId,
        status: 'active',
        source: 'web_form',
        confirmed_at: new Date().toISOString(),
      },
      { onConflict: 'email' },
    );

  if (error) {
    console.error('Newsletter subscription failed', error.code);
    return { ok: false, ...mapDatabaseError(error.code) };
  }

  return { ok: true, message: 'Inscrição confirmada! Você receberá novidades e datas de leitura do clube.' };
}
