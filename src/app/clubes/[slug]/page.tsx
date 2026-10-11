import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClubPage } from '@/features/clubs/queries';
import { ClubMembershipActions } from '@/components/clubs/club-membership-actions';
import { ClubManagement } from '@/components/clubs/club-management';
import { createServerSupabase } from '@/lib/supabase/clients';

export const metadata: Metadata = { title: 'Clube de leitura', robots: { index: false, follow: false } };

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getClubPage(slug);
  if (!data.club) notFound();
  const club = data.club;
  const isOwner = data.userId === club.owner_id;
  const adminData = isOwner ? await (async () => { const client = await createServerSupabase(); const [{ data: members }, { data: invitations }] = await Promise.all([client.from('user_club_members').select('user_id,role').eq('club_id', club.id).order('joined_at'), client.from('user_club_invitations').select('id,invited_user_id,expires_at').eq('club_id', club.id).is('accepted_at', null).is('revoked_at', null).order('created_at', { ascending: false })]); return { members: members ?? [], invitations: invitations ?? [] }; })() : null;
  return <section className="container"><header className="page-intro"><span className="eyebrow">{club.is_private ? 'Clube privado' : 'Clube público'}</span><h1>{club.name}</h1>{club.description && <p>{club.description}</p>}</header><div className="member-grid"><main className="member-card"><div className="section-head"><div><span className="eyebrow">Comunidade</span><h2>{data.totalMembers} {data.totalMembers === 1 ? 'leitor' : 'leitores'}</h2></div><ClubMembershipActions clubId={club.id} isMember={data.isMember} isOwner={isOwner} isPrivate={club.is_private} /></div><p>O painel de leitura do clube aparecerá aqui quando um livro e uma temporada forem definidos pelo responsável.</p></main><aside className="chapter-aside"><h2>Acesso</h2><p>{isOwner ? 'Você é o responsável por este clube.' : data.isMember ? 'Você participa deste clube.' : club.is_private ? 'Este clube aceita leitores por convite.' : 'Entre para acompanhar a leitura.'}</p></aside></div>{adminData && <section className="section"><ClubManagement club={{ id: club.id, slug: club.slug, version: club.version, name: club.name, description: club.description, is_private: club.is_private }} members={adminData.members} invitations={adminData.invitations} /></section>}</section>;
}
